"""
api/v1/auth.py — Authentication endpoints.
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
"""
import logging

from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse

from api.dependencies import CurrentUser
from beanie.operators import Inc
from core.security import create_access_token
from core.exceptions import ConflictError, AuthenticationError
from core.rate_limit import limiter
from models.user import User
from schemas.auth_schema import RegisterRequest, LoginRequest, TokenResponse
import services.user_service as user_service

logger = logging.getLogger("digital_twin_ai.auth_router")
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
@limiter.limit("5/minute")
async def register(request: Request, payload: RegisterRequest) -> TokenResponse:
    """
    Creates a new user document in the `users` collection.
    Returns a JWT access token immediately so the user is auto-logged-in after signup.
    Raises 409 if the email is already registered.
    Rate limited to 5/minute per IP to blunt automated mass-registration.
    """
    user = await user_service.create_user(payload)
    token = create_access_token(subject=str(user.id), token_version=user.token_version)
    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        email=user.email,
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate and receive a JWT access token",
)
@limiter.limit("10/minute")
async def login(request: Request, payload: LoginRequest) -> TokenResponse:
    """
    Validates credentials and returns a JWT.
    The token encodes the user's MongoDB ObjectId as the `sub` claim.
    Rate limited to 10/minute per IP to blunt brute-force/credential-stuffing attempts.
    """
    user = await user_service.authenticate_user(payload.email, payload.password)
    token = create_access_token(subject=str(user.id), token_version=user.token_version)
    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        email=user.email,
    )


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Invalidate the current session everywhere",
)
async def logout(current_user: CurrentUser) -> None:
    """
    Bumps token_version, which immediately invalidates every JWT previously issued
    to this user (not just the one used to call this endpoint) — there's no
    per-device session concept in this app, so logout is "logout everywhere."
    """
    await current_user.update(Inc({User.token_version: 1}))
    logger.info("User %s logged out (token_version bumped).", current_user.id)
