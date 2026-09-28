import json

from app.services.retrieval_service import RetrievalService
from app.services.embedding_service import EmbeddingService
from app.services.reranker_service import RerankerService
from app.db.database import SessionLocal


DATASET_PATH = "app/evaluation/retrieval_dataset.json"

TOP_K = 20


def load_dataset():
    with open(
        DATASET_PATH,
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file)


def matches_criteria(result, criteria):
    """
    Vérifie si un résultat correspond à tous les critères
    d'un élément 'relevant'.
    """

    for field, expected_value in criteria.items():

        actual_value = result.get(field)

        if actual_value != expected_value:
            return False

    return True


def is_relevant(result, relevant):
    """
    Un résultat est pertinent s'il correspond
    à AU MOINS un des éléments de la liste 'relevant'.
    """

    for criteria in relevant:

        if matches_criteria(result, criteria):
            return True

    return False


def first_relevant_rank(results, relevant):

    for result in results:

        if is_relevant(result, relevant):
            return result["rank"]

    return None


def reciprocal_rank(results, relevant):

    rank = first_relevant_rank(
        results,
        relevant
    )

    if rank is None:
        return 0

    return 1 / rank


def hit_at_k(results, relevant, k):

    for result in results[:k]:

        if is_relevant(result, relevant):
            return 1

    return 0


def format_score(value):
    return f"{value:.4f}" if value is not None else "  -   "


def print_top_results(results, relevant, limit=5):

    print("\nTop 5:")

    for result in results[:limit]:

        relevant_marker = (
            "✓"
            if is_relevant(result, relevant)
            else " "
        )

        print(
            f"{relevant_marker} "
            f"#{result['rank']} "
            f"{result['source']} | "
            f"{result.get('section')} | "
            f"{result.get('subsection')} | "
            f"rrf={format_score(result['rrf_score'])} "
            f"vec={format_score(result.get('vector_similarity'))} "
            f"kw={format_score(result.get('keyword_score'))}"
        )


def main():

    dataset = load_dataset()

    # Une seule instance des modèles (embedding + reranker)
    embedding_service = EmbeddingService(
        model_name="intfloat/multilingual-e5-base"
    )

    reranker_service = RerankerService()

    retrieval_service = RetrievalService(
        embedding_service=embedding_service,
        reranker_service=reranker_service
    )

    db = SessionLocal()

    evaluation_results = []

    try:

        for question_data in dataset:

            question_id = question_data["id"]
            question = question_data["question"]
            relevant = question_data["relevant"]

            print("\n" + "=" * 70)
            print(
                f"{question_id}: {question}"
            )
            print("=" * 70)

            results = retrieval_service.search(
                db=db,
                query=question,
                candidate_k=TOP_K
            )

            rank = first_relevant_rank(
                results,
                relevant
            )

            recall_1 = hit_at_k(
                results,
                relevant,
                1
            )

            recall_3 = hit_at_k(
                results,
                relevant,
                3
            )

            recall_5 = hit_at_k(
                results,
                relevant,
                5
            )

            rr = reciprocal_rank(
                results,
                relevant
            )

            print(
                "Relevant criteria :"
            )

            for criteria in relevant:
                print(
                    f"  - {criteria}"
                )

            print(
                f"First relevant rank : "
                f"{rank if rank else 'None'}"
            )

            print(
                f"Recall@1 : {recall_1}"
            )

            print(
                f"Recall@3 : {recall_3}"
            )

            print(
                f"Recall@5 : {recall_5}"
            )

            print(
                f"RR : {rr:.3f}"
            )

            print_top_results(
                results,
                relevant
            )

            evaluation_results.append(
                {
                    "id": question_id,
                    "question": question,
                    "first_relevant_rank": rank,
                    "recall_at_1": recall_1,
                    "recall_at_3": recall_3,
                    "recall_at_5": recall_5,
                    "rr": rr
                }
            )

    finally:

        db.close()

    # ============================================================
    # GLOBAL METRICS
    # ============================================================

    total = len(evaluation_results)

    recall_at_1 = (
        sum(
            result["recall_at_1"]
            for result in evaluation_results
        )
        / total
    )

    recall_at_3 = (
        sum(
            result["recall_at_3"]
            for result in evaluation_results
        )
        / total
    )

    recall_at_5 = (
        sum(
            result["recall_at_5"]
            for result in evaluation_results
        )
        / total
    )

    mrr = (
        sum(
            result["rr"]
            for result in evaluation_results
        )
        / total
    )

    print("\n" + "=" * 70)
    print("RETRIEVAL BASELINE")
    print("=" * 70)

    print(
        f"Questions : {total}"
    )

    print(
        f"Recall@1 : {recall_at_1:.3f}"
    )

    print(
        f"Recall@3 : {recall_at_3:.3f}"
    )

    print(
        f"Recall@5 : {recall_at_5:.3f}"
    )

    print(
        f"MRR      : {mrr:.3f}"
    )

    # ============================================================
    # FAILURES
    # ============================================================

    failures = [
        result
        for result in evaluation_results
        if result["recall_at_5"] == 0
    ]

    print("\nFailures:")
    print("-" * 70)

    if not failures:

        print("Aucune question sans résultat pertinent dans le Top 5.")

    else:

        for failure in failures:

            print(
                f"{failure['id']} | "
                f"{failure['question']}"
            )

            print(
                f"First relevant rank: "
                f"{failure['first_relevant_rank']}"
            )


if __name__ == "__main__":
    main()
