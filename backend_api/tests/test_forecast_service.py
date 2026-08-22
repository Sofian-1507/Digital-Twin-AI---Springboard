"""
tests/test_forecast_service.py — Unit tests for services/forecast_service.py.

Two layers:
1. Pure-function tests: exercise the math directly with plain data, no mocking, no DB.
2. Service-level tests: patch out the only two I/O calls the service makes
   (finance_service.get_monthly_cashflow and User.get) with AsyncMock, and construct
   real in-memory User/ActiveGoal/Profile instances (Beanie Documents are plain Pydantic
   models — no DB connection is required unless .insert()/.get()/.save() is called).
"""
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from unittest.mock import AsyncMock, patch

import pytest

from core.exceptions import NotFoundError
from models.enums import GoalCategory, TransactionType
from models.user import ActiveGoal, Profile, User
from schemas.finance_schema import MonthlyCashflowItem
from schemas.forecast_schema import ForecastMethod
from services.forecast_service import (
    ForecastService,
    _backtest_series,
    _build_monthly_series,
    _compute_confidence,
    _estimate_months_to_goal,
    _linear_regression_forecast,
    _moving_average_forecast,
    _naive_forecast,
    _select_method,
)

VALID_USER_ID = "507f1f77bcf86cd799439011"


def _cashflow_items(rows: list[tuple[int, int, float, float]]) -> list[MonthlyCashflowItem]:
    """rows: list of (year, month, income, expense)."""
    items: list[MonthlyCashflowItem] = []
    for year, month, income, expense in rows:
        if income:
            items.append(
                MonthlyCashflowItem(
                    year=year, month=month, type=TransactionType.INCOME,
                    total_amount=Decimal(str(income)), transaction_count=1,
                )
            )
        if expense:
            items.append(
                MonthlyCashflowItem(
                    year=year, month=month, type=TransactionType.EXPENSE,
                    total_amount=Decimal(str(expense)), transaction_count=1,
                )
            )
    return items


def _user_with_goal(
    goal_id: str,
    current: float,
    target: float,
    target_date: datetime,
    category: GoalCategory = GoalCategory.FINANCE,
    monthly_income_baseline: Decimal = Decimal("0"),
) -> User:
    return User.model_construct(
        email="goals@example.com",
        password_hash="hashed",
        profile=Profile(name="Goal Owner", age=30, monthly_income_baseline=monthly_income_baseline),
        active_goals=[
            ActiveGoal(
                goal_id=goal_id,
                title="Test Goal",
                category=category,
                target_value=Decimal(str(target)),
                current_value=Decimal(str(current)),
                unit="USD",
                target_date=target_date,
            )
        ],
    )


def _patch_cashflow(items):
    return patch(
        "services.forecast_service.finance_service.get_monthly_cashflow",
        new=AsyncMock(return_value=items),
    )


def _patch_user_get(user):
    return patch("services.forecast_service.User.get", new=AsyncMock(return_value=user))


# ─────────────────────────────────────────────────────────────────────────────
# Pure-function tests
# ─────────────────────────────────────────────────────────────────────────────

@pytest.mark.parametrize(
    "n,expected",
    [
        (0, ForecastMethod.INSUFFICIENT_DATA),
        (1, ForecastMethod.NAIVE_LAST_VALUE),
        (2, ForecastMethod.MOVING_AVERAGE),
        (3, ForecastMethod.MOVING_AVERAGE),
        (4, ForecastMethod.LINEAR_REGRESSION),
        (10, ForecastMethod.LINEAR_REGRESSION),
    ],
)
def test_select_method_boundaries(n, expected):
    assert _select_method(n) == expected


def test_naive_forecast_repeats_last_value():
    assert _naive_forecast([100.0], 3) == [100.0, 100.0, 100.0]
    assert _naive_forecast([50.0, 80.0], 2) == [80.0, 80.0]


def test_moving_average_uses_all_points_when_fewer_than_window():
    result = _moving_average_forecast([100.0, 200.0], periods_ahead=2, window=3)
    assert result == [150.0, 150.0]


