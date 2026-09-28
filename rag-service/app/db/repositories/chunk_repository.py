import uuid

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.models import RagChunk


class ChunkRepository:

    @staticmethod
    def create(
        db: Session,
        document_id: uuid.UUID,
        content: str,
        chunk_index: int,
        embedding: list[float],
        section: str | None = None,
        subsection: str | None = None
    ) -> RagChunk:

        chunk = RagChunk(
            document_id=document_id,
            content=content,
            chunk_index=chunk_index,
            section=section,
            subsection=subsection,
            embedding=embedding,
            search_vector=func.to_tsvector(
                "french",
                content
            )
        )

        db.add(chunk)

        return chunk
