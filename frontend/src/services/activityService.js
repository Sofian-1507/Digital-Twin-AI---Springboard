/**
 * src/services/activityService.js
 * Activity service layer — wraps /api/v1/activity/* endpoints.
 * All requests are authenticated via the Axios interceptor in api.js.
 */
import api from "./api";

/**
 * Fetch paginated user activity history.
 * GET /api/v1/activity
 * @param {{ page?: number, limit?: number }} params
 * @returns {Promise<{data: object[], total: number, page: number, limit: number, total_pages: number}>}
 */
export const getActivityHistory = async (params = {}) => {
  const response = await api.get("/activity", { params });
  return response.data;
};
