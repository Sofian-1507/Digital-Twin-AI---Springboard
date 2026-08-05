import { useState } from "react";

import ChatBox from "../components/ChatBox";
import ChatInput from "../components/ChatInput";
import QuickActions from "../components/QuickActions";
import SuggestionCard from "../components/SuggestionCard";

function Assistant() {

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "Hello 👋 I'm a preview of the Digital Twin AI Assistant. I can only reply with a few canned tips for now — real AI-powered answers aren't connected yet.",
    },
  ]);

  const sendMessage = (text) => {

    if (!text.trim()) return;

    const userMessage = {
      sender: "user",
      text,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setTimeout(() => {

      let reply =
        "I'm analyzing your Digital Twin profile.";

      const msg = text.toLowerCase();

      if (msg.includes("study")) {
        reply =
          "📚 You should study 3-4 hours daily and practice DSA consistently.";
      }
      else if (msg.includes("finance")) {
        reply =
          "💰 Save at least 20% of your monthly income and reduce unnecessary expenses.";
      }
      else if (
        msg.includes("health") ||
        msg.includes("sleep")
      ) {
        reply =
          "💪 Drink 3L of water, sleep 8 hours, and exercise 45 minutes daily.";
      }
      else if (
        msg.includes("predict")
      ) {
        reply =
          "📈 Based on your current performance, your predicted overall score is 92%.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
        },
      ]);

    }, 1000);

  };

  return (
    <div>

      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">🤖 Digital Twin AI Assistant (Preview)</h2>

      <p className="mb-6 mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        This is an early preview — replies are canned examples, not real AI analysis of your data yet.
      </p>

      <div className="flex flex-col gap-6">
        <QuickActions sendMessage={sendMessage} />

        <SuggestionCard sendMessage={sendMessage} />

        <ChatBox messages={messages} />

        <ChatInput sendMessage={sendMessage} />
      </div>

    </div>
  );
}

export default Assistant;
