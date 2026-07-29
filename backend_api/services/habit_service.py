"""
services/habit_service.py — Business logic layer for daily habit tracking.
Python equivalent of HabitTrackingRepository from habit_repository.ts.
The key design: `upsert_daily_log` replicates upsertDailyHabitLog() which relies on
the unique compound index (user_id, log_date) to enforce 1 entry per calendar day.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from core.exceptions import ConflictError
from models.habit import HabitTracking
from models.enums import BurnoutRisk
from schemas.habit_schema import (
    HabitCreateRequest,
    HabitRecordResponse,
    PaginatedHabitResponse,
    KMeansFeatureRow,
)

logger = logging.getLogger("digital_twin_ai.habit_service")


def _midnight_utc(dt: Optional[datetime] = None) -> datetime:
    """Returns the given datetime (or now) normalized to 00:00:00.000 UTC."""
    base = dt or datetime.now(timezone.utc)
    return base.replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=timezone.utc)


def _to_response(record: HabitTracking) -> HabitRecordResponse:
    return HabitRecordResponse(
        id=str(record.id),
        user_id=str(record.user_id),
        sleep_hours=record.sleep_hours,
        exercise_minutes=record.exercise_minutes,
        water_intake_liters=record.water_intake_liters,
        screen_time_hours=record.screen_time_hours,
        mood_rating=record.mood_rating,
        meditation_minutes=record.meditation_minutes,
        productivity_score_computed=record.productivity_score_computed,
        lifestyle_score_computed=record.lifestyle_score_computed,
        burnout_risk_cluster=record.burnout_risk_cluster,
        log_date=record.log_date,
        created_at=record.created_at,
    )


async def upsert_daily_log(
    user_id: str, payload: HabitCreateRequest
) -> HabitRecordResponse:
    """
    Creates or updates today's habit check-in.
    Mirrors upsertDailyHabitLog() from habit_repository.ts using findOneAndUpdate + upsert=True.
    The unique compound index (user_id, log_date) in MongoDB is the final guard.
    log_date is always normalized to midnight UTC before persistence.
    """
    uid = PydanticObjectId(user_id)
    log_date = _midnight_utc(payload.log_date)

    update_fields = {
        "user_id": uid,
        "sleep_hours": payload.sleep_hours,
        "exercise_minutes": payload.exercise_minutes,
        "water_intake_liters": payload.water_intake_liters,
        "screen_time_hours": payload.screen_time_hours,
        "mood_rating": payload.mood_rating,
        "meditation_minutes": payload.meditation_minutes,
        "log_date": log_date,
    }

    from beanie import get_database
    collection = get_database()["habit_trackings"]

    result = await collection.find_one_and_update(
        {"user_id": uid, "log_date": log_date},
        {"$set": update_fields, "$setOnInsert": {"created_at": datetime.now(timezone.utc), "burnout_risk_cluster": BurnoutRisk.UNKNOWN}},
        upsert=True,
        return_document=True,
    )

    record = HabitTracking(**result)
    logger.info("Habit log upserted for user %s on %s", user_id, log_date.date())
    return _to_response(record)


async def list_logs(
    user_id: str,
    page: int = 1,
    limit: int = 30,
) -> PaginatedHabitResponse:
    """
    Paginated habit history. Uses idx_habit_user_date_desc ESR index.
    """
    uid = PydanticObjectId(user_id)
    skip = (page - 1) * limit

    records = await HabitTracking.find(
        {"user_id": uid},
        sort=[("log_date", -1)],
        skip=skip,
        limit=limit,
    ).to_list()

    total = await HabitTracking.find({"user_id": uid}).count()

    return PaginatedHabitResponse(
        data=[_to_response(r) for r in records],
        total=total,
        page=page,
        limit=limit,
        total_pages=max(1, -(-total // limit)),
    )


async def extract_kmeans_feature_space(
    user_id: str,
    days: int = 30,
) -> list[KMeansFeatureRow]:
    """
    Python port of extractKMeansFeatureSpace() from habit_repository.ts.
    Returns the 4D biometric feature matrix for K-Means burnout clustering.
    """
    uid = PydanticObjectId(user_id)
    from datetime import timedelta
    start_date = _midnight_utc() - timedelta(days=days)

    records = await HabitTracking.find(
        {"user_id": uid, "log_date": {"$gte": start_date}},
        sort=[("log_date", 1)],
    ).to_list()

    return [
        KMeansFeatureRow(
            log_id=str(r.id),
            user_id=str(r.user_id),
            sleep_hours=float(r.sleep_hours),
            exercise_minutes=r.exercise_minutes,
            water_intake_liters=float(r.water_intake_liters),
            screen_time_hours=float(r.screen_time_hours),
            log_date=r.log_date.strftime("%Y-%m-%d"),
        )
        for r in records
    ]
