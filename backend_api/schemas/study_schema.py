"""
schemas/study_schema.py — Pydantic request/response schemas for study activity endpoints.
Field names mirror backend/database/schemas/academic_schema.ts exactly.
"""
from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, model_validator

from models.enums import SessionType


class StudyCreateRequest(BaseModel):
    """POST /api/v1/study/sessions"""
    subject: str = Field(..., max_length=100)
    study_hours: Decimal = Field(..., ge=Decimal("0.1"), le=Decimal("24.0"))
    session_type: SessionType
    attendance_pct: Decimal = Field(default=Decimal("100.0"), ge=0, le=100)

    quiz_marks: Optional[Decimal] = None
    max_quiz_marks: Optional[Decimal] = None

    exam_marks: Optional[Decimal] = None
    max_exam_marks: Optional[Decimal] = None

    focus_score: Optional[int] = Field(default=None, ge=0, le=100)
    linked_goal_id: Optional[str] = None
    session_date: Optional[datetime] = None

    @model_validator(mode="after")
    def max_marks_required_when_marks_given(self) -> "StudyCreateRequest":
        """Mirrors: required: function() { return this.quiz_marks !== undefined; }"""
        if self.quiz_marks is not None and self.max_quiz_marks is None:
            raise ValueError("max_quiz_marks is required when quiz_marks is provided.")
        if self.exam_marks is not None and self.max_exam_marks is None:
            raise ValueError("max_exam_marks is required when exam_marks is provided.")
        return self


class StudyRecordResponse(BaseModel):
    id: str
    user_id: str
    subject: str
    study_hours: Decimal
    session_type: SessionType
    attendance_pct: Decimal
    quiz_marks: Optional[Decimal]
    max_quiz_marks: Optional[Decimal]
    quiz_marks_pct: Optional[Decimal]       # Auto-computed
    exam_marks: Optional[Decimal]
    max_exam_marks: Optional[Decimal]
    exam_marks_pct: Optional[Decimal]       # Auto-computed
    focus_score: Optional[int]
    linked_goal_id: Optional[str]
    session_date: datetime
    created_at: datetime


class PaginatedStudyResponse(BaseModel):
    data: list[StudyRecordResponse]
    total: int
    page: int
    limit: int
    total_pages: int


class SubjectPerformanceSummary(BaseModel):
    """Aggregated subject-level summary for dashboard & ML pipelines."""
    subject: str
    total_study_hours: Decimal
    average_attendance_pct: float
    average_quiz_pct: float
    average_exam_pct: float
    session_count: int
