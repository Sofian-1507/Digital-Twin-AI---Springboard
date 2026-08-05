function ChatMessage({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-base">
        {isUser ? "👤" : "🤖"}
      </div>

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
          isUser
            ? "rounded-br-sm bg-indigo-600 text-white"
            : "rounded-bl-sm bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
        }`}
      >
        <p>{message.text}</p>
      </div>
    </div>
  );
}

export default ChatMessage;
