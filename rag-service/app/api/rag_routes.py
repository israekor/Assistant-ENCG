from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.database import engine, get_db
from app.models.retrieval import DebugRetrievalResponse
from app.services.ingestion_service import IngestionService
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService
from app.services.persistence_service import PersistenceService
from app.services.retrieval_service import RetrievalService
from app.services.reranker_service import RerankerService

router = APIRouter(
    prefix="/rag",
    tags=["RAG"]
)

ingestion_service = IngestionService()
chunking_service = ChunkingService()
embedding_service = EmbeddingService()
reranker_service = RerankerService()
retrieval_service = RetrievalService(
    embedding_service=embedding_service,
    reranker_service=reranker_service
)


@router.get("/health")
def rag_health():
    return {
        "status": "UP",
        "service": "rag"
    }


@router.get("/db-test")
def database_test():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        value = result.scalar()

    return {
        "status": "UP",
        "database": "postgres_rag",
        "test": value
    }


@router.get("/documents")
def get_documents():
    documents = ingestion_service.load_documents()

    return {
        "count": len(documents),
        "documents": documents
    }


@router.get("/chunks")
def get_chunks():
    documents = ingestion_service.load_documents()

    chunks = chunking_service.split_documents(documents)

    return {
        "count": len(chunks),
        "chunks": chunks
    }


@router.get("/embedding")
def test_embedding():
    text = "L'ENCG Tanger propose plusieurs formations."

    embedding = embedding_service.embed_text(text)

    return {
        "text": text,
        "dimension": len(embedding),
        "embedding_preview": embedding[:10]
    }


@router.get("/embeddings")
def get_embeddings():
    documents = ingestion_service.load_documents()
    chunks = chunking_service.split_documents(documents)

    embedded_chunks = embedding_service.embed_chunks(chunks)

    return {
        "documents_count": len(documents),
        "chunks_count": len(chunks),
        "embeddings_count": len(embedded_chunks),
        "embedding_dimension": len(embedded_chunks[0].embedding)
        if embedded_chunks
        else 0
    }


@router.post("/persist")
def persist_embeddings(
    db: Session = Depends(get_db)
):
    documents = ingestion_service.load_documents()

    chunks = chunking_service.split_documents(documents)

    embedded_chunks = embedding_service.embed_chunks(chunks)

    saved_documents = PersistenceService.save_embedded_chunks(
        db=db,
        embedded_chunks=embedded_chunks
    )

    return {
        "status": "SUCCESS",
        "documents_saved": len(saved_documents),
        "chunks_saved": len(embedded_chunks)
    }


@router.get("/search")
def search(
    query: str,
    candidate_k: int = 10,
    db: Session = Depends(get_db)
):
    results = retrieval_service.search(
        db=db,
        query=query,
        candidate_k=candidate_k
    )

    return {
        "query": query,
        "top_k": candidate_k,
        "results": results
    }


@router.get("/chunks/preview")
def preview_chunks(
    source: str
):
    documents = ingestion_service.load_documents()

    document = next(
        (
            doc
            for doc in documents
            if doc.source == source
        ),
        None
    )

    if document is None:
        return {
            "error": "Document introuvable",
            "source": source
        }

    chunks = chunking_service.split_document(
        document
    )

    return {
        "source": source,
        "count": len(chunks),
        "chunks": chunks
    }


@router.get("/embedding/preview")
def preview_embedding():

    documents = ingestion_service.load_documents()

    chunks = chunking_service.split_documents(
        documents
    )

    if not chunks:
        return {
            "error": "Aucun chunk trouvé"
        }

    chunk = next(
        chunk
        for chunk in chunks
        if "01_achats_supply_chain_management.md"
        in chunk.source
    )

    return {
        "original_content": chunk.content,
        "category": chunk.category,
        "filiere": chunk.filiere,
        "section": chunk.section,
        "subsection": chunk.subsection,
        "source_url": chunk.source_url,
        "embedding_text": (
            embedding_service.build_embedding_text(
                chunk
            )
        )
    }


class RetrievalRequest(BaseModel):
    query: str
    candidate_k: int = 10
    final_k: int = 3


@router.post("/retrieve")
def retrieve(
    request: RetrievalRequest,
    db: Session = Depends(get_db)
):
    results = retrieval_service.search(
        db=db,
        query=request.query,
        candidate_k=request.candidate_k,
        final_k=request.final_k
    )

    return {
        "query": request.query,
        "results": results
    }
