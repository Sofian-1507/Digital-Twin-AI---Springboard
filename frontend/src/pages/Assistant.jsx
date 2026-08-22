import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import ChatBox from "../components/ChatBox";
import ChatInput from "../components/ChatInput";
import QuickActions from "../components/QuickActions";
import SuggestionCard from "../components/SuggestionCard";
import { StatTile } from "../components/ui/StatTile";
import { sendChatMessage, getSatisfactionSummary } from "../services/assistantService";
import { getApiErrorMessage } from "../utils/apiError";

function Assistant() {

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi — ask me anything about your finances, study progress, or habits and I'll answer using your real Digital Twin data.",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [satisfaction, setSatisfaction] = useState(null);

  useEffect(() => {
    getSatisfactionSummary().then(setSatisfaction).catch(() => {
      // Non-critical — the chat still works without this stat, so fail silently.
    });
  }, []);

  const sendMessage = async (text) => {

    if (!text.trim() || isThinking) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsThinking(true);

    try {
      const { reply } = await sendChatMessage(text);
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "The assistant couldn't respond. Please try again."));
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div>

      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Digital Twin AI Assistant</h2>

      <p className="mb-6 mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Grounded in your real profile, goals, and Digital Twin state — not canned replies.
      </p>

      <div className="flex flex-col gap-6">
        {satisfaction && satisfaction.total_responses > 0 && (
          <StatTile
            label="Satisfaction"
            value={`${Math.round(satisfaction.overall_satisfaction_pct)}%`}
            accent={satisfaction.overall_satisfaction_pct >= 85 ? "emerald" : "amber"}
            sublabel={`${satisfaction.total_responses} response${satisfaction.total_responses === 1 ? "" : "s"} — chat + recommendation feedback`}
          />
        )}

        <QuickActions sendMessage={sendMessage} />

        <SuggestionCard sendMessage={sendMessage} />

        <ChatBox messages={messages} isThinking={isThinking} />

        <ChatInput sendMessage={sendMessage} disabled={isThinking} />
      </div>

    </div>
  );
}

export default Assistant;
