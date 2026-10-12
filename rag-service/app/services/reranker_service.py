import math
import os

import torch
from sentence_transformers import CrossEncoder
from app.config import settings


RERANKER_MAX_LENGTH = 512

# Poids des boosts de métadonnées par rapport au score du reranker
# (probabilité entre 0 et 1). Avec 0.3, le boost maximal (~0.8) vaut
# environ 0.24 : il départage des chunks de pertinence voisine, mais ne
# peut pas faire passer un chunk peu pertinent devant un très pertinent.
RERANKER_BOOST_WEIGHT = 0.3


def _to_probabilities(raw_scores: list[float]) -> list[float]:
    """
    Ramène les scores bruts du cross-encoder dans [0, 1].
    Si le modèle renvoie déjà des probabilités (sigmoïde), rien ne change ;
    s'il renvoie des logits, on applique la sigmoïde.
    """
    if all(0.0 <= s <= 1.0 for s in raw_scores):
        return list(raw_scores)
    return [1.0 / (1.0 + math.exp(-s)) for s in raw_scores]


class RerankerService:

    def __init__(
        self,
        model_name: str | None = None
    ):
        torch.set_num_threads(os.cpu_count() or 4)

        model_name = model_name or settings.reranker_model
        self.model = CrossEncoder(
            model_name,
            device="cpu",
            max_length=RERANKER_MAX_LENGTH,
        )

    def rerank(
        self,
        query: str,
        results: list[dict],
        top_k: int = 5
    ) -> list[dict]:

        if not results:
            return []

        pairs = [
            (
                query,
                result["content"]
            )
            for result in results
        ]

        raw_scores = [
            float(score)
            for score in self.model.predict(
                pairs,
                batch_size=8,
                show_progress_bar=False
            )
        ]

        # Le classement final repose sur la probabilité absolue donnée par
        # le cross-encoder (et non sur une normalisation min-max par
        # requête, qui gonflait artificiellement les candidats moyens
        # quand le lot contenait un très mauvais candidat). Les boosts de
        # métadonnées s'y ajoutent avec un poids réduit.
        probabilities = _to_probabilities(raw_scores)

        min_score = min(raw_scores)
        max_score = max(raw_scores)
        score_range = max_score - min_score

        for result, raw_score, probability in zip(
            results, raw_scores, probabilities
        ):

            # Conservé pour compatibilité (affichage / calibration)
            if score_range > 1e-9:
                normalized_score = (raw_score - min_score) / score_range
            else:
                normalized_score = 1.0

            metadata_boost = result.get("metadata_boost", 0.0)

            result["reranker_score"] = raw_score
            result["reranker_score_normalized"] = normalized_score

            result["final_score"] = (
                probability + RERANKER_BOOST_WEIGHT * metadata_boost
            )

        results.sort(
            key=lambda x: x["final_score"],
            reverse=True
        )

        for rank, result in enumerate(
            results[:top_k],
            start=1
        ):
            result["reranker_rank"] = rank

        return results[:top_k]
