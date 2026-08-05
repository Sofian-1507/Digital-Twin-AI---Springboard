const DEFAULT_INSIGHTS = [
  "📘 Spend 1 extra hour on DSA this week.",
  "☕ Take a 10-minute break after every 90 minutes of study.",
  "📚 React progress is excellent. Continue practicing projects.",
  "🚀 Estimated productivity next week: 91%",
];

function RecommendationCard({ insights }) {
  const items = insights && insights.length > 0 ? insights : DEFAULT_INSIGHTS;

  return (
    <div className="recommendation-card">

      <h3>AI Study Recommendation</h3>

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

export default RecommendationCard;