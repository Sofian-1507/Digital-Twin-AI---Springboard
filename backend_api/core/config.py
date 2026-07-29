"""
core/config.py — Type-safe environment variable loader for the FastAPI backend.
Mirrors the intent of backend/database/config/db_settings.ts, adapted for Python/Pydantic-Settings.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── MongoDB Atlas ──────────────────────────────────────────────────────────
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "digital_twin_ai_prod"
    MONGODB_MAX_POOL_SIZE: int = 100
    MONGODB_MIN_POOL_SIZE: int = 10

    # ── App ───────────────────────────────────────────────────────────────────
    APP_NAME: str = "Digital Twin AI – FastAPI Backend"
    APP_VERSION: str = "1.0.0"
    NODE_ENV: str = "development"   # matches TS layer key name for shared .env

    # ── JWT / Security ────────────────────────────────────────────────────────
    JWT_SECRET_KEY: str = "CHANGE-THIS-SECRET-IN-PRODUCTION"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # ── CORS ──────────────────────────────────────────────────────────────────
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # ── Pagination ────────────────────────────────────────────────────────────
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    @property
    def is_production(self) -> bool:
        return self.NODE_ENV == "production"


@lru_cache()
def get_settings() -> Settings:
    """Returns a cached singleton Settings instance."""
    return Settings()
