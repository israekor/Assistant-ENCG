from collections import defaultdict

from sqlalchemy.orm import Session

from app.db.models import RagDocument
from app.db.repositories.document_repository import DocumentRepository
from app.db.repositories.chunk_repository import ChunkRepository


class PersistenceService:

    @staticmethod
    def save_embedded_chunks(
        db: Session,
        embedded_chunks
    ) -> list[RagDocument]:

        grouped_chunks = defaultdict(list)

        for chunk in embedded_chunks:
            grouped_chunks[chunk.source].append(chunk)

        documents = []

        try:

            for source, chunks in grouped_chunks.items():

                # 1. Supprimer l'ancien document s'il existe
                existing_document = (
                    DocumentRepository.get_by_source(
                        db=db,
                        source=source
                    )
                )

                if existing_document:

                    db.delete(existing_document)
                    db.flush()

                # 2. Récupérer les informations du document
                first_chunk = chunks[0]

                # 3. Créer le nouveau document
                document = DocumentRepository.create(
                    db=db,
                    source=source,
                    file_type=first_chunk.file_type,
                    category=first_chunk.category,
                    filiere=first_chunk.filiere,
                    source_url=first_chunk.source_url
                )

                # 4. Créer les chunks
                for chunk in chunks:

                    ChunkRepository.create(
                        db=db,
                        document_id=document.id,
                        content=chunk.content,
                        chunk_index=chunk.chunk_index,
                        section=chunk.section,
                        subsection=chunk.subsection,
                        embedding=chunk.embedding
                    )

                documents.append(document)

            # 5. Valider toute l'opération
            db.commit()

            return documents

        except Exception:

            db.rollback()
            raise
