import { useState } from "react";
import { toast } from "react-toastify";
import { Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { submitChatFeedback } from "../services/assistantService";
import { getApiErrorMessage } from "../utils/apiError";

/** Thumbs-up/down under each AI reply — persisted via POST /assistant/chat/feedback
 * and aggregated into the app-wide satisfaction score (see Assistant.jsx's stat
 * tile). Same visual pattern as SimulationRecommendationCard's feedback. */
function MessageFeedback({ messageIndex, feedback, onFeedback }) {
  if (feedback) {
    return (
      <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
        Thanks for your feedback ({feedback === "up" ? "helpful" : "not helpful"}).
      </p>
    );
  }
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <button
        type="button"
        aria-label="Helpful"
        onClick={() => onFeedback(messageIndex, "up")}
        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-700/40 dark:hover:text-emerald-400"
      >
        <ThumbsUp size={13} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        aria-label="Not helpful"
        onClick={() => onFeedback(messageIndex, "down")}
        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-700/40 dark:hover:text-red-400"
      >
        <ThumbsDown size={13} strokeWidth={1.8} />
      </button>
    </div>
  );
}

function ChatBox({ messages, isThinking = false }) {
  const [feedbackByIndex, setFeedbackByIndex] = useState({});

  // Optimistic UI stays instant; the persist call is fire-and-forget (only a
  // toast on failure) — same pattern SimulationRecommendationCard already uses.
  function handleFeedback(index, value) {
    setFeedbackByIndex((prev) => ({ ...prev, [index]: value }));
    const messageText = messages[index]?.text ?? "";
    submitChatFeedback(messageText, value === "up" ? "HELPFUL" : "UNHELPFUL").catch((err) => {
      toast.error(getApiErrorMessage(err, "Couldn't save your feedback."));
    });
  }

  return (
    <div className="flex max-h-100 flex-col gap-4 overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
          {message.sender === "ai" && index !== 0 && (
            <MessageFeedback
              messageIndex={index}
              feedback={feedbackByIndex[index]}
              onFeedback={handleFeedback}
            />
          )}
        </div>
      ))}

      {isThinking && (
        <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
          <Loader2 size={15} strokeWidth={2} className="animate-spin" />
          Thinking...
        </div>
      )}
    </div>
  );
}

export default ChatBox;
