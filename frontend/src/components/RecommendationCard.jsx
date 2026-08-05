import InsightList from "./InsightList";

const DEFAULT_INSIGHTS = [
  "📘 Spend 1 extra hour on DSA this week.",
  "☕ Take a 10-minute break after every 90 minutes of study.",
  "📚 React progress is excellent. Continue practicing projects.",
  "🚀 Estimated productivity next week: 91%",
];

function RecommendationCard({ insights }) {
  return (
    <InsightList
      title="AI Study Recommendation"
      items={insights}
      defaultItems={DEFAULT_INSIGHTS}
      cardClassName="recommendation-card"
      listClassName="recommendation-list"
      itemClassName="recommendation-item"
    />
  );
}

export default RecommendationCard;
