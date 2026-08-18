/**
 * src/services/simulationService.js
 * Decision Simulation & Recommendation Engine service layer — wraps /api/v1/simulation/* endpoints.
 * All requests are authenticated via the Axios interceptor in api.js.
 */
import api from "./api";

/**
 * Simulate finance (spending/saving) what-if scenarios against the user's real income/expense trend.
 * POST /api/v1/simulation/finance/scenarios
 * @param {{additional_monthly_saving?: number, expense_reduction_pct?: number, months_ahead?: number}} params
 * @returns {Promise<SimulationResponse>}
 */
export const runFinanceScenarios = async (params = {}) => {
  const response = await api.post("/simulation/finance/scenarios", params);
  return response.data;
};

/**
 * Simulate study what-if scenarios against the user's real productivity trend.
 * POST /api/v1/simulation/study/scenarios
 * @param {{additional_weekly_study_hours?: number, weeks_ahead?: number}} params
 * @returns {Promise<SimulationResponse>}
 */
export const runStudyScenarios = async (params = {}) => {
  const response = await api.post("/simulation/study/scenarios", params);
  return response.data;
};

/**
 * Simulate fitness what-if scenarios against the user's real habit trend.
 * POST /api/v1/simulation/fitness/scenarios
 * @param {{additional_exercise_minutes?: number, sleep_adjustment_hours?: number, weeks_ahead?: number}} params
 * @returns {Promise<SimulationResponse>}
 */
export const runFitnessScenarios = async (params = {}) => {
  const response = await api.post("/simulation/fitness/scenarios", params);
  return response.data;
};

/**
 * Simulate combined lifestyle what-if scenarios spanning finance/study/fitness.
 * POST /api/v1/simulation/hybrid/scenarios
 * @param {{additional_monthly_saving?: number, additional_weekly_study_hours?: number, additional_exercise_minutes?: number, sleep_adjustment_hours?: number, months_ahead?: number}} params
 * @returns {Promise<SimulationResponse>}
 */
export const runHybridScenarios = async (params = {}) => {
  const response = await api.post("/simulation/hybrid/scenarios", params);
  return response.data;
};

/**
 * Bundled default-delta comparison across finance, study, and fitness with one overall recommendation.
 * GET /api/v1/simulation/compare
 * @returns {Promise<DomainComparisonResponse>}
 */
export const getDomainComparison = async () => {
  const response = await api.get("/simulation/compare");
  return response.data;
};

/**
 * List past simulations for the current user.
 * GET /api/v1/simulation/history
 * @param {{domain?: string, limit?: number}} [params]
 * @returns {Promise<SimulationHistoryItem[]>}
 */
export const getSimulationHistory = async (params = {}) => {
  const response = await api.get("/simulation/history", { params });
  return response.data;
};

/**
 * Get one persisted simulation's full input parameters and scenario results.
 * Note: unlike the scenario POST endpoints, this does not include a
 * `recommendation` — recommendations aren't persisted standalone.
 * GET /api/v1/simulation/{simulationId}
 * @param {string} simulationId
 * @returns {Promise<SimulationDetailResponse>}
 */
export const getSimulationById = async (simulationId) => {
  const response = await api.get(`/simulation/${simulationId}`);
  return response.data;
};

/**
 * Record user feedback (helpful/unhelpful/irrelevant) on a recommendation.
 * PATCH /api/v1/simulation/recommendations/{recommendationId}/feedback
 * @param {string} recommendationId
 * @param {"HELPFUL"|"UNHELPFUL"|"IRRELEVANT"} feedback
 * @returns {Promise<{id: string, user_feedback: string}>}
 */
export const submitRecommendationFeedback = async (recommendationId, feedback) => {
  const response = await api.patch(`/simulation/recommendations/${recommendationId}/feedback`, { feedback });
  return response.data;
};
