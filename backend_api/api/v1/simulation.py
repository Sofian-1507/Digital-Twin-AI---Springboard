from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend_api.services.simulation_service import (
    run_finance_scenarios
)


router = APIRouter(
    prefix="/simulation",
    tags=["Simulation"]
)


class FinanceScenarioRequest(BaseModel):

    monthly_income: float = Field(
        gt=0
    )

    monthly_expense: float = Field(
        ge=0
    )

    months: int = Field(
        gt=0,
        le=120
    )


@router.post("/scenarios")
def run_scenarios(
    data: FinanceScenarioRequest
):

    if data.monthly_expense > data.monthly_income:

        raise HTTPException(
            status_code=400,
            detail="Expenses cannot be greater than income."
        )

    result = run_finance_scenarios(
        monthly_income=data.monthly_income,
        monthly_expense=data.monthly_expense,
        months=data.months,
    )

    return result