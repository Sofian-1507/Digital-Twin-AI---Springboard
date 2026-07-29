import { useState } from "react";

function ChatInput({ sendMessage }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    sendMessage(text);

    setText("");
  };

  return (
    <form
      className="chat-input-container"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Ask your AI Assistant..."
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
      />

      <button type="submit">
        Send
      </button>
    </form>
  );
}

export default ChatInput;