const DEFAULT_INSIGHTS = [
  "💧 Increase your daily water intake by 0.5 L.",
  "😴 Maintain at least 8 hours of sleep every night.",
  "🏃 Exercise for 45–60 minutes to improve fitness.",
  "😊 Your wellness score is improving. Keep following your routine.",
];

function LifestyleRecommendation({ insights }) {
  const items = insights && insights.length > 0 ? insights : DEFAULT_INSIGHTS;

  return (
    <div className="recommendation-card">

      <h3>🤖 AI Lifestyle Recommendation</h3>

      <div className="recommendation-list">

        {items.map((text, i) => (
          <div className="recommendation-item" key={i}>
            {text}
          </div>
        ))}

      </div>

    </div>
  );
}

export default LifestyleRecommendation;