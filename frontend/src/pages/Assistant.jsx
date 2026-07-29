import { useState } from "react";

import ChatBox from "../components/ChatBox";
import ChatInput from "../components/ChatInput";
import QuickActions from "../components/QuickActions";
import SuggestionCard from "../components/SuggestionCard";

import "../styles/Assistant.css";

function Assistant() {

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "Hello 👋 I'm your Digital Twin AI Assistant. Ask me anything about your finance, study, habits, or future predictions.",
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
    <div className="assistant-page">

      <h2>🤖 Digital Twin AI Assistant</h2>

      <QuickActions sendMessage={sendMessage} />

      <SuggestionCard sendMessage={sendMessage} />

      <ChatBox messages={messages} />

      <ChatInput sendMessage={sendMessage} />

    </div>
  );
}

export default Assistant;