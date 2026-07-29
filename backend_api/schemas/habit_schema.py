"""
schemas/habit_schema.py — Pydantic request/response schemas for habit tracking endpoints.
Field names mirror backend/database/schemas/habit_schema.ts exactly.
"""
from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field

from models.enums import BurnoutRisk


class HabitCreateRequest(BaseModel):
    """
    POST /api/v1/habits/daily-log
    If log_date is omitted, today (UTC midnight) is used automatically.
    """
    sleep_hours: Decimal = Field(..., ge=0, le=24)
    exercise_minutes: int = Field(..., ge=0, le=1440)
    water_intake_liters: Decimal = Field(..., ge=0, le=20)
    screen_time_hours: Decimal = Field(..., ge=0, le=24)
    mood_rating: Optional[int] = Field(default=None, ge=1, le=5)
    meditation_minutes: Optional[int] = Field(default=None, ge=0, le=1440)
    log_date: Optional[datetime] = None  # Defaults to today UTC midnight in service


class HabitRecordResponse(BaseModel):
    id: str
    user_id: str
    sleep_hours: Decimal
    exercise_minutes: int
    water_intake_liters: Decimal
    screen_time_hours: Decimal
    mood_rating: Optional[int]
    meditation_minutes: Optional[int]
    productivity_score_computed: Optional[Decimal]
    lifestyle_score_computed: Optional[Decimal]
    burnout_risk_cluster: BurnoutRisk
    log_date: datetime
    created_at: datetime


class PaginatedHabitResponse(BaseModel):
    data: list[HabitRecordResponse]
    total: int
    page: int
    limit: int
    total_pages: int


class KMeansFeatureRow(BaseModel):
    """4D biometric feature vector row for K-Means ML pipeline."""
    log_id: str
    user_id: str
    sleep_hours: float
    exercise_minutes: int
    water_intake_liters: float
    screen_time_hours: float
    log_date: str   # ISO date string (YYYY-MM-DD)
