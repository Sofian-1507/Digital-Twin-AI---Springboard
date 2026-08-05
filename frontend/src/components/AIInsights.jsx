import InsightList from "./InsightList";

const DEFAULT_INSIGHTS = [
  "💰 Increase monthly savings by $200.",
  "📚 Study at least 2 additional hours weekly.",
  "🏃 Exercise for 45 minutes every day.",
  "😴 Maintain 8 hours of sleep consistently.",
  "📈 Expected improvement next month: +12%.",
];

function AIInsights({ insights }) {
  return (
    <InsightList
      title="🤖 AI Recommendations"
      items={insights}
      defaultItems={DEFAULT_INSIGHTS}
      cardClassName="insight-card"
      itemClassName="insight-item"
    />
  );
}

export default AIInsights;
