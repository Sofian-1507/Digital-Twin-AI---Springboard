/**
 * src/services/productivityService.js
 * Productivity Analytics service layer — wraps /api/v1/productivity/* endpoints.
 * All requests are authenticated via the Axios interceptor in api.js.
 */
import api from "./api";

/**
 * Composite productivity score over a lookback window.
 * GET /api/v1/productivity/score
 * @param {number} [lookbackDays=30]
 * @returns {Promise<ProductivityScoreResponse>}
 */
export const getProductivityScore = async (lookbackDays = 30) => {
  const response = await api.get("/productivity/score", {
    params: { lookback_days: lookbackDays },
  });
  return response.data;
};

/**
 * Average focus score over a lookback window.
 * GET /api/v1/productivity/focus-score
 * @param {number} [lookbackDays=30]
 * @returns {Promise<FocusScoreResponse>}
 */
export const getFocusScore = async (lookbackDays = 30) => {
  const response = await api.get("/productivity/focus-score", {
    params: { lookback_days: lookbackDays },
  });
  return response.data;
};

/**
 * Weekly study/productivity trend.
 * GET /api/v1/productivity/weekly-trend
 * @param {number} [weeksBack=8]
 * @returns {Promise<WeeklyTrendResponse>}
 */
export const getWeeklyProductivityTrend = async (weeksBack = 8) => {
  const response = await api.get("/productivity/weekly-trend", {
    params: { weeks_back: weeksBack },
  });
  return response.data;
};

/**
 * Monthly study/productivity trend.
 * GET /api/v1/productivity/monthly-trend
 * @param {number} [monthsBack=6]
 * @returns {Promise<MonthlyTrendResponse>}
 */
export const getMonthlyProductivityTrend = async (monthsBack = 6) => {
  const response = await api.get("/productivity/monthly-trend", {
    params: { months_back: monthsBack },
  });
  return response.data;
};

/**
 * Percentage of days with a logged study session.
 * GET /api/v1/productivity/completion-percentage
 * @param {number} [windowDays=30]
 * @returns {Promise<CompletionPercentageResponse>}
 */
export const getCompletionPercentage = async (windowDays = 30) => {
  const response = await api.get("/productivity/completion-percentage", {
    params: { window_days: windowDays },
  });
  return response.data;
};

/**
 * Forward-looking productivity and exam-score prediction.
 * GET /api/v1/productivity/prediction
 * @param {number} [weeksAhead=1]
 * @returns {Promise<PerformancePredictionResponse>}
 */
export const getPerformancePrediction = async (weeksAhead = 1) => {
  const response = await api.get("/productivity/prediction", {
    params: { weeks_ahead: weeksAhead },
  });
  return response.data;
};

/**
 * Fetch the full productivity analytics summary.
 * GET /api/v1/productivity/summary
 * @returns {Promise<ProductivitySummaryResponse>}
 */
export const getProductivitySummary = async () => {
  const response = await api.get("/productivity/summary");
  return response.data;
};
