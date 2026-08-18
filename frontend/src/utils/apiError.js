/**
 * src/utils/apiError.js
 * Extracts a human-readable message from an Axios error, covering both error
 * shapes this backend can return:
 *   - custom domain exceptions (NotFoundError/ConflictError/BusinessRuleError/...):
 *     { error: "...", message: "..." }
 *   - FastAPI's built-in request validation errors (e.g. a Pydantic model_validator
 *     failure, which never reaches the custom exception handlers):
 *     { detail: "..." } or { detail: [{ loc, msg, type }, ...] }
 */
export function getApiErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const data = err?.response?.data;
  if (!data) return err?.message || fallback;

  if (typeof data.message === "string" && data.message) return data.message;
  if (typeof data.detail === "string" && data.detail) return data.detail;
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    const messages = data.detail.map((d) => d?.msg).filter(Boolean);
    if (messages.length > 0) return messages.join(" ");
  }

  return err?.message || fallback;
}
