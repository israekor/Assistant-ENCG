import uuid

from sqlalchemy.orm import Session

from app.db.models import RagDocument


class DocumentRepository:

    @staticmethod
    def create(
        db: Session,
        source: str,
        file_type: str,
        category: str | None = None,
        filiere: str | None = None,
        source_url: str | None = None
    ) -> RagDocument:

        document = RagDocument(
            source=source,
            file_type=file_type,
            category=category,
            filiere=filiere,
            source_url=source_url
        )

        db.add(document)
        db.flush()

        return document

    @staticmethod
    def get_by_id(
        db: Session,
        document_id: uuid.UUID
    ) -> RagDocument | None:

        return db.get(
            RagDocument,
            document_id
        )

    @staticmethod
    def get_by_source(
        db: Session,
        source: str
    ) -> RagDocument | None:

        return (
            db.query(RagDocument)
            .filter(
                RagDocument.source == source
            )
            .first()
        )
