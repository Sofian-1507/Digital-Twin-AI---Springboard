"""
api/v1/users.py — User profile management endpoints.
GET    /api/v1/users/me              → full twin context (O(1) read)
PATCH  /api/v1/users/me/profile      → partial profile update
PATCH  /api/v1/users/me/preferences  → partial preferences update
POST   /api/v1/users/me/goals        → add active goal
GET    /api/v1/users/me/goals        → list active goals
"""
import logging
from datetime import datetime
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, status, Depends
from beanie import PydanticObjectId

from api.dependencies import CurrentUser
from models.user import User
from schemas.user_schema import (
    UserResponse,
    ProfileUpdateRequest,
    ProfileResponse,
    PreferencesResponse,
    PreferencesUpdateRequest,
    ActiveGoalResponse,
    ActiveGoalCreateRequest,
    DigitalTwinStateResponse,
)
import services.user_service as user_service

logger = logging.getLogger("digital_twin_ai.users_router")
router = APIRouter(prefix="/users", tags=["User Profile"])


def _serialize_user(user: User) -> UserResponse:
    """Serialises a User Beanie Document into the API response shape."""
    return UserResponse(
        id=str(user.id),
        email=user.email,
        profile=ProfileResponse(
            name=user.profile.name,
            age=user.profile.age,
            gender=user.profile.gender,
            occupation=user.profile.occupation,
            monthly_income_baseline=user.profile.monthly_income_baseline,
            risk_tolerance=user.profile.risk_tolerance,
        ),
        preferences=PreferencesResponse(
            currency=user.preferences.currency,
            language=user.preferences.language,
            dark_mode=user.preferences.dark_mode,
            email_notifications=user.preferences.email_notifications,
            weekly_report_enabled=user.preferences.weekly_report_enabled,
        ),
        active_goals=[
            ActiveGoalResponse(
                goal_id=g.goal_id,
                title=g.title,
                category=g.category,
                target_value=g.target_value,
                current_value=g.current_value,
                unit=g.unit,
                target_date=g.target_date,
                created_at=g.created_at,
            )
            for g in user.active_goals
        ],
        digital_twin_state=DigitalTwinStateResponse(
            savings_rate_pct=user.digital_twin_state.savings_rate_pct,
            emergency_fund_months=user.digital_twin_state.emergency_fund_months,
            study_consistency_score=user.digital_twin_state.study_consistency_score,
            predicted_exam_score=user.digital_twin_state.predicted_exam_score,
            habit_completion_rate=user.digital_twin_state.habit_completion_rate,
            lifestyle_score=user.digital_twin_state.lifestyle_score,
            productivity_score=user.digital_twin_state.productivity_score,
            burnout_risk_cluster=user.digital_twin_state.burnout_risk_cluster,
            last_updated_at=user.digital_twin_state.last_updated_at,
        ),
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get complete twin context (O(1) read)",
)
async def get_me(current_user: CurrentUser) -> UserResponse:
    """
    Returns the full user aggregate in a single database read:
    profile + preferences + active_goals + digital_twin_state.
    Python equivalent of getTwinContext() from user_repository.ts.
    """
    return _serialize_user(current_user)


@router.patch(
    "/me/profile",
    response_model=UserResponse,
    summary="Partially update user profile",
)
async def update_profile(
    payload: ProfileUpdateRequest,
    current_user: CurrentUser,
) -> UserResponse:
    """Applies partial $set updates to the embedded profile subdocument."""
    updated = await user_service.update_profile(current_user, payload)
    return _serialize_user(updated)


@router.patch(
    "/me/preferences",
    response_model=UserResponse,
    summary="Update user notification and display preferences",
)
async def update_preferences(
    payload: PreferencesUpdateRequest,
    current_user: CurrentUser,
) -> UserResponse:
    """Applies partial $set updates to the embedded preferences subdocument."""
    updated = await user_service.update_preferences(current_user, payload)
    return _serialize_user(updated)


@router.post(
    "/me/goals",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new active goal (hard cap: 30)",
)
async def add_goal(
    payload: ActiveGoalCreateRequest,
    current_user: CurrentUser,
) -> UserResponse:
    """
    Atomically appends a new goal to the user's active_goals array.
    Enforces the hard cap of 30 items (mirrors addActiveGoal() from user_repository.ts).
    Returns 422 if the cap is reached.
    """
    updated = await user_service.add_active_goal(current_user, payload)
    return _serialize_user(updated)


@router.get(
    "/me/goals",
    response_model=list[ActiveGoalResponse],
    summary="List all active goals for the current user",
)
async def list_goals(current_user: CurrentUser) -> list[ActiveGoalResponse]:
    """Returns the bounded active goals array directly from the user document."""
    return [
        ActiveGoalResponse(
            goal_id=g.goal_id,
            title=g.title,
            category=g.category,
            target_value=g.target_value,
            current_value=g.current_value,
            unit=g.unit,
            target_date=g.target_date,
            created_at=g.created_at,
        )
        for g in current_user.active_goals
    ]
