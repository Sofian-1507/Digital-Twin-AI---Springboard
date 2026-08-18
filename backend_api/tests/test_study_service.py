"""
tests/test_study_service.py — Unit tests for services/study_service.py.
Same no-DB/mocked-I/O approach as tests/test_finance_service.py.
"""
from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from beanie import PydanticObjectId

from core.exceptions import NotFoundError
from models.enums import SessionType
from models.study import StudyActivity
from schemas.study_schema import StudyCreateRequest, StudyUpdateRequest
import services.study_service as study_service

USER_ID = "507f1f77bcf86cd799439011"
SESSION_ID = "507f1f77bcf86cd799439033"


def _fake_insert():
    async def insert(self):
        self.id = PydanticObjectId(SESSION_ID)
        return self
    return insert


def _patch_document_init():
    return patch.object(StudyActivity, "get_motor_collection", return_value=MagicMock())


# ─── log_study_session ───────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_log_study_session_normal_case():
    payload = StudyCreateRequest(subject="Mathematics", study_hours=Decimal("2.0"), session_type=SessionType.DEEP_WORK)
    with _patch_document_init(), \
         patch.object(StudyActivity, "insert", new=_fake_insert()), \
         patch("services.study_service.activity_service.log_activity", new=AsyncMock()):
        result = await study_service.log_study_session(USER_ID, payload)
    assert result.subject == "Mathematics"
    assert result.study_hours == Decimal("2.0")


@pytest.mark.asyncio
async def test_log_study_session_linked_goal_id_passed_through_as_str():
    goal_id = "e02fdbdc-00db-419f-848e-e4d6df52b0ef"
    payload = StudyCreateRequest(
        subject="Physics", study_hours=Decimal("1.5"), session_type=SessionType.REVIEW, linked_goal_id=goal_id,
    )
    with _patch_document_init(), \
         patch.object(StudyActivity, "insert", new=_fake_insert()), \
         patch("services.study_service.activity_service.log_activity", new=AsyncMock()):
        result = await study_service.log_study_session(USER_ID, payload)
    assert result.linked_goal_id == goal_id


@pytest.mark.asyncio
async def test_log_study_session_auto_computes_quiz_percentage():
    payload = StudyCreateRequest(
        subject="CS", study_hours=Decimal("3.0"), session_type=SessionType.PRACTICE_EXAM,
        quiz_marks=Decimal("18"), max_quiz_marks=Decimal("20"),
    )
    with _patch_document_init(), \
         patch.object(StudyActivity, "insert", new=_fake_insert()), \
         patch("services.study_service.activity_service.log_activity", new=AsyncMock()):
        result = await study_service.log_study_session(USER_ID, payload)
    assert result.quiz_marks_pct == Decimal("90.00")


# ─── update_session ──────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_update_session_normal_case():
    record = StudyActivity.model_construct(
        user_id=PydanticObjectId(USER_ID), subject="Mathematics", study_hours=Decimal("2.0"),
        session_type=SessionType.DEEP_WORK, attendance_pct=Decimal("100"),
        quiz_marks=None, max_quiz_marks=None, quiz_marks_pct=None,
        exam_marks=None, max_exam_marks=None, exam_marks_pct=None,
        focus_score=None, linked_goal_id=None,
        session_date=datetime.now(timezone.utc), created_at=datetime.now(timezone.utc),
    )
    record.id = PydanticObjectId(SESSION_ID)

    with patch.object(StudyActivity, "find_one", new=AsyncMock(return_value=record)), \
         patch.object(StudyActivity, "save", new=AsyncMock()), \
         patch("services.study_service.activity_service.log_activity", new=AsyncMock()):
        result = await study_service.update_session(
            USER_ID, SESSION_ID, StudyUpdateRequest(study_hours=Decimal("3.5"))
        )
    assert result.study_hours == Decimal("3.5")


@pytest.mark.asyncio
async def test_update_session_not_found_bad_id_format():
    with pytest.raises(NotFoundError):
        await study_service.update_session(USER_ID, "not-an-object-id", StudyUpdateRequest())


@pytest.mark.asyncio
async def test_update_session_not_found_valid_id_no_match():
    with patch.object(StudyActivity, "find_one", new=AsyncMock(return_value=None)):
        with pytest.raises(NotFoundError):
            await study_service.update_session(USER_ID, SESSION_ID, StudyUpdateRequest())


# ─── delete_session ──────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_delete_session_normal_case():
    record = StudyActivity.model_construct(
        user_id=PydanticObjectId(USER_ID), subject="Physics", study_hours=Decimal("1.0"),
        session_type=SessionType.REVIEW,
    )
    record.id = PydanticObjectId(SESSION_ID)

    with patch.object(StudyActivity, "find_one", new=AsyncMock(return_value=record)), \
         patch.object(StudyActivity, "delete", new=AsyncMock()) as mock_delete, \
         patch("services.study_service.activity_service.log_activity", new=AsyncMock()):
        await study_service.delete_session(USER_ID, SESSION_ID)
    mock_delete.assert_awaited_once()


@pytest.mark.asyncio
async def test_delete_session_not_found():
    with patch.object(StudyActivity, "find_one", new=AsyncMock(return_value=None)):
        with pytest.raises(NotFoundError):
            await study_service.delete_session(USER_ID, SESSION_ID)


# ─── list_sessions ───────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_list_sessions_pagination_math():
    query = MagicMock()
    query.to_list = AsyncMock(return_value=[])
    query.count = AsyncMock(return_value=41)

    with patch.object(StudyActivity, "find", return_value=query):
        result = await study_service.list_sessions(USER_ID, page=1, limit=20)
    assert result.total == 41
    assert result.total_pages == 3


@pytest.mark.asyncio
async def test_list_sessions_subject_filter_reaches_query():
    captured = {}

    def fake_find(query_filter, **kwargs):
        captured["filter"] = query_filter
        query = MagicMock()
        query.to_list = AsyncMock(return_value=[])
        query.count = AsyncMock(return_value=0)
        return query

    with patch.object(StudyActivity, "find", side_effect=fake_find):
        await study_service.list_sessions(USER_ID, subject_filter="Physics")
    assert captured["filter"]["subject"] == "Physics"


# ─── get_subject_performance ──────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_subject_performance_maps_aggregation_results():
    raw_results = [
        {"_id": "Mathematics", "total_study_hours": 12.5, "average_attendance_pct": 95.0,
         "average_quiz_pct": 80.0, "average_exam_pct": None, "session_count": 5},
    ]
    mock_cursor = MagicMock()
    mock_cursor.to_list = AsyncMock(return_value=raw_results)

    with patch.object(StudyActivity, "aggregate", return_value=mock_cursor):
        items = await study_service.get_subject_performance(USER_ID)
    assert items[0].subject == "Mathematics"
    assert items[0].session_count == 5
    assert items[0].average_exam_pct == 0.0  # None -> 0, not a crash
