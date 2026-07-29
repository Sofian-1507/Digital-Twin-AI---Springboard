function ChatMessage({ message }) {
  return (
    <div
      className={`message ${
        message.sender === "user"
          ? "user-message"
          : "ai-message"
      }`}
    >
      <div className="message-avatar">
        {message.sender === "user"
          ? "👤"
          : "🤖"}
      </div>

      <div className="message-content">
        <p>{message.text}</p>
      </div>
    </div>
  );
}

export default ChatMessage;