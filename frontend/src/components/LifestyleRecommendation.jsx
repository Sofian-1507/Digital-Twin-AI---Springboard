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
      cardClassName="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      listClassName="flex flex-col gap-2.5"
      itemClassName="rounded-lg border-l-4 border-violet-500 bg-slate-50 p-3.5 text-sm text-slate-700 dark:bg-slate-700/40 dark:text-slate-300"
    />
  );
}

export default LifestyleRecommendation;
