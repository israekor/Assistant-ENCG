from sentence_transformers import SentenceTransformer
from sqlalchemy import select

from app.db.database import SessionLocal
from app.db.models import RagChunk, RagDocument


MODEL_NAME = "intfloat/multilingual-e5-base"

QUERY = "Quel concours permet aux titulaires du baccalauréat d'intégrer l'ENCG ?"


def main():

    print("=" * 70)
    print("TEST DU VECTEUR RÉELLEMENT STOCKÉ")
    print("=" * 70)

    # 1. Charger le modèle
    model = SentenceTransformer(MODEL_NAME)

    # 2. Encoder la requête avec la convention E5
    query_embedding = model.encode(
        f"query: {QUERY}",
        normalize_embeddings=True
    ).tolist()

    db = SessionLocal()

    try:

        # 3. Récupérer les chunks TAFEM depuis PostgreSQL
        statement = (
            select(
                RagChunk,
                RagDocument.source,
                RagDocument.category,
                RagDocument.filiere,
                RagDocument.source_url
            )
            .join(
                RagDocument,
                RagChunk.document_id == RagDocument.id
            )
            .where(
                RagDocument.source == "11_admission/01_admission.md"
            )
        )

        results = db.execute(statement).all()

        print(f"\nNombre de chunks du document : {len(results)}")

        # 4. Calculer la similarité avec le vrai embedding PostgreSQL
        comparisons = []

        for (
            chunk,
            source,
            category,
            filiere,
            source_url
        ) in results:

            stored_embedding = chunk.embedding

            # Comme les vecteurs sont normalisés,
            # cosine similarity = produit scalaire
            similarity = sum(
                q * v
                for q, v in zip(
                    query_embedding,
                    stored_embedding
                )
            )

            comparisons.append({
                "chunk_index": chunk.chunk_index,
                "section": chunk.section,
                "subsection": chunk.subsection,
                "similarity": similarity,
                "content": chunk.content
            })

        # 5. Trier du plus similaire au moins similaire
        comparisons.sort(
            key=lambda x: x["similarity"],
            reverse=True
        )

        print("\nTop chunks du document admission :")
        print("-" * 70)

        for result in comparisons:

            print(
                f"\nChunk #{result['chunk_index']}"
            )

            print(
                f"Similarity : {result['similarity']:.4f}"
            )

            print(
                f"Section : {result['section']}"
            )

            print(
                f"Sous-section : {result['subsection']}"
            )

            print(
                f"Content : {result['content'][:300]}"
            )

    finally:
        db.close()


if __name__ == "__main__":
    main()
