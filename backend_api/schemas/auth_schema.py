"""
schemas/auth_schema.py — Pydantic request/response schemas for authentication endpoints.
"""
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """Request body for POST /api/v1/auth/register"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=13, le=120)
    occupation: Optional[str] = Field(default=None, max_length=100)
    monthly_income_baseline: float = Field(default=0.0, ge=0)


class LoginRequest(BaseModel):
    """Request body for POST /api/v1/auth/login"""
    email: EmailStr
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    """Response body containing the JWT access token."""
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str


class ChangePasswordRequest(BaseModel):
    """Request body for POST /api/v1/users/me/change-password"""
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=128)
