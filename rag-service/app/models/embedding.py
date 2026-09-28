from pydantic import BaseModel


class EmbeddedChunk(BaseModel):
    content: str
    source: str
    file_type: str
    chunk_index: int

    category: str | None = None
    filiere: str | None = None
    section: str | None = None
    subsection: str | None = None
    source_url: str | None = None

    embedding: list[float]
