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
      cardClassName="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      itemClassName="rounded-lg border-l-4 border-violet-500 bg-slate-50 p-3.5 my-2.5 text-sm text-slate-700 dark:bg-slate-700/40 dark:text-slate-300"
    />
  );
}

export default AIInsights;
