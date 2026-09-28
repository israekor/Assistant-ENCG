from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


MODEL_NAME = "intfloat/multilingual-e5-base"


def main():

    model = SentenceTransformer(MODEL_NAME)

    chunk = """
    passage: Catégorie : Admission

    Section : TAFEM -- Test d'Admissibilité à la Formation En Management

    Le TAFEM est le concours d'admission en 1ère année du réseau des ENCG,
    organisé pour les titulaires du Baccalauréat.
    """

    queries = [
        "Quel concours permet aux titulaires du baccalauréat d'intégrer l'ENCG ?",
        "TAFEM titulaires du baccalauréat",
        "concours admission première année ENCG baccalauréat",
    ]

    chunk_embedding = model.encode(
        chunk,
        normalize_embeddings=True
    )

    print("\n" + "=" * 70)
    print("TEST EMBEDDINGS")
    print("=" * 70)

    for query in queries:

        query_embedding = model.encode(
            f"query: {query}",
            normalize_embeddings=True
        )

        similarity = cosine_similarity(
            [query_embedding],
            [chunk_embedding]
        )[0][0]

        print()
        print(f"Query : {query}")
        print(f"Similarity : {similarity:.4f}")


if __name__ == "__main__":
    main()
