"""
tests/test_auth_dependency.py — Unit tests for api/dependencies.py's get_current_user,
the auth guard used by every protected endpoint in the app. No DB/network — patches
User.get and decode_access_token directly.
"""
from unittest.mock import AsyncMock, patch

import pytest
from beanie import PydanticObjectId
from fastapi import HTTPException

from api.dependencies import get_current_user
from core.security import create_access_token
from models.user import Profile, User

USER_ID = "507f1f77bcf86cd799439011"


def _user(token_version: int = 0) -> User:
    user = User.model_construct(
        email="depstest@example.com", password_hash="x",
        profile=Profile(name="Dep Test", age=30), token_version=token_version,
    )
    user.id = PydanticObjectId(USER_ID)
    return user


@pytest.mark.asyncio
async def test_valid_token_matching_version_returns_user():
    token = create_access_token(subject=USER_ID, token_version=0)
    with patch.object(User, "get", new=AsyncMock(return_value=_user(token_version=0))):
        result = await get_current_user(token)
    assert str(result.id) == USER_ID


@pytest.mark.asyncio
async def test_garbage_token_rejected():
    with pytest.raises(HTTPException) as exc_info:
        await get_current_user("not-a-real-token")
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_token_for_nonexistent_user_rejected():
    token = create_access_token(subject=USER_ID, token_version=0)
    with patch.object(User, "get", new=AsyncMock(return_value=None)):
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token)
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_stale_token_version_rejected():
    """The core regression test for this session's logout/password-change feature:
    a token minted under an older token_version must be rejected once the user's
    stored version has been bumped (by logout or a password change)."""
    token = create_access_token(subject=USER_ID, token_version=0)
    with patch.object(User, "get", new=AsyncMock(return_value=_user(token_version=1))):
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token)
    assert exc_info.value.status_code == 401
    assert "invalidated" in exc_info.value.detail.lower()


@pytest.mark.asyncio
async def test_pre_existing_token_with_no_tv_claim_still_works_for_a_fresh_user():
    """Backward-compatibility check: a user who has never logged out/changed their
    password (token_version still 0) must still authenticate with a legacy-shaped
    token that has no `tv` claim at all (decode_access_token defaults it to 0)."""
    from jose import jwt
    from datetime import datetime, timedelta, timezone
    from core.config import get_settings

    settings = get_settings()
    legacy_payload = {
        "sub": USER_ID,
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        "iat": datetime.now(timezone.utc),
    }
    legacy_token = jwt.encode(legacy_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    with patch.object(User, "get", new=AsyncMock(return_value=_user(token_version=0))):
        result = await get_current_user(legacy_token)
    assert str(result.id) == USER_ID
