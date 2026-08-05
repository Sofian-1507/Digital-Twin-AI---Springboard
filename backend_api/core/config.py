"""
core/config.py — Type-safe environment variable loader for the FastAPI backend.
Mirrors the intent of backend/database/config/db_settings.ts, adapted for Python/Pydantic-Settings.
"""
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

_INSECURE_JWT_SECRET_PLACEHOLDER = "CHANGE-THIS-SECRET-IN-PRODUCTION"


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
    JWT_SECRET_KEY: str = _INSECURE_JWT_SECRET_PLACEHOLDER
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    @field_validator("JWT_SECRET_KEY")
    @classmethod
    def reject_insecure_default_jwt_secret(cls, v: str) -> str:
        """Fail startup loudly rather than silently signing tokens with the
        publicly-known placeholder if JWT_SECRET_KEY was never set via .env."""
        if v == _INSECURE_JWT_SECRET_PLACEHOLDER:
            raise ValueError(
                "JWT_SECRET_KEY is still set to its insecure placeholder value. "
                "Set a real secret via the JWT_SECRET_KEY environment variable (.env)."
            )
        return v

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
