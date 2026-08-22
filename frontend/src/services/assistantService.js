/**
 * src/services/assistantService.js
 * AI assistant service layer — wraps /api/v1/assistant/*.
 */
import api from "./api";

/**
 * Sends a message to the AI assistant and gets a grounded reply back
 * (Gemini primary, Groq fallback — see backend_api/services/ai_assistant_service.py).
 * POST /api/v1/assistant/chat
 * @param {string} message
 * @returns {Promise<{ reply: string, provider_used: string }>}
 */
export const sendChatMessage = async (message) => {
  const response = await api.post("/assistant/chat", { message });
  return response.data;
};

/**
 * Records thumbs-up/down on a specific assistant reply.
 * POST /api/v1/assistant/chat/feedback
 * @param {string} messageSnippet - the reply text being rated (truncated server-side to 300 chars)
 * @param {"HELPFUL"|"UNHELPFUL"|"IRRELEVANT"} feedback
 */
export const submitChatFeedback = async (messageSnippet, feedback) => {
  const response = await api.post("/assistant/chat/feedback", { message_snippet: messageSnippet, feedback });
  return response.data;
};

/**
 * App-wide satisfaction score, combining AI Assistant chat feedback and simulation
 * recommendation feedback (Milestone 4's "user satisfaction" evaluation criterion).
 * GET /api/v1/assistant/satisfaction-summary
 */
export const getSatisfactionSummary = async () => {
  const response = await api.get("/assistant/satisfaction-summary");
  return response.data;
};
