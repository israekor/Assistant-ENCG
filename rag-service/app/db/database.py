from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.config import settings

DATABASE_URL = (
    f"postgresql+psycopg://"
    f"{settings.postgres_rag_user}:"
    f"{settings.postgres_rag_password}@"
    f"{settings.postgres_rag_host}:"
    f"{settings.postgres_rag_port}/"
    f"{settings.postgres_rag_db}"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)


def get_db():
    db: Session = SessionLocal()

    try:
        yield db
    finally:
        db.close()