def test_moving_average_uses_last_n_points_when_more_than_window():
    result = _moving_average_forecast([10.0, 1000.0, 20.0, 30.0, 40.0], periods_ahead=1, window=3)
    assert result == [30.0]  # avg of last 3: 20, 30, 40


def test_linear_regression_perfect_upward_trend():
    values = [100.0, 200.0, 300.0, 400.0]
    forecast, r_squared = _linear_regression_forecast(values, periods_ahead=2)
    assert forecast[0] == pytest.approx(500.0, abs=1e-6)
    assert forecast[1] == pytest.approx(600.0, abs=1e-6)
    assert r_squared == pytest.approx(1.0, abs=1e-6)


def test_linear_regression_flat_series_is_stable():
    values = [100.0, 100.0, 100.0, 100.0]
    forecast, r_squared = _linear_regression_forecast(values, periods_ahead=1)
    assert forecast[0] == pytest.approx(100.0)
    assert r_squared == pytest.approx(1.0)


def test_linear_regression_noisy_series_has_lower_r_squared():
    values = [100.0, 250.0, 90.0, 400.0]
    _, r_squared = _linear_regression_forecast(values, periods_ahead=1)
    assert 0.0 <= r_squared < 1.0


def test_confidence_insufficient_data_is_zero():
    assert _compute_confidence(ForecastMethod.INSUFFICIENT_DATA, 0, None) == 0.0


@pytest.mark.parametrize(
    "method,n,r2",
    [
        (ForecastMethod.BASELINE_FALLBACK, 0, None),
        (ForecastMethod.NAIVE_LAST_VALUE, 1, None),
        (ForecastMethod.MOVING_AVERAGE, 2, None),
        (ForecastMethod.MOVING_AVERAGE, 3, None),
        (ForecastMethod.LINEAR_REGRESSION, 4, 0.0),
        (ForecastMethod.LINEAR_REGRESSION, 12, 1.0),
    ],
)
def test_confidence_stays_within_bounds(method, n, r2):
    confidence = _compute_confidence(method, n, r2)
    assert 0.0 <= confidence <= 1.0


def test_confidence_increases_with_better_regression_fit():
    low = _compute_confidence(ForecastMethod.LINEAR_REGRESSION, 6, 0.1)
    high = _compute_confidence(ForecastMethod.LINEAR_REGRESSION, 6, 0.9)
    assert high > low


def test_confidence_increases_with_more_data_points():
    fewer = _compute_confidence(ForecastMethod.LINEAR_REGRESSION, 4, 0.5)
    more = _compute_confidence(ForecastMethod.LINEAR_REGRESSION, 10, 0.5)
    assert more >= fewer


def test_estimate_months_to_goal_already_met():
    assert _estimate_months_to_goal(Decimal("100"), Decimal("100"), 10.0) == 0
    assert _estimate_months_to_goal(Decimal("150"), Decimal("100"), 10.0) == 0


def test_estimate_months_to_goal_unreachable_at_current_trend():
    assert _estimate_months_to_goal(Decimal("0"), Decimal("100"), 0.0) is None
    assert _estimate_months_to_goal(Decimal("0"), Decimal("100"), -5.0) is None


def test_estimate_months_to_goal_rounds_up():
    # need 100 more, saving 30/month -> ceil(100/30) = 4
    assert _estimate_months_to_goal(Decimal("0"), Decimal("100"), 30.0) == 4


def test_build_monthly_series_trims_leading_gap_and_zero_fills_internal_gap():
    reference = datetime(2026, 8, 1, tzinfo=timezone.utc)
    items = _cashflow_items(
        [
            (2026, 6, 1000, 400),  # active
            # July has no transactions at all -> should zero-fill
            (2026, 8, 1200, 500),  # active
        ]
    )
    series = _build_monthly_series(items, lookback_months=6, reference_date=reference)
    assert series.periods == [(2026, 6), (2026, 7), (2026, 8)]
    assert series.income == [1000.0, 0.0, 1200.0]
    assert series.expense == [400.0, 0.0, 500.0]
    assert series.savings == [600.0, 0.0, 700.0]


