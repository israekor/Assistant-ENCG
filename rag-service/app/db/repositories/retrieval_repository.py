import re

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.db.models import RagChunk, RagDocument


# Mots trop courts / peu discriminants pour valoir la peine d'être
# cherchés individuellement (le dictionnaire "french" de Postgres retire
# déjà les stopwords classiques, ceci est une sécurité supplémentaire).
_MIN_WORD_LENGTH = 3


def _build_or_tsquery(query: str):
    """
    Construit un tsquery Postgres où les mots sont combinés avec OU (||)
    plutôt qu'avec ET (&, comportement par défaut de plainto_tsquery).

    Pourquoi : ce canal lexical sert à CLASSER des résultats déjà
    filtrés (ou non) par ailleurs, pas à exiger une correspondance
    parfaite de tous les mots de la question. Avec un ET strict, il
    suffit qu'un seul mot de la question (souvent un libellé de
    métadonnée comme le nom de la filière) soit absent du texte brut
    du chunk pour que TOUT le canal keyword renvoie 0 résultat.
    Avec un OU, chaque mot trouvé contribue au score (via ts_rank),
    et un chunk qui matche 2 mots sur 3 remonte quand même, avec un
    score plus faible qu'un chunk qui les matche tous les 3.

    Retourne None si aucun mot exploitable n'a été trouvé.
    """

    words = [
        word
        for word in re.split(r"\s+", query.strip())
        if len(word) >= _MIN_WORD_LENGTH
    ]

    if not words:
        return None

    tsqueries = [
        func.plainto_tsquery("french", word)
        for word in words
    ]

    combined = tsqueries[0]

    for tsquery in tsqueries[1:]:
        combined = combined.op("||")(tsquery)

    return combined


class RetrievalRepository:

    @staticmethod
    def search_similar_chunks(
        db: Session,
        query_embedding: list[float],
        top_k: int = 20,
        category: str | None = None,
        filiere: str | None = None,
        section: str | None = None,
        subsection: str | None = None,
    ):
        distance = RagChunk.embedding.cosine_distance(query_embedding)

        statement = (
            select(
                RagChunk,
                RagDocument.source,
                RagDocument.category,
                RagDocument.filiere,
                RagDocument.source_url,
                distance.label("distance")
            )
            .join(
                RagDocument,
                RagChunk.document_id == RagDocument.id
            )
        )

        if category:
            statement = statement.where(
                RagDocument.category == category
            )

        if filiere:
            statement = statement.where(
                RagDocument.filiere == filiere
            )

        if section:
            statement = statement.where(
                RagChunk.section == section
            )

        if subsection:
            statement = statement.where(
                RagChunk.subsection == subsection
            )

        statement = (
            statement
            .order_by(distance)
            .limit(top_k)
        )

        return db.execute(statement).all()

    @staticmethod
    def search_keyword_chunks(
        db: Session,
        query: str,
        top_k: int = 20,
        category: str | None = None,
        filiere: str | None = None,
        section: str | None = None,
        subsection: str | None = None,
    ):

        search_vector = RagChunk.search_vector

        search_query = _build_or_tsquery(query)

        # Si la question ne contient aucun mot exploitable (cas limite),
        # on n'exécute pas de recherche lexicale plutôt que de laisser
        # Postgres échouer sur un tsquery vide.
        if search_query is None:
            return []

        rank = func.ts_rank(search_vector, search_query)

        statement = (
            select(
                RagChunk,
                RagDocument.source,
                RagDocument.category,
                RagDocument.filiere,
                RagDocument.source_url,
                rank.label("keyword_score")
            )
            .join(
                RagDocument,
                RagChunk.document_id == RagDocument.id
            )
            .where(
                search_vector.op("@@")(search_query)
            )
        )

        if category:
            statement = statement.where(
                RagDocument.category == category
            )

        if filiere:
            statement = statement.where(
                RagDocument.filiere == filiere
            )

        if section:
            statement = statement.where(
                RagChunk.section == section
            )

        if subsection:
            statement = statement.where(
                RagChunk.subsection == subsection
            )

        statement = (
            statement
            .order_by(rank.desc())
            .limit(top_k)
        )

        return db.execute(statement).all()

    @staticmethod
    def get_chunks_by_section(
        db: Session,
        source: str,
        section: str,
    ):
        statement = (
            select(
                RagChunk,
                RagDocument.source,
                RagDocument.category,
                RagDocument.filiere,
                RagDocument.source_url,
            )
            .join(
                RagDocument,
                RagChunk.document_id == RagDocument.id
            )
            .where(
                RagDocument.source == source,
                RagChunk.section == section
            )
            .order_by(
                RagChunk.chunk_index
            )
        )

        return db.execute(statement).all()

    @staticmethod
    def get_chunks_by_section_and_subsection(
        db: Session,
        source: str,
        section: str,
        subsection: str,
    ):

        statement = (
            select(
                RagChunk,
                RagDocument.source,
                RagDocument.category,
                RagDocument.filiere,
                RagDocument.source_url,
            )
            .join(
                RagDocument,
                RagChunk.document_id == RagDocument.id
            )
            .where(
                RagDocument.source == source,
                RagChunk.section == section,
                RagChunk.subsection == subsection,
            )
            .order_by(
                RagChunk.chunk_index
            )
        )

        return db.execute(statement).all()
