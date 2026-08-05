/**
 * src/services/trendService.js
 * Trend Prediction service layer — wraps /api/v1/trends/* endpoints.
 * All requests are authenticated via the Axios interceptor in api.js.
 */
import api from "./api";

/**
 * Predict future savings trend.
 * GET /api/v1/trends/savings
 * @param {number} [monthsAhead=1]
 * @returns {Promise<SavingsTrendPrediction>}
 */
export const getSavingsTrend = async (monthsAhead = 1) => {
  const response = await api.get("/trends/savings", {
    params: { months_ahead: monthsAhead },
  });
  return response.data;
};

/**
 * Predict future study/productivity trend.
 * GET /api/v1/trends/study
 * @param {number} [weeksAhead=1]
 * @returns {Promise<StudyTrendPrediction>}
 */
export const getStudyTrend = async (weeksAhead = 1) => {
  const response = await api.get("/trends/study", {
    params: { weeks_ahead: weeksAhead },
  });
  return response.data;
};

/**
 * Predict future fitness/habit-score trend.
 * GET /api/v1/trends/fitness
 * @param {number} [weeksAhead=1]
 * @returns {Promise<FitnessTrendPrediction>}
 */
export const getFitnessTrend = async (weeksAhead = 1) => {
  const response = await api.get("/trends/fitness", {
    params: { weeks_ahead: weeksAhead },
  });
  return response.data;
};

/**
 * Predict goal completion trends (finance-category goals).
 * GET /api/v1/trends/goals
 * @returns {Promise<GoalTrendPrediction[]>}
 */
export const getGoalTrends = async () => {
  const response = await api.get("/trends/goals");
  return response.data;
};

/**
 * Fetch the full trend prediction summary (savings + study + fitness + goals).
 * GET /api/v1/trends/summary
 * @param {{ monthsAhead?, weeksAhead? }} params
 * @returns {Promise<TrendPredictionSummary>}
 */
export const getTrendSummary = async ({ monthsAhead = 1, weeksAhead = 1 } = {}) => {
  const response = await api.get("/trends/summary", {
    params: { months_ahead: monthsAhead, weeks_ahead: weeksAhead },
  });
  return response.data;
};