def test_build_monthly_series_empty_when_no_transactions():
    series = _build_monthly_series(
        [], lookback_months=6, reference_date=datetime(2026, 8, 1, tzinfo=timezone.utc)
    )
    assert series.periods == []
    assert series.income == []
    assert series.savings == []


# ─────────────────────────────────────────────────────────────────────────────
# Service-level tests (finance_service + User.get mocked)
# ─────────────────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_forecast_savings_insufficient_data_when_no_history():
    service = ForecastService(lookback_months=6)
    with _patch_cashflow([]):
        result = await service.forecast_monthly_savings("user1", months_ahead=2)
    assert result.method_used == ForecastMethod.INSUFFICIENT_DATA
    assert result.data_points_used == 0
    assert result.confidence_score == 0.0
    assert len(result.projections) == 2


@pytest.mark.asyncio
async def test_forecast_savings_naive_with_single_month():
    items = _cashflow_items([(2026, 8, 3000, 2000)])
    service = ForecastService(lookback_months=6)
    with _patch_cashflow(items):
        result = await service.forecast_monthly_savings("user1", months_ahead=1)
    assert result.method_used == ForecastMethod.NAIVE_LAST_VALUE
    assert result.data_points_used == 1
    assert float(result.projections[0].projected_amount) == pytest.approx(1000.0)
    assert result.projections[0].year == 2026
    assert result.projections[0].month == 9


@pytest.mark.asyncio
async def test_forecast_savings_linear_regression_with_six_months_upward_trend():
    items = _cashflow_items(
        [(2026, m, 3000, 3000 - (500 + (m - 3) * 100)) for m in range(3, 9)]
    )  # savings: 500, 600, 700, 800, 900, 1000
    service = ForecastService(lookback_months=6)
    with _patch_cashflow(items):
        result = await service.forecast_monthly_savings("user1", months_ahead=1)
    assert result.method_used == ForecastMethod.LINEAR_REGRESSION
    assert result.data_points_used == 6
    assert result.confidence_score > 0.8
    assert float(result.projections[0].projected_amount) == pytest.approx(1100.0, abs=1.0)


@pytest.mark.asyncio
async def test_project_income_falls_back_to_profile_baseline_when_no_history():
    fake_user = User.model_construct(
        email="baseline@example.com",
        password_hash="hashed",
        profile=Profile(name="Baseline User", age=25, monthly_income_baseline=Decimal("5000")),
    )
    service = ForecastService(lookback_months=6)
    with _patch_cashflow([]), _patch_user_get(fake_user):
        result = await service.project_income(VALID_USER_ID, months_ahead=2)
    assert result.method_used == ForecastMethod.BASELINE_FALLBACK
    assert result.data_points_used == 0
    assert float(result.projections[0].projected_amount) == pytest.approx(5000.0)
    assert len(result.projections) == 2


@pytest.mark.asyncio
async def test_project_income_insufficient_when_no_history_and_no_baseline():
    fake_user = User.model_construct(
        email="nobaseline@example.com",
        password_hash="hashed",
        profile=Profile(name="No Baseline", age=25, monthly_income_baseline=Decimal("0")),
    )
    service = ForecastService(lookback_months=6)
    with _patch_cashflow([]), _patch_user_get(fake_user):
        result = await service.project_income(VALID_USER_ID, months_ahead=1)
    assert result.method_used == ForecastMethod.INSUFFICIENT_DATA


@pytest.mark.asyncio
async def test_project_expenses_has_no_baseline_fallback():
    fake_user = User.model_construct(
        email="expenses@example.com",
        password_hash="hashed",
        profile=Profile(name="Expenses User", age=25, monthly_income_baseline=Decimal("5000")),
    )
    service = ForecastService(lookback_months=6)
    with _patch_cashflow([]), _patch_user_get(fake_user):
        result = await service.project_expenses(VALID_USER_ID, months_ahead=1)
    assert result.method_used == ForecastMethod.INSUFFICIENT_DATA
    assert float(result.projections[0].projected_amount) == pytest.approx(0.0)


