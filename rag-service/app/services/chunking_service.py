import re

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.models.document import Document
from app.models.chunk import Chunk
from app.services.metadata_service import MetadataService


class ChunkingService:

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200
    ):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                ""
            ]
        )

    @staticmethod
    def get_heading(
        line: str
    ) -> tuple[int, str] | None:

        match = re.match(
            r"^(#{1,6})\s+(.+)$",
            line.strip()
        )

        if not match:
            return None

        level = len(match.group(1))
        title = match.group(2).strip()

        return level, title

    @staticmethod
    def _build_context_header(
        category: str | None,
        filiere: str | None,
        section_name: str | None,
        subsection_name: str | None,
    ) -> str:
        """
        Construit une courte ligne de contexte à insérer au début du
        contenu brut d'un chunk (filière/catégorie, section, sous-section).

        Pourquoi : `chunk.content` est ce qui est indexé pour la
        recherche full-text (search_vector = to_tsvector(content)) et
        ce qui est transmis en contexte au LLM final. Sans cet en-tête,
        un chunk isolé comme "- Simulation de Gestion et ERP\n- ..."
        ne contient nulle part le mot "Finance" : aucune recherche par
        mot-clé sur "Finance" ne peut le trouver, et le LLM ne sait pas
        d'où vient ce texte s'il est utilisé seul dans un prompt.
        """

        parts = []

        if filiere:
            parts.append(f"Filière : {filiere}")
        elif category:
            parts.append(f"Catégorie : {category}")

        if section_name:
            parts.append(f"Section : {section_name}")

        if subsection_name:
            parts.append(f"Sous-section : {subsection_name}")

        return " | ".join(parts)

    def split_document(
        self,
        document: Document
    ) -> list[Chunk]:

        metadata = MetadataService.extract(
            document.source,
            document.content
        )

        lines = document.content.splitlines()

        chunks = []

        current_lines = []

        section = None
        subsection = None

        chunk_index = 0

        def add_chunk(
            text: str,
            section_name: str | None,
            subsection_name: str | None
        ):

            nonlocal chunk_index

            text = text.strip()

            if not text:
                return

            # Ne pas créer de chunk pour "Source officielle"
            if section_name == "Source officielle":
                return

            # Éviter les chunks contenant uniquement un titre
            if len(text.splitlines()) <= 1:
                return

            context_header = self._build_context_header(
                category=metadata["category"],
                filiere=metadata["filiere"],
                section_name=section_name,
                subsection_name=subsection_name,
            )

            # Si le bloc est trop grand,
            # on le découpe avec le splitter classique.
            sub_chunks = self.text_splitter.split_text(
                text
            )

            for sub_chunk in sub_chunks:

                sub_chunk = sub_chunk.strip()

                if not sub_chunk:
                    continue

                content = (
                    f"{context_header}\n\n{sub_chunk}"
                    if context_header
                    else sub_chunk
                )

                chunks.append(
                    Chunk(
                        content=content,
                        source=document.source,
                        file_type=document.file_type,
                        chunk_index=chunk_index,
                        category=metadata["category"],
                        filiere=metadata["filiere"],
                        section=section_name,
                        subsection=subsection_name,
                        source_url=metadata["source_url"]
                    )
                )

                chunk_index += 1

        for line in lines:

            stripped_line = line.strip()

            # Ignorer les lignes URL
            if stripped_line.startswith(
                "http://"
            ) or stripped_line.startswith(
                "https://"
            ):
                continue

            heading = self.get_heading(line)

            if heading:

                level, title = heading

                # Sauvegarder le bloc précédent
                if current_lines:

                    add_chunk(
                        "\n".join(current_lines),
                        section,
                        subsection
                    )

                    current_lines = []

                # Mise à jour du contexte
                if level == 1:

                    # Le nom de la filière est déjà
                    # récupéré depuis le nom du fichier.
                    current_lines.append(title)

                elif level == 2:

                    section = title
                    subsection = None

                    current_lines.append(title)

                elif level == 3:

                    subsection = title

                    current_lines.append(title)

                else:

                    # Les niveaux 4-6 restent
                    # dans le contenu du chunk.
                    current_lines.append(title)

            else:

                if stripped_line:
                    current_lines.append(line)

        # Dernier bloc
        if current_lines:

            add_chunk(
                "\n".join(current_lines),
                section,
                subsection
            )

        return chunks

    def split_documents(
        self,
        documents: list[Document]
    ) -> list[Chunk]:

        chunks = []

        for document in documents:

            chunks.extend(
                self.split_document(document)
            )

        return chunks
