"""
services/study_service.py — Business logic layer for academic activity tracking.
Python equivalent of StudyActivityRepository from study_repository.ts.
Auto-percentage computation is handled at model validation (model_validator in StudyActivity).
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

from beanie import PydanticObjectId

from models.study import StudyActivity
from schemas.study_schema import (
    StudyCreateRequest,
    StudyRecordResponse,
    PaginatedStudyResponse,
    SubjectPerformanceSummary,
)

logger = logging.getLogger("digital_twin_ai.study_service")


def _to_response(record: StudyActivity) -> StudyRecordResponse:
    return StudyRecordResponse(
        id=str(record.id),
        user_id=str(record.user_id),
        subject=record.subject,
        study_hours=record.study_hours,
        session_type=record.session_type,
        attendance_pct=record.attendance_pct,
        quiz_marks=record.quiz_marks,
        max_quiz_marks=record.max_quiz_marks,
        quiz_marks_pct=record.quiz_marks_pct,
        exam_marks=record.exam_marks,
        max_exam_marks=record.max_exam_marks,
        exam_marks_pct=record.exam_marks_pct,
        focus_score=record.focus_score,
        linked_goal_id=str(record.linked_goal_id) if record.linked_goal_id else None,
        session_date=record.session_date,
        created_at=record.created_at,
    )


async def log_study_session(
    user_id: str, payload: StudyCreateRequest
) -> StudyRecordResponse:
    """
    Creates a new study activity record.
    The StudyActivity model's model_validator auto-computes quiz_marks_pct and exam_marks_pct,
    mirroring the TypeScript StudyActivitySchema.pre('validate') middleware.
    """
    record = StudyActivity(
        user_id=PydanticObjectId(user_id),
        subject=payload.subject,
        study_hours=payload.study_hours,
        session_type=payload.session_type,
        attendance_pct=payload.attendance_pct,
        quiz_marks=payload.quiz_marks,
        max_quiz_marks=payload.max_quiz_marks,
        exam_marks=payload.exam_marks,
        max_exam_marks=payload.max_exam_marks,
        focus_score=payload.focus_score,
        linked_goal_id=PydanticObjectId(payload.linked_goal_id) if payload.linked_goal_id else None,
        session_date=payload.session_date or datetime.now(timezone.utc),
    )
    await record.insert()
    logger.info("Study session logged: %s for user %s", record.subject, user_id)
    return _to_response(record)


async def list_sessions(
    user_id: str,
    page: int = 1,
    limit: int = 20,
    subject_filter: Optional[str] = None,
) -> PaginatedStudyResponse:
    """
    Paginated study history. Uses idx_study_user_date ESR index (user_id + session_date desc).
    """
    uid = PydanticObjectId(user_id)
    query_filter: dict = {"user_id": uid}
    if subject_filter:
        query_filter["subject"] = subject_filter

    skip = (page - 1) * limit
    records = await StudyActivity.find(
        query_filter,
        sort=[("session_date", -1)],
        skip=skip,
        limit=limit,
    ).to_list()

    total = await StudyActivity.find(query_filter).count()

    return PaginatedStudyResponse(
        data=[_to_response(r) for r in records],
        total=total,
        page=page,
        limit=limit,
        total_pages=max(1, -(-total // limit)),
    )


async def get_subject_performance(
    user_id: str,
    start_date: Optional[datetime] = None,
) -> list[SubjectPerformanceSummary]:
    """
    MongoDB aggregation pipeline — Python port of getSubjectPerformanceSummary()
    from study_repository.ts.
    """
    uid = PydanticObjectId(user_id)
    match_stage: dict = {"user_id": uid}
    if start_date:
        match_stage["session_date"] = {"$gte": start_date}

    pipeline = [
        {"$match": match_stage},
        {"$group": {
            "_id": "$subject",
            "total_study_hours":    {"$sum": "$study_hours"},
            "average_attendance_pct": {"$avg": "$attendance_pct"},
            "average_quiz_pct":     {"$avg": "$quiz_marks_pct"},
            "average_exam_pct":     {"$avg": "$exam_marks_pct"},
            "session_count":        {"$sum": 1},
        }},
        {"$sort": {"total_study_hours": -1}},
    ]

    results = await StudyActivity.aggregate(pipeline).to_list()
    return [
        SubjectPerformanceSummary(
            subject=r["_id"],
            total_study_hours=Decimal(str(r.get("total_study_hours") or 0)),
            average_attendance_pct=round(float(str(r.get("average_attendance_pct") or 0)), 2),
            average_quiz_pct=round(float(str(r.get("average_quiz_pct") or 0)), 2),
            average_exam_pct=round(float(str(r.get("average_exam_pct") or 0)), 2),
            session_count=r["session_count"],
        )
        for r in results
    ]