@pytest.mark.asyncio
async def test_estimate_goal_completion_on_track():
    goal_id = "goal-1"
    # Comfortably beyond "now + 6 months" regardless of when this test runs.
    target_date = datetime.now(timezone.utc).replace(day=1) + timedelta(days=365)
    fake_user = _user_with_goal(goal_id, current=0, target=3000, target_date=target_date)
    items = _cashflow_items([(2026, m, 2000, 1500) for m in range(3, 9)])  # savings 500/mo x6
    service = ForecastService(lookback_months=6)
    with _patch_cashflow(items), _patch_user_get(fake_user):
        result = await service.estimate_goal_completion(VALID_USER_ID, goal_id)
    assert result.method_used == ForecastMethod.LINEAR_REGRESSION
    assert result.estimated_months_remaining == 6
    assert result.on_track is True


@pytest.mark.asyncio
async def test_estimate_goal_completion_already_met():
    goal_id = "goal-2"
    fake_user = _user_with_goal(
        goal_id, current=5000, target=3000, target_date=datetime(2027, 1, 1, tzinfo=timezone.utc)
    )
    service = ForecastService(lookback_months=6)
    with _patch_cashflow([]), _patch_user_get(fake_user):
        result = await service.estimate_goal_completion(VALID_USER_ID, goal_id)
    assert result.estimated_months_remaining == 0
    assert result.on_track is True


@pytest.mark.asyncio
async def test_estimate_goal_completion_unreachable_at_current_trend():
    goal_id = "goal-3"
    fake_user = _user_with_goal(
        goal_id, current=0, target=3000, target_date=datetime(2027, 1, 1, tzinfo=timezone.utc)
    )
    items = _cashflow_items([(2026, m, 1000, 1500) for m in range(3, 9)])  # negative savings
    service = ForecastService(lookback_months=6)
    with _patch_cashflow(items), _patch_user_get(fake_user):
        result = await service.estimate_goal_completion(VALID_USER_ID, goal_id)
    assert result.estimated_months_remaining is None
    assert result.on_track is None


@pytest.mark.asyncio
async def test_estimate_goal_completion_raises_not_found_for_unknown_goal():
    fake_user = _user_with_goal(
        "real-goal", current=0, target=100, target_date=datetime(2027, 1, 1, tzinfo=timezone.utc)
    )
    service = ForecastService(lookback_months=6)
    with _patch_cashflow([]), _patch_user_get(fake_user):
        with pytest.raises(NotFoundError):
            await service.estimate_goal_completion(VALID_USER_ID, "does-not-exist")


@pytest.mark.asyncio
async def test_estimate_all_goal_completions_filters_finance_category_only():
    finance_goal = ActiveGoal(
        goal_id="f1", title="Save", category=GoalCategory.FINANCE,
        target_value=Decimal("100"), current_value=Decimal("0"), unit="USD",
        target_date=datetime(2027, 1, 1, tzinfo=timezone.utc),
    )
    study_goal = ActiveGoal(
        goal_id="s1", title="Study", category=GoalCategory.STUDY,
        target_value=Decimal("100"), current_value=Decimal("0"), unit="hrs",
        target_date=datetime(2027, 1, 1, tzinfo=timezone.utc),
    )
    fake_user = User.model_construct(
        email="mixed-goals@example.com", password_hash="x",
        active_goals=[finance_goal, study_goal],
    )
    service = ForecastService(lookback_months=6)
    with _patch_cashflow([]), _patch_user_get(fake_user):
        results = await service.estimate_all_goal_completions(VALID_USER_ID)
    assert len(results) == 1
    assert results[0].goal_id == "f1"


