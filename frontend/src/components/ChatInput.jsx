import { useState } from "react";
import { Input } from "./ui/Field";
import Button from "./ui/Button";

function ChatInput({ sendMessage }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    sendMessage(text);

    setText("");
  };

  return (
    <form className="flex gap-3" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Ask your AI Assistant..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1"
      />

      <Button type="submit">
        Send
      </Button>
    </form>
  );
}

export default ChatInput;
