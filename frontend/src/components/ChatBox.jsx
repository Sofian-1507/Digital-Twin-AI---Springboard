import ChatMessage from "./ChatMessage";

function ChatBox({ messages }) {
  return (
    <div className="chat-box">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
        />
      ))}
    </div>
  );
}

export default ChatBox;