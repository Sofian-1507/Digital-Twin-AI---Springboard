import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Optional

from beanie import init_beanie
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

from core.config import get_settings
from models.user import User
from models.finance import FinancialRecord
from models.study import StudyActivity
from models.habit import HabitTracking
from models.activity import UserActivity

logger = logging.getLogger("digital_twin_ai.database")

_client: Optional[AsyncIOMotorClient] = None


async def connect_to_mongo() -> None:
    """Initialise Motor client and Beanie ODM.  Called once on application startup."""
    global _client
    settings = get_settings()

    logger.info("Connecting to MongoDB Atlas…")
    _client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        maxPoolSize=settings.MONGODB_MAX_POOL_SIZE,
        minPoolSize=settings.MONGODB_MIN_POOL_SIZE,
        serverSelectionTimeoutMS=10_000,
        socketTimeoutMS=45_000,
    )

    await init_beanie(
        database=_client[settings.MONGODB_DB_NAME],
        document_models=[
            User,
            FinancialRecord,
            StudyActivity,
            HabitTracking,
            UserActivity,
        ],
    )
    logger.info("MongoDB Atlas connection pool established → db: %s", settings.MONGODB_DB_NAME)


async def close_mongo_connection() -> None:
    """Gracefully closes Motor connection pool on application shutdown."""
    global _client
    if _client:
        _client.close()
        logger.info("MongoDB Atlas connection pool closed.")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """FastAPI lifespan context manager — replaces deprecated @app.on_event."""
    await connect_to_mongo()
    yield
    await close_mongo_connection()
