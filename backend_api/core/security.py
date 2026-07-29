"""
core/security.py — JWT creation/verification and bcrypt password hashing.
Mirrors the authentication intent of the TS layer's password_hash field (users.password_hash).

NOTE: passlib 1.7.4 is incompatible with bcrypt >= 4.x (bcrypt removed __about__ and
enforces strict 72-byte password limits in _finalize_backend_mixin, causing a ValueError
at import/first-use time). We therefore call the `bcrypt` library directly, which gives
identical output format ($2b$ hashes) and is 100% compatible with any existing hashes
stored in MongoDB by the TypeScript layer (which also uses bcrypt directly).
"""
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt as _bcrypt
from jose import JWTError, jwt

from core.config import get_settings

settings = get_settings()

_BCRYPT_ROUNDS = 12  # matches typical TS bcrypt default


# ─── Password ─────────────────────────────────────────────────────────────────

def hash_password(plain: str) -> str:
    """Returns a bcrypt $2b$ hash of the provided plain-text password.
    Uses the bcrypt library directly to avoid passlib 1.7.4 / bcrypt >= 4.x incompatibility.
    """
    encoded = plain.encode("utf-8")
    hashed = _bcrypt.hashpw(encoded, _bcrypt.gensalt(rounds=_BCRYPT_ROUNDS))
    return hashed.decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    """Returns True if plain matches the stored bcrypt hash.
    Compatible with hashes produced by both this function and the TS bcrypt layer.
    """
    try:
        return _bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


# ─── JWT ──────────────────────────────────────────────────────────────────────

def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a signed JWT access token.
    `subject` is the user's MongoDB ObjectId string.
    """
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {"sub": subject, "exp": expire, "iat": datetime.now(timezone.utc)}
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[str]:
    """
    Decodes and validates a JWT token.
    Returns the `sub` (user_id) claim if valid, None if expired or invalid.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload.get("sub")
    except JWTError:
        return None
