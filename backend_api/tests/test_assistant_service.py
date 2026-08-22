"""
tests/test_assistant_service.py — Unit tests for services/ai_assistant_service.py.
No network calls — _call_gemini/_call_groq and get_settings are mocked directly.
"""
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest

from core.exceptions import AIProviderUnavailableError
from models.enums import GoalCategory, RiskTolerance
from models.user import Profile, User
from services import ai_assistant_service


def _user() -> User:
    return User.model_construct(
        email="assistant-test@example.com",
        password_hash="x",
        profile=Profile(name="Test User", age=25, risk_tolerance=RiskTolerance.MODERATE),
        active_goals=[],
    )


def _settings(gemini: str = None, groq: str = None):
    return SimpleNamespace(GEMINI_API_KEY=gemini, GROQ_API_KEY=groq)


@pytest.mark.asyncio
async def test_gemini_success_returns_gemini_reply():
    with patch.object(ai_assistant_service, "get_settings", return_value=_settings(gemini="k1", groq="k2")), \
         patch.object(ai_assistant_service, "_call_gemini", new=AsyncMock(return_value="hi from gemini")), \
         patch.object(ai_assistant_service, "_call_groq", new=AsyncMock(return_value="hi from groq")) as groq_mock:
        reply, provider = await ai_assistant_service.get_assistant_reply(_user(), "hello")

    assert reply == "hi from gemini"
    assert provider == "gemini"
    groq_mock.assert_not_called()


@pytest.mark.asyncio
async def test_gemini_failure_falls_back_to_groq():
    with patch.object(ai_assistant_service, "get_settings", return_value=_settings(gemini="k1", groq="k2")), \
         patch.object(ai_assistant_service, "_call_gemini", new=AsyncMock(side_effect=RuntimeError("boom"))), \
         patch.object(ai_assistant_service, "_call_groq", new=AsyncMock(return_value="hi from groq")):
        reply, provider = await ai_assistant_service.get_assistant_reply(_user(), "hello")

    assert reply == "hi from groq"
    assert provider == "groq"


@pytest.mark.asyncio
async def test_gemini_unconfigured_goes_straight_to_groq():
    with patch.object(ai_assistant_service, "get_settings", return_value=_settings(gemini=None, groq="k2")), \
         patch.object(ai_assistant_service, "_call_gemini", new=AsyncMock()) as gemini_mock, \
         patch.object(ai_assistant_service, "_call_groq", new=AsyncMock(return_value="hi from groq")):
        reply, provider = await ai_assistant_service.get_assistant_reply(_user(), "hello")

    assert reply == "hi from groq"
    assert provider == "groq"
    gemini_mock.assert_not_called()


@pytest.mark.asyncio
async def test_both_providers_fail_raises_ai_provider_unavailable():
    with patch.object(ai_assistant_service, "get_settings", return_value=_settings(gemini="k1", groq="k2")), \
         patch.object(ai_assistant_service, "_call_gemini", new=AsyncMock(side_effect=RuntimeError("boom"))), \
         patch.object(ai_assistant_service, "_call_groq", new=AsyncMock(side_effect=RuntimeError("boom too"))):
        with pytest.raises(AIProviderUnavailableError):
            await ai_assistant_service.get_assistant_reply(_user(), "hello")


@pytest.mark.asyncio
async def test_neither_provider_configured_raises_ai_provider_unavailable():
    with patch.object(ai_assistant_service, "get_settings", return_value=_settings(gemini=None, groq=None)):
        with pytest.raises(AIProviderUnavailableError):
            await ai_assistant_service.get_assistant_reply(_user(), "hello")


def test_build_context_includes_goal_and_twin_state():
    user = _user()
    user.active_goals = [
        type("G", (), {
            "title": "Emergency Fund", "category": GoalCategory.FINANCE,
            "current_value": 3000, "target_value": 15000, "unit": "USD",
        })()
    ]
    context = ai_assistant_service._build_context(user)
    assert "Test User" in context
    assert "Emergency Fund" in context
    assert "savings rate" in context
