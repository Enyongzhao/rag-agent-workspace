from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    access_token_expire_minutes: int = 30
    algorithm: str = "HS256"
    redis_url: str = "redis://localhost:6379/0"
    upload_dir: str = "storage/uploads"
    chroma_dir: str = "storage/chroma"
    chroma_collection_name: str = "documents"
    embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    openai_api_key: str
    openai_model: str = "gpt-4o-mini"
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
