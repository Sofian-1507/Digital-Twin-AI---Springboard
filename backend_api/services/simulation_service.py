def calculate_finance_scenario(
    monthly_income: float,
    monthly_expense: float,
    additional_saving: float,
    months: int,
):
    current_saving = monthly_income - monthly_expense

    simulated_saving = (
        current_saving + additional_saving
    )

    return {
        "monthly_saving": round(
            simulated_saving, 2
        ),
        "future_saving": round(
            simulated_saving * months, 2
        ),
    }


def run_finance_scenarios(
    monthly_income: float,
    monthly_expense: float,
    months: int,
):
    current_saving = (
        monthly_income - monthly_expense
    )

    # Scenario 1
    current = {
        "name": "Current Plan",
        "additional_saving": 0,
        "monthly_saving": round(
            current_saving, 2
        ),
        "future_saving": round(
            current_saving * months, 2
        ),
    }

    # Scenario 2
    save_2000 = calculate_finance_scenario(
        monthly_income,
        monthly_expense,
        2000,
        months,
    )

    scenario_2 = {
        "name": "Save +₹2,000",
        "additional_saving": 2000,
        **save_2000,
    }

    # Scenario 3
    save_5000 = calculate_finance_scenario(
        monthly_income,
        monthly_expense,
        5000,
        months,
    )

    scenario_3 = {
        "name": "Save +₹5,000",
        "additional_saving": 5000,
        **save_5000,
    }

    scenarios = [
    current,
    scenario_2,
    scenario_3
]

    recommendation = generate_finance_recommendation(
    scenarios   
    )

    return {
    "simulation_type": "finance",
    "months": months,
    "scenarios": scenarios,
    "recommendation": recommendation
    }
def generate_finance_recommendation(scenarios):
    if not scenarios:
        return {
            "recommendation": "No scenarios available.",
            "reason": "",
            "recommended_scenario": None
        }

    # Find scenario with highest future saving
    best_scenario = max(
        scenarios,
        key=lambda x: x["future_saving"]
    )

    current_scenario = scenarios[0]

    improvement = (
        best_scenario["future_saving"]
        - current_scenario["future_saving"]
    )

    if best_scenario["additional_saving"] == 0:

        recommendation = (
            "Continue with your current financial plan."
        )

        reason = (
            "Your current plan provides the best "
            "available outcome among the scenarios."
        )

    else:

        recommendation = (
            f"Recommended: {best_scenario['name']}"
        )

        reason = (
            f"This scenario can increase your future "
            f"savings by ₹{improvement:,.0f} compared "
            f"with your current plan."
        )

    return {
        "recommendation": recommendation,
        "reason": reason,
        "recommended_scenario": best_scenario["name"],
        "expected_future_saving": best_scenario[
            "future_saving"
        ],
        "expected_improvement": round(
            improvement, 2
        )
    }