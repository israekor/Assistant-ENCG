from sentence_transformers import SentenceTransformer

from app.models.chunk import Chunk
from app.models.embedding import EmbeddedChunk
from app.config import settings


class EmbeddingService:

    def __init__(
        self,
        model_name: str | None = None
    ):
        model_name = model_name or settings.embedding_model
        self.model = SentenceTransformer(model_name)

    def build_embedding_text(
        self,
        chunk: Chunk
    ) -> str:
        """
        Construit le texte à envoyer au modèle d'embedding.

        Depuis que ChunkingService ajoute lui-même un en-tête contextuel
        (catégorie/filière/section/sous-section) au début de
        `chunk.content` — pour que la recherche par mots-clés et le
        contexte transmis au LLM en bénéficient aussi — ce texte est
        déjà contextualisé. Reconstruire un second en-tête ici revenait
        à dupliquer cette métadonnée deux fois dans le texte encodé :
        sur un chunk court, ce bruit répété peut représenter près de la
        moitié du texte et diluer significativement le vecteur
        d'embedding. On se contente donc désormais du préfixe attendu
        par le modèle E5 ("passage: ").
        """

        return f"passage: {chunk.content}"

    def embed_text(
        self,
        text: str
    ) -> list[float]:

        embedding = self.model.encode(
            f"passage: {text}",
            normalize_embeddings=True
        )

        return embedding.tolist()

    def embed_chunk(
        self,
        chunk: Chunk
    ) -> EmbeddedChunk:

        embedding_text = self.build_embedding_text(
            chunk
        )

        embedding = self.model.encode(
            embedding_text,
            normalize_embeddings=True
        )

        return EmbeddedChunk(
            content=chunk.content,
            source=chunk.source,
            file_type=chunk.file_type,
            chunk_index=chunk.chunk_index,

            category=chunk.category,
            filiere=chunk.filiere,
            section=chunk.section,
            subsection=chunk.subsection,
            source_url=chunk.source_url,

            embedding=embedding.tolist()
        )

    def embed_chunks(
        self,
        chunks: list[Chunk],
        batch_size: int = 32
    ) -> list[EmbeddedChunk]:

        texts = [
            self.build_embedding_text(chunk)
            for chunk in chunks
        ]

        embeddings = self.model.encode(
            texts,
            batch_size=batch_size,
            normalize_embeddings=True,
            show_progress_bar=True
        )

        embedded_chunks = []

        for chunk, embedding in zip(
            chunks,
            embeddings
        ):

            embedded_chunks.append(
                EmbeddedChunk(
                    content=chunk.content,
                    source=chunk.source,
                    file_type=chunk.file_type,
                    chunk_index=chunk.chunk_index,

                    category=chunk.category,
                    filiere=chunk.filiere,
                    section=chunk.section,
                    subsection=chunk.subsection,
                    source_url=chunk.source_url,

                    embedding=embedding.tolist()
                )
            )

        return embedded_chunks

    def embed_query(
        self,
        query: str
    ) -> list[float]:

        embedding = self.model.encode(
            f"query: {query}",
            normalize_embeddings=True
        )

        return embedding.tolist()
