const DEFAULT_INSIGHTS = [
  "💰 Increase monthly savings by $200.",
  "📚 Study at least 2 additional hours weekly.",
  "🏃 Exercise for 45 minutes every day.",
  "😴 Maintain 8 hours of sleep consistently.",
  "📈 Expected improvement next month: +12%.",
];

function AIInsights({ insights }) {
  const items = insights && insights.length > 0 ? insights : DEFAULT_INSIGHTS;

  return (
    <div className="insight-card">

      <h3>🤖 AI Recommendations</h3>

      {items.map((text, i) => (
        <div className="insight-item" key={i}>
          {text}
        </div>
      ))}

    </div>
  );
}

export default AIInsights;