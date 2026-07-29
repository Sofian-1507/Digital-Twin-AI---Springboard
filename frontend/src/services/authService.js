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
 * Clear the JWT from localStorage (client-side logout).
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
};