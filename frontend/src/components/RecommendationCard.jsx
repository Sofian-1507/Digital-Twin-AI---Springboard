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
      cardClassName="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      listClassName="flex flex-col gap-2.5"
      itemClassName="rounded-lg border-l-4 border-violet-500 bg-slate-50 p-3.5 text-sm text-slate-700 dark:bg-slate-700/40 dark:text-slate-300"
    />
  );
}

export default RecommendationCard;
