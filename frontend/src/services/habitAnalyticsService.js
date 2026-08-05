/**
 * src/services/habitAnalyticsService.js
 * Habit Analytics service layer — wraps /api/v1/habit-analytics/* endpoints.
 * Distinct from habitService.js, which wraps /api/v1/habits/* (daily-log CRUD).
 * All requests are authenticated via the Axios interceptor in api.js.
 *
 * Deliberately kept 1:1 with every backend route for API-surface completeness.
 * getPositiveHabits, getNegativeHabits, getMissedHabits, and getHabitStreak aren't
 * currently called by any page (their data is surfaced via
 * getHabitAnalyticsSummary() instead) — kept as ready-to-use bindings.
 */
import api from "./api";

/**
 * Percentage of days with a logged habit check-in.
 * GET /api/v1/habit-analytics/consistency-score
 * @param {number} [windowDays=30]
 * @returns {Promise<ConsistencyScoreResponse>}
 */
export const getConsistencyScore = async (windowDays = 30) => {
  const response = await api.get("/habit-analytics/consistency-score", {
    params: { window_days: windowDays },
  });
  return response.data;
};

/**
 * Current and longest habit-logging streak.
 * GET /api/v1/habit-analytics/streak
 * @param {number} [lookbackDays=90]
 * @returns {Promise<HabitStreakResponse>}
 */
export const getHabitStreak = async (lookbackDays = 90) => {
  const response = await api.get("/habit-analytics/streak", {
    params: { lookback_days: lookbackDays },
  });
  return response.data;
};

/**
 * Habits consistently meeting healthy thresholds.
 * GET /api/v1/habit-analytics/positive
 * @param {number} [windowDays=30]
 * @returns {Promise<PositiveHabitsResponse>}
 */
export const getPositiveHabits = async (windowDays = 30) => {
  const response = await api.get("/habit-analytics/positive", {
    params: { window_days: windowDays },
  });
  return response.data;
};

/**
 * Habits consistently missing healthy thresholds.
 * GET /api/v1/habit-analytics/negative
 * @param {number} [windowDays=30]
 * @returns {Promise<NegativeHabitsResponse>}
 */
export const getNegativeHabits = async (windowDays = 30) => {
  const response = await api.get("/habit-analytics/negative", {
    params: { window_days: windowDays },
  });
  return response.data;
};

/**
 * Days in the window with no habit log at all.
 * GET /api/v1/habit-analytics/missed
 * @param {number} [windowDays=30]
 * @returns {Promise<MissedHabitsResponse>}
 */
export const getMissedHabits = async (windowDays = 30) => {
  const response = await api.get("/habit-analytics/missed", {
    params: { window_days: windowDays },
  });
  return response.data;
};

/**
 * Habit trend analyzed daily, weekly, and monthly.
 * GET /api/v1/habit-analytics/trend
 * @param {{ dailyDays?, weeksBack?, monthsBack? }} params
 * @returns {Promise<HabitTrendResponse>}
 */
export const getHabitTrend = async ({ dailyDays = 14, weeksBack = 8, monthsBack = 6 } = {}) => {
  const response = await api.get("/habit-analytics/trend", {
    params: { daily_days: dailyDays, weeks_back: weeksBack, months_back: monthsBack },
  });
  return response.data;
};

/**
 * Fetch the full habit analytics summary.
 * GET /api/v1/habit-analytics/summary
 * @returns {Promise<HabitAnalyticsSummaryResponse>}
 */
export const getHabitAnalyticsSummary = async () => {
  const response = await api.get("/habit-analytics/summary");
  return response.data;
};
