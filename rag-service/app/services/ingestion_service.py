from pathlib import Path

from app.models.document import Document


class IngestionService:

    SUPPORTED_EXTENSIONS = {".md", ".txt", ".pdf"}

    def __init__(self, documents_path: str = "/app/documents"):
        self.documents_path = Path(documents_path)

    def load_documents(self) -> list[Document]:
        documents = []

        if not self.documents_path.exists():
            return documents

        for file_path in self.documents_path.rglob("*"):

            if not file_path.is_file():
                continue

            if file_path.suffix.lower() not in self.SUPPORTED_EXTENSIONS:
                continue

            document = self._load_file(file_path)

            if document:
                documents.append(document)

        return documents

    def _load_file(self, file_path: Path) -> Document | None:

        extension = file_path.suffix.lower()

        if extension in {".md", ".txt"}:
            content = self._load_text_file(file_path)

        elif extension == ".pdf":
            content = self._load_pdf_file(file_path)

        else:
            return None

        if not content.strip():
            return None

        relative_path = file_path.relative_to(self.documents_path)

        return Document(
            content=content,
            source=str(relative_path),
            file_type=extension.replace(".", "")
        )

    def _load_text_file(self, file_path: Path) -> str:

        return file_path.read_text(
            encoding="utf-8"
        )

    def _load_pdf_file(self, file_path: Path) -> str:

        from pypdf import PdfReader

        reader = PdfReader(str(file_path))

        pages = []

        for page in reader.pages:
            text = page.extract_text()

            if text:
                pages.append(text)

        return "\n\n".join(pages)
