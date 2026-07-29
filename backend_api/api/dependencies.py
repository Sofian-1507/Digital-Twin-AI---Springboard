"""
api/dependencies.py — Reusable FastAPI dependency injection functions.
`get_current_user` is the primary auth guard used by all protected endpoints.
"""
import logging
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from beanie import PydanticObjectId
from core.security import decode_access_token
from core.exceptions import AuthenticationError
from models.user import User

logger = logging.getLogger("digital_twin_ai.auth")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)]
) -> User:
    """
    Decodes the bearer JWT and returns the live User document from MongoDB.
    Raises HTTP 401 if the token is invalid/expired or the user no longer exists.
    This is the FastAPI equivalent of the TS layer's getTwinContext() O(1) read.
    """
    user_id = decode_access_token(token)
    if not user_id:
        logger.warning("Invalid or expired JWT token presented.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await User.get(PydanticObjectId(user_id))
    if not user:
        logger.warning("JWT references non-existent user_id: %s", user_id)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


# Convenience type alias for use in endpoint signatures
CurrentUser = Annotated[User, Depends(get_current_user)]
