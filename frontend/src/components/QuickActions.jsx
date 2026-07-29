function QuickActions({ sendMessage }) {
  const actions = [
    {
      icon: "📊",
      label: "Analyze My Progress",
      prompt: "Analyze my overall progress",
    },
    {
      icon: "📚",
      label: "Study Plan",
      prompt: "Generate a study plan",
    },
    {
      icon: "💰",
      label: "Finance Tips",
      prompt: "Give me finance tips",
    },
    {
      icon: "💪",
      label: "Health Advice",
      prompt: "Give me health advice",
    },
    {
      icon: "📈",
      label: "Predict Future",
      prompt: "Predict my future performance",
    },
    {
      icon: "🎯",
      label: "Improve Productivity",
      prompt: "How can I improve productivity?",
    },
  ];

  return (
    <div className="quick-actions">

      {actions.map((item) => (

        <button
          key={item.label}
          className="action-btn"
          onClick={() =>
            sendMessage(item.prompt)
          }
        >
          <span>{item.icon}</span>

          {item.label}
        </button>

      ))}

    </div>
  );
}

export default QuickActions;