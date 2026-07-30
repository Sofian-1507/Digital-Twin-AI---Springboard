/**
 * src/services/activityService.js
 * Activity service layer — wraps /api/v1/activity/* endpoints.
 * All requests are authenticated via the Axios interceptor in api.js.
 */
import api from "./api";

/**
 * Fetch paginated user activity history.
 * GET /api/v1/activity
 * @param {{ skip?, limit? }} params
 * @returns {Promise<ActivityResponse[]>}
 */
export const getActivityHistory = async (params = {}) => {
  const response = await api.get("/activity", { params });
  return response.data;
};