@pytest.mark.asyncio
async def test_get_forecast_summary_bundles_and_averages_confidence():
    finance_goal = ActiveGoal(
        goal_id="f1", title="Save", category=GoalCategory.FINANCE,
        target_value=Decimal("100"), current_value=Decimal("0"), unit="USD",
        target_date=datetime(2027, 1, 1, tzinfo=timezone.utc),
    )
    fake_user = User.model_construct(
        email="summary@example.com", password_hash="x",
        profile=Profile(name="Summary User", age=30, monthly_income_baseline=Decimal("4000")),
        active_goals=[finance_goal],
    )
    items = _cashflow_items([(2026, m, 2000, 1500) for m in range(3, 9)])
    service = ForecastService(lookback_months=6)
    with _patch_cashflow(items), _patch_user_get(fake_user):
        summary = await service.get_forecast_summary(VALID_USER_ID)

    expected_avg = round(
        (
            summary.savings_forecast.confidence_score
            + summary.income_projection.confidence_score
            + summary.expense_projection.confidence_score
            + summary.goal_completions[0].confidence_score
        )
        / 4,
        2,
    )
    assert summary.overall_confidence_score == pytest.approx(expected_avg)
    assert summary.user_id == VALID_USER_ID
    assert len(summary.goal_completions) == 1


# ─────────────────────────────────────────────────────────────────────────────
# Backtest accuracy (Milestone 2 "≥85%" evaluation criterion)
# ─────────────────────────────────────────────────────────────────────────────

def test_backtest_series_too_short_returns_empty():
    result = _backtest_series([500.0])
    assert result.points == []
    assert result.overall_accuracy_pct == 0.0


def test_backtest_series_flat_series_scores_perfectly():
    # Every method predicts the same flat value exactly -> 100% at every point.
    result = _backtest_series([500.0] * 8)
    assert len(result.points) == 7
    assert result.overall_accuracy_pct == pytest.approx(100.0, abs=0.01)


def test_backtest_series_perfect_linear_trend_scores_high_once_regression_kicks_in():
    values = [100.0 + 100.0 * i for i in range(10)]  # 100, 200, ..., 1000
    result = _backtest_series(values)
    regression_points = [p for p in result.points if p.method == ForecastMethod.LINEAR_REGRESSION]
    assert regression_points  # the later points should have graduated to linear_regression
    for p in regression_points:
        assert p.accuracy_pct > 95.0


def test_backtest_series_wildly_oscillating_scores_low():
    values = [100.0, 900.0, 50.0, 950.0, 80.0, 920.0, 60.0, 940.0]
    result = _backtest_series(values)
    assert result.overall_accuracy_pct < 60.0


def test_backtest_series_near_zero_actual_does_not_crash_and_stays_bounded():
    values = [1000.0, 1000.0, 1000.0, 0.01, 1000.0]
    result = _backtest_series(values)
    assert len(result.points) == 4
    for p in result.points:
        assert 0.0 <= p.accuracy_pct <= 100.0


@pytest.mark.asyncio
async def test_backtest_accuracy_returns_structured_response():
    items = _cashflow_items([(2026, m, 2000 + m * 10, 1500) for m in range(3, 9)])
    service = ForecastService(lookback_months=6)
    with _patch_cashflow(items):
        result = await service.backtest_accuracy(VALID_USER_ID)

    assert result.user_id == VALID_USER_ID
    assert 0.0 <= result.overall_accuracy_pct <= 100.0
    assert result.income_accuracy.points_evaluated > 0
    assert result.expense_accuracy.points_evaluated > 0
    assert result.savings_accuracy.points_evaluated > 0
    assert result.by_method  # at least one method tier was exercised
    assert all(0.0 <= v <= 100.0 for v in result.by_method.values())


@pytest.mark.asyncio
async def test_backtest_accuracy_handles_no_history_without_crashing():
    service = ForecastService(lookback_months=6)
    with _patch_cashflow([]):
        result = await service.backtest_accuracy(VALID_USER_ID)

    assert result.overall_accuracy_pct == 0.0
    assert result.income_accuracy.points_evaluated == 0
    assert result.by_method == {}
