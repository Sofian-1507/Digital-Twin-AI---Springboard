"""
tests/test_simulation_service.py — Unit tests for services/simulation_service.py.

Pure-function tests only: exercise the scenario math and the shared multi-factor
scoring engine directly with plain data, no mocking, no DB (mirrors the style of
tests/test_forecast_service.py).
"""
from models.user import ActiveGoal
from models.enums import GoalCategory
from services.simulation_service import (
    _average_months_to_goals,
    _estimate_months_to_goal,
    _finance_scenario_deltas,
    _finance_scenario_outcome,
    _fitness_scenario_deltas,
    _fitness_scenario_outcome,
    _normalize_optional,
    _score_scenarios,
    _study_scenario_deltas,
    _study_scenario_outcome,
)


def _goal(current: float, target: float) -> ActiveGoal:
    return ActiveGoal(
        title="Test Goal",
        category=GoalCategory.FINANCE,
        target_value=target,
        current_value=current,
        unit="INR",
        target_date="2027-01-01T00:00:00Z",
    )


# ─── _normalize_optional ───────────────────────────────────────────────────────

def test_normalize_optional_higher_is_better():
    result = _normalize_optional([10.0, 20.0, 30.0], higher_is_better=True)
    assert result == [0.0, 0.5, 1.0]


def test_normalize_optional_lower_is_better():
    result = _normalize_optional([10.0, 20.0, 30.0], higher_is_better=False)
    assert result == [1.0, 0.5, 0.0]


def test_normalize_optional_missing_values_are_neutral():
    result = _normalize_optional([None, 10.0, None], higher_is_better=True)
    assert result == [0.5, 1.0, 0.5]


def test_normalize_optional_all_missing():
    assert _normalize_optional([None, None], higher_is_better=True) == [0.5, 0.5]


def test_normalize_optional_flat_values():
    assert _normalize_optional([5.0, 5.0, 5.0], higher_is_better=True) == [0.5, 0.5, 0.5]


# ─── _score_scenarios ───────────────────────────────────────────────────────────

def test_score_scenarios_best_outcome_scores_highest():
    scores = _score_scenarios([100.0, 200.0, 300.0], [None, None, None], confidence=0.8)
    assert scores[2] > scores[1] > scores[0]


def test_score_scenarios_within_bounds():
    scores = _score_scenarios([0.0, 50.0, 100.0], [10.0, 5.0, None], confidence=0.5)
    assert all(0 <= s <= 100 for s in scores)


def test_score_scenarios_goal_impact_rewards_fewer_months():
    # Same primary outcome, but scenario B reaches its goal sooner.
    scores = _score_scenarios([100.0, 100.0], [12.0, 3.0], confidence=0.9)
    assert scores[1] > scores[0]


# ─── _estimate_months_to_goal / _average_months_to_goals ──────────────────────

def test_estimate_months_to_goal_already_met():
    assert _estimate_months_to_goal(current_value=500, target_value=400, monthly_rate=100) == 0.0


def test_estimate_months_to_goal_unreachable():
    assert _estimate_months_to_goal(current_value=0, target_value=1000, monthly_rate=0) is None


def test_estimate_months_to_goal_normal_case():
    assert _estimate_months_to_goal(current_value=0, target_value=1000, monthly_rate=250) == 4.0


def test_average_months_to_goals_empty_list_is_none():
    assert _average_months_to_goals([], monthly_rate=100) is None


def test_average_months_to_goals_averages_open_goals():
    goals = [_goal(current=0, target=1000), _goal(current=0, target=2000)]
    # monthly_rate=500 -> 2 months and 4 months -> average 3.0
    assert _average_months_to_goals(goals, monthly_rate=500) == 3.0


def test_average_months_to_goals_completed_goal_counts_as_zero():
    goals = [_goal(current=1000, target=1000), _goal(current=0, target=1000)]
    # first goal already met -> 0 months remaining, second needs 2 months at rate 500
    assert _average_months_to_goals(goals, monthly_rate=500) == 1.0


