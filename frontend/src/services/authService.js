/**
 * src/services/authService.js
 * Authentication service layer — wraps /api/v1/auth/* endpoints.
 *
 * The FastAPI backend uses plain JSON for both /auth/register and /auth/login
 * (LoginRequest and RegisterRequest are Pydantic BaseModels, not OAuth2PasswordRequestForm).
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
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
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
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
};

/**
 * Logs out on the server (invalidates this token, and every other outstanding
 * token for this account — there's no per-device session concept), then always
 * clears the local token regardless of whether the server call succeeds, so the
 * user is never stuck "logged in" locally just because of a network error.
 * POST /api/v1/auth/logout
 */
export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // Best-effort — still clear the local session below even if this failed
    // (e.g. offline, or the token was already invalid).
  } finally {
    localStorage.removeItem("token");
  }
};

/**
 * Changes the current user's password. Invalidates every other outstanding
 * session; the returned fresh token keeps this session working.
 * POST /api/v1/users/me/change-password
 * @param {{ current_password: string, new_password: string }} payload
 * @returns {Promise<{ access_token, token_type, user_id, email }>}
 */
export const changePassword = async (payload) => {
  const response = await api.post("/users/me/change-password", payload);
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
};