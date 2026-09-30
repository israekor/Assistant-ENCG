import time

from sqlalchemy.orm import Session

from app.db.repositories.retrieval_repository import RetrievalRepository
from app.services.embedding_service import EmbeddingService
from app.services.reranker_service import RerankerService
from app.services.metadata_detector import MetadataDetector


SECTION_BOOST = 0.15
FILIERE_BOOST = 0.15
INTENT_BOOST = 0.10
DIPLOMA_BOOST = 0.15
CATEGORY_BOOST = 0.10

MIN_FALLBACK_CANDIDATES = 3

GLOBAL_SAFETY_NET_K = 5

MAX_RERANK_CANDIDATES = 12


class RetrievalService:

    def __init__(
        self,
        embedding_service: EmbeddingService,
        reranker_service: RerankerService
    ):
        self.embedding_service = embedding_service
        self.reranker_service = reranker_service

    def _apply_metadata_boost(
        self,
        results: list[dict],
        query: str,
        section: str | None,
        filiere: str | None,
        intent: str | None,
    ) -> list[dict]:

        for result in results:

            boost = 0.0

            result_section = result.get("section")
            result_filiere = result.get("filiere")
            content = result.get("content", "").lower()

            # Section boost
            if section and result_section:
                if result_section.lower() == section.lower():
                    boost += SECTION_BOOST

            # Filière boost
            if filiere and result_filiere:
                if result_filiere.lower() == filiere.lower():
                    boost += FILIERE_BOOST

            # Intent boost
            if intent == "LIST":

                # Une question de type liste doit favoriser
                # les chunks contenant des listes.
                if (
                    result_section
                    and (
                        "filière" in result_section.lower()
                        or "parcours" in result_section.lower()
                    )
                ):
                    boost += INTENT_BOOST

                elif any(
                    marker in content
                    for marker in [
                        "- ",
                        "• ",
                        "1.",
                        "2.",
                        "3.",
                    ]
                ):
                    boost += INTENT_BOOST * 0.5

            # Diplomas boost
            if intent == "DIPLOMAS":
                if "diplôme" in content:
                    boost += DIPLOMA_BOOST

            result["metadata_boost"] = boost
            result["final_score"] = result["rrf_score"] + boost

        results.sort(
            key=lambda x: x["final_score"],
            reverse=True
        )

        return results

    def _expand_context(
        self,
        db: Session,
        results: list[dict],
        max_sections: int = 2,
        parcours: str | None = None,
        subsection: str | None = None,
        intent: str | None = None,
    ) -> list[dict]:

        if subsection:
            return []

        if intent == "DIPLOMAS":
            return []

        expanded_results = []

        seen_chunks = set()
        seen_sections = set()

        for result in results:

            source = result.get("source")
            section = result.get("section")

            # Impossible d'étendre sans source ou section
            if not source or not section:
                continue
            section_key = (source, section)

            # Section déjà traitée
            if section_key in seen_sections:
                continue

            # Limite le nombre de sections développées
            if len(seen_sections) >= max_sections:
                break

            section_chunks = (
                RetrievalRepository.get_chunks_by_section(
                    db=db,
                    source=source,
                    section=section
                )
            )

            for (
                chunk,
                source_value,
                category,
                filiere_value,
                source_url,
            ) in section_chunks:

                # Évite les doublons
                if chunk.id in seen_chunks:
                    continue

                expanded_results.append({
                    "content": chunk.content,
                    "source": source_value,
                    "chunk_index": chunk.chunk_index,
                    "category": category,
                    "filiere": filiere_value,
                    "section": chunk.section,
                    "subsection": chunk.subsection,
                    "source_url": source_url,
                    "expanded": True,
                })

                seen_chunks.add(chunk.id)

            seen_sections.add(section_key)

        return expanded_results

    def _merge_expanded_context(
        self,
        results: list[dict],
        expanded_results: list[dict],
    ) -> list[dict]:

        existing_keys = {
            (
                result.get("source"),
                result.get("chunk_index")
            )
            for result in results
        }

        merged = list(results)

        for result in expanded_results:

            key = (
                result.get("source"),
                result.get("chunk_index")
            )

            if key in existing_keys:
                continue

            result["expanded"] = True
            result["rrf_score"] = 0.0
            result["final_score"] = 0.0
            result["metadata_boost"] = 0.0

            merged.append(result)
            existing_keys.add(key)

        return merged

    def _build_keyword_query(
        self,
        query: str,
        section: str | None,
        filiere: str | None,
        subsection: str | None,
    ) -> str:
        """
        Construit le texte utilisé pour la recherche lexicale (full-text).

        Important : on part toujours de la question de l'utilisateur
        (ce sont ces mots qui ont des chances d'apparaître dans le
        contenu des chunks), et on y AJOUTE les libellés de métadonnées
        détectés comme signal complémentaire. On ne remplace jamais
        la question par les seules métadonnées : un libellé comme
        "Finance" ou "PROGRAMME" n'apparaît presque jamais tel quel
        dans le texte d'un chunk, donc l'utiliser seul revient à
        chercher des mots absents du contenu.
        """

        terms = [query]

        if section:
            terms.append(section)

        if filiere:
            terms.append(filiere)

        if subsection:
            terms.append(subsection)

        return " ".join(terms)

    @staticmethod
    def _build_filter_levels(
        category: str | None,
        filiere: str | None,
        section: str | None,
        subsection: str | None,
    ) -> list[dict]:
        """
        Construit la liste des jeux de filtres à essayer, du plus précis
        (exactement ce que MetadataDetector a détecté) au plus large
        (aucun filtre). On retire d'abord le filtre le plus fin
        (sous-section), car c'est statistiquement le plus susceptible
        d'être une fausse détection, puis on élargit progressivement
        jusqu'à la catégorie.

        Un niveau n'est ajouté que s'il diffère du précédent : si un
        champ n'était déjà pas détecté, il n'y a pas de niveau
        supplémentaire à créer pour lui.
        """

        current = {
            "category": category,
            "filiere": filiere,
            "section": section,
            "subsection": subsection,
        }

        levels = [dict(current)]

        for field in ("subsection", "section", "filiere", "category"):
            if current[field] is not None:
                current[field] = None
                levels.append(dict(current))

        return levels

    def _retrieve_with_fallback(
        self,
        db: Session,
        query_embedding: list[float],
        keyword_query: str,
        candidate_k: int,
        category: str | None,
        filiere: str | None,
        section: str | None,
        subsection: str | None,
    ):
        """
        Exécute la recherche vecteur + mots-clés en essayant d'abord les
        filtres de métadonnées les plus précis, puis en les relâchant
        progressivement si trop peu de candidats sont trouvés.

        Limite connue de cette seule logique : si une catégorie/filière
        est détectée À TORT mais qu'elle contient malgré tout beaucoup
        de chunks (ex. "Formation" au lieu de "Règlement"), le nombre
        de candidats semble suffisant et le fallback ne se déclenche
        JAMAIS, alors que le bon document se trouve dans une catégorie
        totalement différente qui n'est jamais essayée. C'est pour
        cette raison qu'on ajoute, en plus, un filet de sécurité :
        une recherche entièrement ouverte (sans aucun filtre) est
        systématiquement exécutée en complément dès qu'un filtre a été
        détecté, et fusionnée séparément via RRF — elle ne remplace
        jamais la recherche filtrée, elle s'y ajoute.

        Retourne (vector_results, keyword_results, global_vector_results,
        global_keyword_results, filters_used, fallback_level).
        """

        filter_levels = self._build_filter_levels(
            category=category,
            filiere=filiere,
            section=section,
            subsection=subsection,
        )

        vector_results = []
        keyword_results = []
        filters_used = filter_levels[0]
        fallback_level = 0

        for level_index, level in enumerate(filter_levels):

            vector_results = RetrievalRepository.search_similar_chunks(
                db=db,
                query_embedding=query_embedding,
                top_k=candidate_k,
                **level,
            )

            keyword_results = RetrievalRepository.search_keyword_chunks(
                db=db,
                query=keyword_query,
                top_k=candidate_k,
                **level,
            )

            distinct_ids = {
                row[0].id for row in vector_results
            } | {
                row[0].id for row in keyword_results
            }

            filters_used = level
            fallback_level = level_index

            is_last_level = level_index == len(filter_levels) - 1

            if len(distinct_ids) >= MIN_FALLBACK_CANDIDATES or is_last_level:
                break

        open_level = filter_levels[-1]

        global_vector_results = []
        global_keyword_results = []

        if filters_used != open_level:

            global_vector_results = RetrievalRepository.search_similar_chunks(
                db=db,
                query_embedding=query_embedding,
                top_k=GLOBAL_SAFETY_NET_K,
                **open_level,
            )

            global_keyword_results = RetrievalRepository.search_keyword_chunks(
                db=db,
                query=keyword_query,
                top_k=GLOBAL_SAFETY_NET_K,
                **open_level,
            )

        return (
            vector_results,
            keyword_results,
            global_vector_results,
            global_keyword_results,
            filters_used,
            fallback_level,
        )

    def search(
        self,
        db: Session,
        query: str,
        candidate_k: int = 10,
        final_k: int = 3
    ):

        # 1. Détection des métadonnées
        category = MetadataDetector.detect_category(query)
        filiere = MetadataDetector.detect_filiere(query)
        section = MetadataDetector.detect_section(query)
        parcours = MetadataDetector.detect_parcours(query)
        subsection = MetadataDetector.detect_subsection(
            query,
            parcours
        )
        intent = MetadataDetector.detect_intent(query)

        # 2. Embedding de la requête
        query_embedding = self.embedding_service.embed_query(
            query
        )

        # 3 & 4. Recherche vectorielle + mots-clés, avec repli progressif
        # des filtres de métadonnées si trop peu de candidats sont trouvés
        keyword_query = self._build_keyword_query(
            query=query,
            section=section,
            filiere=filiere,
            subsection=subsection
        )

        (
            vector_results,
            keyword_results,
            global_vector_results,
            global_keyword_results,
            filters_used,
            fallback_level,
        ) = self._retrieve_with_fallback(
            db=db,
            query_embedding=query_embedding,
            keyword_query=keyword_query,
            candidate_k=candidate_k,
            category=category,
            filiere=filiere,
            section=section,
            subsection=subsection,
        )

        # 5. Fusion RRF
        rrf_scores = {}

        chunk_data = {}

        RRF_K = 60

        # Vector ranking
        for rank, (
            chunk,
            source,
            category,
            filiere_value,
            source_url,
            distance
        ) in enumerate(vector_results, start=1):

            key = chunk.id

            rrf_scores[key] = (
                rrf_scores.get(key, 0)
                + 1 / (RRF_K + rank)
            )

            chunk_data[key] = {
                "content": chunk.content,
                "source": source,
                "chunk_index": chunk.chunk_index,
                "category": category,
                "filiere": filiere_value,
                "section": chunk.section,
                "subsection": chunk.subsection,
                "source_url": source_url,
                "vector_distance": float(distance),
                "vector_similarity": float(1 - distance)
            }

        # Keyword ranking
        for rank, (
            chunk,
            source,
            category,
            filiere_value,
            source_url,
            keyword_score
        ) in enumerate(keyword_results, start=1):

            key = chunk.id

            rrf_scores[key] = (
                rrf_scores.get(key, 0)
                + 1 / (RRF_K + rank)
            )

            if key not in chunk_data:
                chunk_data[key] = {
                    "content": chunk.content,
                    "source": source,
                    "chunk_index": chunk.chunk_index,
                    "category": category,
                    "filiere": filiere_value,
                    "section": chunk.section,
                    "subsection": chunk.subsection,
                    "source_url": source_url
                }

            chunk_data[key]["keyword_score"] = float(
                keyword_score
            )

        for rank, (
            chunk,
            source,
            category,
            filiere_value,
            source_url,
            distance
        ) in enumerate(global_vector_results, start=1):

            key = chunk.id

            rrf_scores[key] = (
                rrf_scores.get(key, 0)
                + 1 / (RRF_K + rank)
            )

            if key not in chunk_data:
                chunk_data[key] = {
                    "content": chunk.content,
                    "source": source,
                    "chunk_index": chunk.chunk_index,
                    "category": category,
                    "filiere": filiere_value,
                    "section": chunk.section,
                    "subsection": chunk.subsection,
                    "source_url": source_url,
                    "vector_distance": float(distance),
                    "vector_similarity": float(1 - distance)
                }

        # Keyword ranking (recherche ouverte, filet de sécurité)
        for rank, (
            chunk,
            source,
            category,
            filiere_value,
            source_url,
            keyword_score
        ) in enumerate(global_keyword_results, start=1):

            key = chunk.id

            rrf_scores[key] = (
                rrf_scores.get(key, 0)
                + 1 / (RRF_K + rank)
            )

            if key not in chunk_data:
                chunk_data[key] = {
                    "content": chunk.content,
                    "source": source,
                    "chunk_index": chunk.chunk_index,
                    "category": category,
                    "filiere": filiere_value,
                    "section": chunk.section,
                    "subsection": chunk.subsection,
                    "source_url": source_url
                }

            if "keyword_score" not in chunk_data[key]:
                chunk_data[key]["keyword_score"] = float(
                    keyword_score
                )

        # 6. Préparer tous les résultats avec leur score RRF
        retrieved_chunks = []

        for chunk_id, rrf_score in rrf_scores.items():

            data = chunk_data[chunk_id]

            retrieved_chunks.append({
                "content": data["content"],
                "source": data["source"],
                "chunk_index": data["chunk_index"],
                "category": data["category"],
                "filiere": data["filiere"],
                "section": data["section"],
                "subsection": data["subsection"],
                "source_url": data["source_url"],

                "rrf_score": float(rrf_score),

                "vector_similarity": data.get(
                    "vector_similarity"
                ),

                "keyword_score": data.get(
                    "keyword_score"
                )
            })

        # 7. Appliquer le metadata boost
        retrieved_chunks = self._apply_metadata_boost(
            results=retrieved_chunks,
            query=query,
            section=section,
            filiere=filiere,
            intent=intent
        )

        retrieved_chunks = retrieved_chunks[:MAX_RERANK_CANDIDATES]

        # Reranking
        candidate_count = len(retrieved_chunks)

        start = time.perf_counter()

        retrieved_chunks = self.reranker_service.rerank(
            query=query,
            results=retrieved_chunks,
            top_k=final_k
        )

        elapsed = time.perf_counter() - start

        print(
            f"[RERANKER] "
            f"candidates={candidate_count} "
            f"time={elapsed:.3f}s"
        )

        anchor_results = retrieved_chunks[:final_k]

        expanded_results = self._expand_context(
            db=db,
            results=anchor_results,
            max_sections=2,
            subsection=subsection,
            intent=intent,
        )

        # 8. Garder les meilleurs résultats
        retrieved_chunks = self._merge_expanded_context(
            results=anchor_results,
            expanded_results=expanded_results
        )

        # 9. Réattribuer le rang final
        for rank, chunk in enumerate(
            retrieved_chunks,
            start=1
        ):
            chunk["rank"] = rank

        return retrieved_chunks
