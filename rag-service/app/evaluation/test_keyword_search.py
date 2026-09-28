from sqlalchemy import text

from app.db.database import SessionLocal


QUERY = "Quel concours permet aux titulaires du baccalauréat d'intégrer l'ENCG ?"


def main():

    print("=" * 70)
    print("TEST POSTGRESQL FULL-TEXT SEARCH")
    print("=" * 70)

    db = SessionLocal()

    try:

        statement = text("""
            SELECT
                c.chunk_index,
                c.section,
                c.subsection,
                c.content,

                ts_rank(
                    to_tsvector(
                        'french',
                        c.content
                    ),
                    plainto_tsquery(
                        'french',
                        :query
                    )
                ) AS keyword_score

            FROM rag_chunks c
            JOIN rag_documents d
                ON c.document_id = d.id

            WHERE d.source = '11_admission/01_admission.md'

            ORDER BY keyword_score DESC;
        """)

        results = db.execute(
            statement,
            {"query": QUERY}
        ).fetchall()

        print(f"\nQuery : {QUERY}")
        print(f"Nombre de résultats : {len(results)}")

        print("\nRésultats :")
        print("-" * 70)

        for rank, result in enumerate(results, start=1):

            print(f"\n#{rank}")
            print(f"Chunk       : {result.chunk_index}")
            print(f"Keyword     : {result.keyword_score:.6f}")
            print(f"Section     : {result.section}")
            print(f"Sous-section: {result.subsection}")
            print(f"Content     : {result.content[:400]}")

    finally:
        db.close()


if __name__ == "__main__":
    main()
