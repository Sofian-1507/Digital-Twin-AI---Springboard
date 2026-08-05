import ChatMessage from "./ChatMessage";

function ChatBox({ messages }) {
  return (
    <div className="flex max-h-100 flex-col gap-4 overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
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
