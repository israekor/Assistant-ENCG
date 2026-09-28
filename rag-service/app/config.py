from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ENCGT Assistant RAG Service"
    environment: str = "production"

    postgres_rag_host: str = "postgres-rag"
    postgres_rag_port: int = 5432
    postgres_rag_db: str = "rag_db"
    postgres_rag_user: str = "rag_user"
    postgres_rag_password: str = "rag_password"

    embedding_model: str = "intfloat/multilingual-e5-base"
    reranker_model: str = "BAAI/bge-reranker-v2-m3"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()
