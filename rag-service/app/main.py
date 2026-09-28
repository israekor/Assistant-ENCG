from fastapi import FastAPI
from app.api.rag_routes import router as rag_router

app = FastAPI(
    title="ENCGT Assistant - RAG Service",
    description="Service de Retrieval-Augmented Generation pour l'assistant IA de l'ENCG Tanger",
    version="1.0.0"
)

app.include_router(rag_router)


@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "rag-service"
    }
