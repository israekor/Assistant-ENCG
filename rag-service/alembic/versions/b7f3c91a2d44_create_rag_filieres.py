"""create rag_filieres (filieres configurables depuis l'admin)

Revision ID: b7f3c91a2d44
Revises: a1c735226ad2
"""
import uuid
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "b7f3c91a2d44"
down_revision: Union[str, Sequence[str], None] = "a1c735226ad2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Reprise exacte des dictionnaires qui étaient écrits en dur dans le code
SEED = [
    ("01_achats_supply_chain_management", "Achats et Supply Chain Management", ["achats", "supply chain"]),
    ("02_controle_audit_conseil", "Contrôle, Audit et Conseil",
     ["audit et conseil", "contrôle audit et conseil", "cac"]),
    ("03_finance", "Finance", ["finance"]),
    ("04_management_ressources_humaines", "Management des Ressources Humaines",
     ["management des ressources humaines", "ressources humaines"]),
    ("05_marketing_action_commerciale", "Marketing et Action Commerciale",
     ["marketing", "action commerciale"]),
    ("06_commerce_international", "Commerce International", ["commerce international"]),
]


def upgrade() -> None:
    table = op.create_table(
        "rag_filieres",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("file_stem", sa.String(200), nullable=False, unique=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("aliases", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.bulk_insert(table, [
        {"id": uuid.uuid4(), "file_stem": stem, "name": name, "aliases": aliases}
        for stem, name, aliases in SEED
    ])


def downgrade() -> None:
    op.drop_table("rag_filieres")
