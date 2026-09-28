"""add lexical search vector

Revision ID: a1c735226ad2
Revises: 1cb5dcf254d5
Create Date: 2026-09-18 19:13:51.023526

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'a1c735226ad2'
down_revision: Union[str, Sequence[str], None] = '1cb5dcf254d5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "rag_chunks",
        sa.Column(
            "search_vector",
            postgresql.TSVECTOR(),
            nullable=True
        )
    )

    op.execute("""
        UPDATE rag_chunks
        SET search_vector = to_tsvector('french', content)
    """)

    op.create_index(
        "idx_rag_chunks_search_vector",
        "rag_chunks",
        ["search_vector"],
        postgresql_using="gin"
    )


def downgrade() -> None:
    op.drop_index(
        "idx_rag_chunks_search_vector",
        table_name="rag_chunks"
    )

    op.drop_column("rag_chunks", "search_vector")