# ─── Finance scenario math ──────────────────────────────────────────────────────

def test_finance_scenario_deltas_uses_stretch_fallback_when_zero():
    deltas = _finance_scenario_deltas(additional_monthly_saving=0, expense_reduction_pct=0)
    names = [d[0] for d in deltas]
    assert names == ["Current Plan", "Target Plan", "Stretch Plan"]
    assert deltas[0] == ("Current Plan", 0.0, 0.0)
    assert deltas[1][2] == 10.0  # DEFAULT_FINANCE_EXPENSE_REDUCTION_STRETCH_PCT


def test_finance_scenario_deltas_scales_requested_delta():
    deltas = _finance_scenario_deltas(additional_monthly_saving=2000, expense_reduction_pct=0)
    assert deltas[1] == ("Target Plan", 2000.0, 0.0)
    assert deltas[2] == ("Stretch Plan", 3000.0, 0.0)


def test_finance_scenario_outcome_basic():
    monthly_saving, future_saving = _finance_scenario_outcome(
        baseline_income=40000, baseline_expense=25000, additional_saving=2000,
        expense_reduction_pct=0, months_ahead=6,
    )
    assert monthly_saving == 17000.0
    assert future_saving == 102000.0


def test_finance_scenario_outcome_with_expense_reduction():
    monthly_saving, _ = _finance_scenario_outcome(
        baseline_income=40000, baseline_expense=20000, additional_saving=0,
        expense_reduction_pct=10, months_ahead=1,
    )
    assert monthly_saving == 22000.0  # 40000 - (20000 * 0.9)


# ─── Study scenario math ─────────────────────────────────────────────────────────

def test_study_scenario_deltas_uses_stretch_fallback_when_zero():
    deltas = _study_scenario_deltas(additional_weekly_study_hours=0)
    assert deltas[1][1] == 3.0  # DEFAULT_STUDY_HOURS_STRETCH


def test_study_scenario_outcome_more_hours_increases_score():
    baseline_score, baseline_hours = 60.0, 5.0
    score_more, hours_more = _study_scenario_outcome(baseline_score, baseline_hours, delta_hours=5.0)
    score_less, hours_less = _study_scenario_outcome(baseline_score, baseline_hours, delta_hours=-2.0)
    assert score_more > baseline_score > score_less
    assert hours_more == 10.0
    assert hours_less == 3.0


def test_study_scenario_outcome_clamped_to_100():
    score, _ = _study_scenario_outcome(baseline_score=99.0, baseline_weekly_hours=14.0, delta_hours=100.0)
    assert score <= 100.0


# ─── Fitness scenario math ───────────────────────────────────────────────────────

def test_fitness_scenario_deltas_uses_stretch_fallback_when_zero():
    deltas = _fitness_scenario_deltas(additional_exercise_minutes=0, sleep_adjustment_hours=0)
    assert deltas[1][1] == 30.0  # DEFAULT_FITNESS_EXERCISE_STRETCH_MINUTES


def test_fitness_scenario_outcome_more_exercise_and_better_sleep_increases_score():
    baseline = dict(baseline_sleep=6.0, baseline_exercise=10.0, baseline_water=1.5, baseline_screen=8.0)
    score_baseline, _, _ = _fitness_scenario_outcome(**baseline, exercise_delta=0, sleep_delta=0)
    score_improved, new_exercise, new_sleep = _fitness_scenario_outcome(**baseline, exercise_delta=30, sleep_delta=1.5)
    assert score_improved > score_baseline
    assert new_exercise == 40.0
    assert new_sleep == 7.5


def test_fitness_scenario_outcome_score_never_negative():
    score, exercise, sleep = _fitness_scenario_outcome(
        baseline_sleep=8.0, baseline_exercise=0.0, baseline_water=2.0, baseline_screen=4.0,
        exercise_delta=-100.0, sleep_delta=-20.0,
    )
    assert score >= 0.0
    assert exercise == 0.0  # clamped at 0, deltas can't drive it negative
    assert sleep == 0.0
