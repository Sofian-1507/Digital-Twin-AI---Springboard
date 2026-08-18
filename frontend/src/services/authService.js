/**
 * src/services/authService.js
 * Authentication service layer — wraps /api/v1/auth/* endpoints.
 *
 * The FastAPI backend uses plain JSON for both /auth/register and /auth/login
 * (LoginRequest and RegisterRequest are Pydantic BaseModels, not OAuth2PasswordRequestForm).
 *
 * Auth is an httpOnly cookie the backend sets directly on the response (see
 * api.js's withCredentials: true) — this code never reads or stores a token itself.
 * The response body still includes access_token for API/schema stability, but
 * it's intentionally unused here.
 */
import api from "./api";

/**
 * Register a new user account.
 * POST /api/v1/auth/register
 * @param {{ email, password, name, age, monthly_income_baseline }} payload
 * @returns {Promise<{ access_token, token_type, user_id, email }>}
 */
export const registerUser = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

/**
 * Authenticate an existing user.
 * POST /api/v1/auth/login
 * @param {{ email, password }} credentials
 * @returns {Promise<{ access_token, token_type, user_id, email }>}
 */
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });
  return response.data;
};

/**
 * Logs out on the server: invalidates this session's token_version (and every
 * other outstanding session for this account — there's no per-device session
 * concept) and clears the httpOnly cookie. Best-effort — if the request fails
 * (e.g. offline, or the cookie was already invalid), there's nothing to clean
 * up client-side since there's no local token to remove.
 * POST /api/v1/auth/logout
 */
export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // Best-effort — the cookie (if any) will simply fail auth on the next request.
  }
};

/**
 * Changes the current user's password. Invalidates every other outstanding
 * session; the backend re-sets the auth cookie so this session keeps working.
 * POST /api/v1/users/me/change-password
 * @param {{ current_password: string, new_password: string }} payload
 * @returns {Promise<{ access_token, token_type, user_id, email }>}
 */
export const changePassword = async (payload) => {
  const response = await api.post("/users/me/change-password", payload);
  return response.data;
};
