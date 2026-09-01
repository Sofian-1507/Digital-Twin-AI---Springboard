/**
 * src/services/api.js
 * Axios singleton pre-configured for the FastAPI backend.
 *
 * - Base URL read from VITE_API_URL (falls back to localhost:8000)
 * - withCredentials: true — auth is an httpOnly cookie the backend sets on
 *   login/register/change-password, not a token this code reads or attaches;
 *   the browser sends it automatically on every request to the API origin.
 * - Response interceptor: redirects to /login on 401
 */
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

/** Only retry idempotent GETs that failed due to a transient network/server issue —
 * never retry POST/PATCH/DELETE, which could double-submit a mutation. */
function isRetryable(error) {
  const method = error.config?.method?.toLowerCase();
  if (method !== "get") return false;
  const isNetworkError = !error.response;
  const isServerError = error.response?.status >= 500;
  return isNetworkError || isServerError;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Response interceptor ─────────────────────────────────────────────────────
// On 401 Unauthorized, redirect to login (the httpOnly cookie, if any, is either
// missing or stale — nothing for this code to clear client-side).
// On a transient network/5xx failure for a GET, retry a couple of times before failing.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login only if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (isRetryable(error)) {
      const config = error.config;
      config.__retryCount = (config.__retryCount || 0) + 1;
      if (config.__retryCount <= MAX_RETRIES) {
        await delay(RETRY_DELAY_MS * config.__retryCount);
        return api(config);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
