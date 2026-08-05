/**
 * src/services/forecastService.js
 * Financial Forecasting service layer — wraps /api/v1/forecast/* endpoints.
 * All requests are authenticated via the Axios interceptor in api.js.
 *
 * Deliberately kept 1:1 with every backend route for API-surface completeness,
 * matching the convention of every other service file. getSavingsForecast,
 * getIncomeProjection, getGoalForecasts, and getForecastSummary aren't currently
 * called by any page (their data is surfaced via getTrendSummary()/Prediction.jsx
 * instead) — kept as ready-to-use bindings rather than removed.
 */
import api from "./api";

/**
 * Forecast monthly savings.
 * GET /api/v1/forecast/savings
 * @param {number} [monthsAhead=1]
 * @returns {Promise<SavingsForecastResponse>}
 */
export const getSavingsForecast = async (monthsAhead = 1) => {
  const response = await api.get("/forecast/savings", {
    params: { months_ahead: monthsAhead },
  });
  return response.data;
};

/**
 * Project future income.
 * GET /api/v1/forecast/income
 * @param {number} [monthsAhead=1]
 * @returns {Promise<IncomeProjectionResponse>}
 */
export const getIncomeProjection = async (monthsAhead = 1) => {
  const response = await api.get("/forecast/income", {
    params: { months_ahead: monthsAhead },
  });
  return response.data;
};

/**
 * Project future expenses.
 * GET /api/v1/forecast/expenses
 * @param {number} [monthsAhead=1]
 * @returns {Promise<ExpenseProjectionResponse>}
 */
export const getExpenseProjection = async (monthsAhead = 1) => {
  const response = await api.get("/forecast/expenses", {
    params: { months_ahead: monthsAhead },
  });
  return response.data;
};

/**
 * Estimate completion for all finance-category goals.
 * GET /api/v1/forecast/goals
 * @returns {Promise<GoalCompletionResponse[]>}
 */
export const getGoalForecasts = async () => {
  const response = await api.get("/forecast/goals");
  return response.data;
};

/**
 * Fetch the full financial forecast summary (savings + income + expenses + goals).
 * GET /api/v1/forecast/summary
 * @returns {Promise<ForecastSummaryResponse>}
 */
export const getForecastSummary = async () => {
  const response = await api.get("/forecast/summary");
  return response.data;
};
