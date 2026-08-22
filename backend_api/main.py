"""
main.py — FastAPI application entry point for Digital Twin AI.
Wires together: database lifecycle, CORS middleware, global exception handlers, and all v1 routers.
"""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.middleware import SlowAPIMiddleware
from core.config import get_settings
from core.database import lifespan, ping_database
from core.exceptions import register_exception_handlers
from core.rate_limit import limiter
from api.v1 import (
    auth,
    users,
    finance,
    study,
    habits,
    activity,
    forecast,
    productivity,
    habit_analytics,
    trend_prediction,
    simulation,
    assistant,
)

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
    # Hidden in production — the full API schema/interactive docs shouldn't be
    # publicly browsable outside development.
    docs_url=None if settings.is_production else "/api/docs",
    redoc_url=None if settings.is_production else "/api/redoc",
    openapi_url=None if settings.is_production else "/api/openapi.json",
    lifespan=lifespan,                  # Async startup/shutdown (replaces @app.on_event)
)

# ─── Rate Limiting (scoped to auth endpoints — see api/v1/auth.py) ────────────
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Global Exception Handlers ─────────────────────────────────────────────────
# Includes the RateLimitExceeded handler for the limiter registered above.
register_exception_handlers(app)

# ─── API Routers ──────────────────────────────────────────────────────────────
API_PREFIX = "/api/v1"

app.include_router(auth.router,    prefix=API_PREFIX)
app.include_router(users.router,   prefix=API_PREFIX)
app.include_router(finance.router, prefix=API_PREFIX)
app.include_router(study.router,   prefix=API_PREFIX)
app.include_router(habits.router,  prefix=API_PREFIX)
app.include_router(activity.router, prefix=API_PREFIX)
app.include_router(forecast.router, prefix=API_PREFIX)
app.include_router(productivity.router, prefix=API_PREFIX)
app.include_router(habit_analytics.router, prefix=API_PREFIX)
app.include_router(trend_prediction.router, prefix=API_PREFIX)
app.include_router(simulation.router, prefix=API_PREFIX)
app.include_router(assistant.router, prefix=API_PREFIX)

# ─── Health Check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"], summary="Application health check")
async def health_check() -> dict:
    db_ok = await ping_database()
    return {
        "status": "ok" if db_ok else "degraded",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "env": settings.NODE_ENV,
        "database": "connected" if db_ok else "unreachable",
    }
