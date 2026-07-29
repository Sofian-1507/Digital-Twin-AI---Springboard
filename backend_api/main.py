"""
main.py — FastAPI application entry point for Digital Twin AI.
Wires together: database lifecycle, CORS middleware, global exception handlers, and all v1 routers.
"""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import get_settings
from core.database import lifespan
from core.exceptions import register_exception_handlers
from api.v1 import auth, users, finance, study, habits

# ─── Logging Configuration ────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)

settings = get_settings()

# ─── Application Factory ──────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "FastAPI backend for Digital Twin AI — Personal Life Simulation & Decision Assistant. "
        "Connects to the production-ready MongoDB Atlas database (users, financial_records, "
        "study_activities, habit_trackings) via async Motor + Beanie ODM."
    ),
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,                  # Async startup/shutdown (replaces @app.on_event)
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Global Exception Handlers ────────────────────────────────────────────────
register_exception_handlers(app)

# ─── API Routers ──────────────────────────────────────────────────────────────
API_PREFIX = "/api/v1"

app.include_router(auth.router,    prefix=API_PREFIX)
app.include_router(users.router,   prefix=API_PREFIX)
app.include_router(finance.router, prefix=API_PREFIX)
app.include_router(study.router,   prefix=API_PREFIX)
app.include_router(habits.router,  prefix=API_PREFIX)


# ─── Health Check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"], summary="Application health check")
async def health_check() -> dict:
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "env": settings.NODE_ENV,
    }
