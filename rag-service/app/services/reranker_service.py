import os

import torch
from sentence_transformers import CrossEncoder
from app.config import settings


# Longueur maximale (en tokens) d'une paire (question, chunk) envoyée au
# cross-encoder. Le temps de calcul d'un cross-encoder croît environ au
# carré de la longueur de la séquence : tronquer les textes trop longs
# (rares dans ce corpus, mais possibles pour de longs articles de
# règlement) borne le pire cas sans perte pratique, puisque l'information
# utile est presque toujours dans les premières phrases d'un chunk.
RERANKER_MAX_LENGTH = 256


class RerankerService:

    def __init__(
        self,
        model_name: str | None = None
    ):
        # Sur certains environnements conteneurisés (Docker Desktop /
        # WSL2 notamment), PyTorch peut sous-détecter le nombre de cœurs
        # CPU réellement disponibles et n'utiliser qu'un seul thread,
        # ce qui multiplie fortement le temps d'inférence. On force
        # explicitement l'utilisation de tous les cœurs visibles.
        #
        # ATTENTION : si le conteneur Docker a une limite CPU explicite
        # (ex. "cpus: 1" dans docker-compose.yml, ou un --cpus au
        # lancement), os.cpu_count() peut renvoyer le nombre de cœurs
        # de la machine hôte plutôt que celui réellement alloué au
        # conteneur. Dans ce cas, augmenter les threads ici n'aidera pas
        # : c'est la limite Docker elle-même qu'il faut lever.
        torch.set_num_threads(os.cpu_count() or 4)

        model_name = model_name or settings.reranker_model
        self.model = CrossEncoder(
            model_name,
            device="cpu",
            max_length=RERANKER_MAX_LENGTH,
        )

    def rerank(
        self,
        query: str,
        results: list[dict],
        top_k: int = 5
    ) -> list[dict]:

        if not results:
            return []

        pairs = [
            (
                query,
                result["content"]
            )
            for result in results
        ]

        raw_scores = [
            float(score)
            for score in self.model.predict(
                pairs,
                batch_size=8,
                show_progress_bar=False
            )
        ]

        # Normalisation min-max par requête : ramène les scores du
        # reranker (échelle arbitraire selon le modèle) entre 0 et 1
        # pour CE lot de candidats précis. C'est ce qui permet de les
        # combiner ensuite avec metadata_boost (échelle fixe ~0.10-0.15)
        # de façon cohérente d'une question à l'autre, sans dépendre
        # d'hypothèses sur l'échelle interne du modèle.
        min_score = min(raw_scores)
        max_score = max(raw_scores)
        score_range = max_score - min_score

        for result, raw_score in zip(results, raw_scores):

            if score_range > 1e-9:
                normalized_score = (
                    (raw_score - min_score) / score_range
                )
            else:
                # Tous les candidats ont (quasi) le même score brut
                # (ex. un seul candidat) : pas d'information à extraire
                # de la comparaison, on ne pénalise personne.
                normalized_score = 1.0

            metadata_boost = result.get("metadata_boost", 0.0)

            result["reranker_score"] = raw_score
            result["reranker_score_normalized"] = normalized_score

            # C'est cette valeur, et uniquement celle-ci, qui détermine
            # le classement final : le jugement du cross-encoder reste
            # dominant, mais il peut désormais être ajusté par les
            # signaux de métadonnées (section/filière/intention)
            # au lieu d'être totalement ignoré.
            result["final_score"] = normalized_score + metadata_boost

        results.sort(
            key=lambda x: x["final_score"],
            reverse=True
        )

        for rank, result in enumerate(
            results[:top_k],
            start=1
        ):
            result["reranker_rank"] = rank

        return results[:top_k]
