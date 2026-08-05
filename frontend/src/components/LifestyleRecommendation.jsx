import InsightList from "./InsightList";

const DEFAULT_INSIGHTS = [
  "💧 Increase your daily water intake by 0.5 L.",
  "😴 Maintain at least 8 hours of sleep every night.",
  "🏃 Exercise for 45–60 minutes to improve fitness.",
  "😊 Your wellness score is improving. Keep following your routine.",
];

function LifestyleRecommendation({ insights }) {
  return (
    <InsightList
      title="🤖 AI Lifestyle Recommendation"
      items={insights}
      defaultItems={DEFAULT_INSIGHTS}
      cardClassName="recommendation-card"
      listClassName="recommendation-list"
      itemClassName="recommendation-item"
    />
  );
}

export default LifestyleRecommendation;
