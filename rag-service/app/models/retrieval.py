from pydantic import BaseModel
from typing import Any


class RetrievalStage(BaseModel):
    latency_ms: float
    results: list[dict[str, Any]]


class DebugRetrievalResponse(BaseModel):
    query: str

    # NOTE : ces deux champs existaient déjà en sortie de search_debug()
    # mais n'étaient pas déclarés ici. Avec le comportement par défaut
    # de Pydantic (extra="ignore"), FastAPI les supprimait donc
    # silencieusement de la réponse JSON envoyée au client.
    metadata_detection: dict[str, Any]
    fallback: dict[str, Any]

    vector: RetrievalStage
    keyword: RetrievalStage
    rrf: RetrievalStage
    metadata: RetrievalStage
    reranker: RetrievalStage
    final: list[dict[str, Any]]