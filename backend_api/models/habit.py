"""
models/habit.py — Beanie ODM Document mirroring backend/database/schemas/habit_schema.ts.
Collection: `habit_trackings`
Critical: Unique compound index on (user_id, log_date) enforces 1 log per user per UTC day.
log_date is always normalized to midnight UTC — mirrors the HabitTrackingSchema.pre('validate') middleware.
DO NOT alter field names — they map directly to existing MongoDB documents.
"""
from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

from beanie import Document, DecimalAnnotation, PydanticObjectId
from pydantic import Field, model_validator
from pymongo import ASCENDING, IndexModel

from models.enums import BurnoutRisk


class HabitTracking(Document):
    user_id: PydanticObjectId

    # 4D K-Means Feature Space
    sleep_hours: DecimalAnnotation = Field(..., ge=0, le=24)
    exercise_minutes: int = Field(..., ge=0, le=1440)
    water_intake_liters: DecimalAnnotation = Field(..., ge=0, le=20)
    screen_time_hours: DecimalAnnotation = Field(..., ge=0, le=24)

    # Optional enrichment fields
    mood_rating: Optional[int] = Field(default=None, ge=1, le=5)
    meditation_minutes: Optional[int] = Field(default=None, ge=0, le=1440)
    productivity_score_computed: Optional[DecimalAnnotation] = None
    lifestyle_score_computed: Optional[DecimalAnnotation] = None

    burnout_risk_cluster: BurnoutRisk = BurnoutRisk.UNKNOWN
    log_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @model_validator(mode="after")
    def normalize_log_date_to_midnight_utc(self) -> "HabitTracking":
        """
        Replicates: HabitTrackingSchema.pre('validate') from habit_schema.ts.
        Normalizes log_date to 00:00:00.000Z so the unique compound index
        (user_id, log_date) correctly enforces 1 entry per user per calendar day.
        """
        d = self.log_date.replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=timezone.utc)
        self.log_date = d
        return self

    class Settings:
        name = "habit_trackings"    # ← Exact collection name from TS layer
        # This index did NOT previously exist on the live database despite being
        # documented above and in core/exceptions.py's DuplicateKeyError handler —
        # confirmed via a live read-only query before adding this (zero pre-existing
        # duplicate (user_id, log_date) pairs), so this is safe to create with no
        # migration/cleanup step. It's the actual DB-level guarantee that
        # upsert_daily_log()'s find_one_and_update(upsert=True) pattern depends on
        # to be atomic under concurrent requests for the same user+day.
        indexes = [
            IndexModel(
                [("user_id", ASCENDING), ("log_date", ASCENDING)],
                name="idx_habit_user_date_unique",
                unique=True,
            ),
        ]

    class Config:
        populate_by_name = True
