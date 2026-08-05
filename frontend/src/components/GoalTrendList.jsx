import Badge from "./ui/Badge";

const STATUS_TONE = { "on-track": "success", "off-track": "danger", unknown: "neutral" };
const STATUS_LABEL = { "on-track": "On track", "off-track": "Off track", unknown: "Unknown" };
const STATUS_BORDER = { "on-track": "border-t-emerald-500", "off-track": "border-t-red-500", unknown: "border-t-slate-300" };

/**
 * GoalTrendList — renders TrendPredictionSummary.goals (list[GoalTrendPrediction]),
 * which is fetched by Prediction.jsx via getTrendSummary() but wasn't previously
 * displayed anywhere.
 */
function GoalTrendList({ goals }) {
  if (!goals || goals.length === 0) return null;

  return (
    <div className="contents">
      <h3 className="mb-5 text-lg font-semibold text-slate-800 dark:text-slate-100">Goal Completion Predictions</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((g) => {
          const status = g.on_track == null ? "unknown" : g.on_track ? "on-track" : "off-track";
          return (
            <div key={g.goal_id} className={`rounded-2xl border-t-4 bg-white p-5 shadow-sm dark:bg-slate-800 ${STATUS_BORDER[status]}`}>
              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">{g.title}</h4>
              <p className="mb-2 mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">{g.category}</p>
              <p className="font-mono tabular-nums text-sm text-slate-600 dark:text-slate-400">
                {g.estimated_months_remaining != null
                  ? `~${g.estimated_months_remaining} month${g.estimated_months_remaining === 1 ? "" : "s"} remaining`
                  : "Not enough data to estimate"}
              </p>
              {g.estimated_completion_date && (
                <p className="mt-1 font-mono tabular-nums text-xs text-slate-400">
                  Est. completion: {new Date(g.estimated_completion_date).toLocaleDateString()}
                </p>
              )}
              <Badge tone={STATUS_TONE[status]} className="mt-3">
                {STATUS_LABEL[status]}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GoalTrendList;
