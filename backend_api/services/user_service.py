"""
services/user_service.py — Business logic layer for user profile management.
Python equivalent of UserRepository from backend/database/repositories/user_repository.ts.
All CRUD operations reuse Beanie's O(1) document access patterns.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from decimal import Decimal

from beanie import PydanticObjectId
from beanie.operators import Set, Push, Pull

from core.exceptions import NotFoundError, BusinessRuleError, ConflictError
from core.security import hash_password, verify_password
from models.user import User, Profile, ActiveGoal, DigitalTwinState, UserPreferences
from models.enums import GoalStatus
from schemas.auth_schema import RegisterRequest
from schemas.user_schema import ProfileUpdateRequest, ActiveGoalCreateRequest, PreferencesUpdateRequest

logger = logging.getLogger("digital_twin_ai.user_service")


async def create_user(payload: RegisterRequest) -> User:
    """Registers a new user. Raises ConflictError if email already exists."""
    existing = await User.find_one(User.email == payload.email.lower())
    if existing:
        raise ConflictError(f"An account with email '{payload.email}' already exists.")

    user = User(
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        profile=Profile(
            name=payload.name,
            age=payload.age,
            monthly_income_baseline=Decimal(str(payload.monthly_income_baseline)),
        ),
    )
    await user.insert()
    logger.info("User registered: %s (id=%s)", user.email, user.id)
    return user


async def authenticate_user(email: str, password: str) -> User:
    """
    Validates credentials and returns the User document.
    Equivalent to the TS pattern: findOne({email}) + bcrypt.compare().
    """
    user = await User.find_one(
        User.email == email.lower(),
        projection_model=None,    # We need password_hash which is excluded by default
        fetch_links=False,
    )

    # Fetch again with password_hash explicitly included
    from motor.motor_asyncio import AsyncIOMotorCollection
    from beanie import get_database
    raw = await get_database()["users"].find_one(
        {"email": email.lower()},
        {"password_hash": 1, "email": 1}
    )

    if not raw or not verify_password(password, raw.get("password_hash", "")):
        from core.exceptions import AuthenticationError
        raise AuthenticationError("Incorrect email or password.")

    user = await User.find_one(User.email == email.lower())
    return user


async def get_twin_context(user_id: str) -> User:
    """
    O(1) single-document read — mirrors getTwinContext() from user_repository.ts.
    Returns the full user aggregate: profile + preferences + active_goals + twin_state.
    """
    user = await User.get(PydanticObjectId(user_id))
    if not user:
        raise NotFoundError("User", user_id)
    return user


async def update_profile(user: User, payload: ProfileUpdateRequest) -> User:
    """Applies a partial profile update using atomic $set operations."""
    update_data: dict = {}
    for field, value in payload.model_dump(exclude_none=True).items():
        update_data[f"profile.{field}"] = value

    if not update_data:
        return user

    update_data["updated_at"] = datetime.now(timezone.utc)
    await user.update(Set(update_data))
    await user.sync()
    logger.info("Profile updated for user: %s", user.id)
    return user


async def update_preferences(user: User, payload: PreferencesUpdateRequest) -> User:
    """Applies a partial preferences update."""
    update_data: dict = {}
    for field, value in payload.model_dump(exclude_none=True).items():
        update_data[f"preferences.{field}"] = value

    if not update_data:
        return user

    update_data["updated_at"] = datetime.now(timezone.utc)
    await user.update(Set(update_data))
    await user.sync()
    return user


async def add_active_goal(user: User, payload: ActiveGoalCreateRequest) -> User:
    """
    Atomically adds a new goal, enforcing the hard cap of 30 items.
    Mirrors addActiveGoal() from user_repository.ts.
    """
    if len(user.active_goals) >= 30:
        raise BusinessRuleError(
            "Active goals array hard cap reached (30 items). "
            "Please complete or archive existing targets first."
        )

    new_goal = ActiveGoal(
        title=payload.title,
        category=payload.category,
        target_value=payload.target_value,
        unit=payload.unit,
        target_date=payload.target_date,
    )

    await user.update(Push({User.active_goals: new_goal}))
    await user.sync()
    logger.info("Goal '%s' added for user %s", new_goal.title, user.id)
    return user
