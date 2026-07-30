/**
 * src/services/userService.js
 * User service layer — wraps /api/v1/users/* endpoints.
 * All requests are authenticated via the Axios interceptor in api.js.
 */
import api from "./api";

/**
 * Fetch the complete user context (profile + preferences + goals + digital_twin_state).
 * GET /api/v1/users/me
 * @returns {Promise<UserResponse>}
 */
export const getUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

/**
 * Partially update the user's profile.
 * PATCH /api/v1/users/me/profile
 * @param {{ name?, age?, gender?, occupation?, monthly_income_baseline?, risk_tolerance? }} payload
 * @returns {Promise<UserResponse>}
 */
export const updateProfile = async (payload) => {
  const response = await api.patch("/users/me/profile", payload);
  return response.data;
};

/**
 * Fetch the user's active goals list.
 * GET /api/v1/users/me/goals
 * @returns {Promise<ActiveGoalResponse[]>}
 */
export const getGoals = async () => {
  const response = await api.get("/users/me/goals");
  return response.data;
};

/**
 * Add a new active goal.
 * POST /api/v1/users/me/goals
 * @param {{ title, category, target_value, unit, target_date? }} payload
 * @returns {Promise<UserResponse>}
 */
export const addGoal = async (payload) => {
  const response = await api.post("/users/me/goals", payload);
  return response.data;
};

export const updateGoal = async (id, payload) => {
  const response = await api.patch(`/users/me/goals/${id}`, payload);
  return response.data;
};

export const deleteGoal = async (id) => {
  await api.delete(`/users/me/goals/${id}`);
  // DELETE returns 204 No Content — re-fetch the full UserResponse
  return await getUser();
};

export const deleteUser = async () => {
  const response = await api.delete("/users/me");
  return response.data;
};

/**
 * Alias for updateProfile — kept for backward compatibility with Profile.jsx.
 */
export const updateUser = updateProfile;