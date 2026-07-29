"""
api/v1/auth.py — Authentication endpoints.
POST /api/v1/auth/register
POST /api/v1/auth/login
"""
import logging

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from core.security import create_access_token
from core.exceptions import ConflictError, AuthenticationError
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
async def register(payload: RegisterRequest) -> TokenResponse:
    """
    Creates a new user document in the `users` collection.
    Returns a JWT access token immediately so the user is auto-logged-in after signup.
    Raises 409 if the email is already registered.
    """
    user = await user_service.create_user(payload)
    token = create_access_token(subject=str(user.id))
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
async def login(payload: LoginRequest) -> TokenResponse:
    """
    Validates credentials and returns a JWT.
    The token encodes the user's MongoDB ObjectId as the `sub` claim.
    """
    user = await user_service.authenticate_user(payload.email, payload.password)
    token = create_access_token(subject=str(user.id))
    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        email=user.email,
    )
