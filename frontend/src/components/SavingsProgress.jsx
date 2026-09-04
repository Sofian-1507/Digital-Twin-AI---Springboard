import { PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "../utils/currency";
import { CHART_COLORS } from "../utils/chartColors";

/**
 * Bug fix: this used to compute "savings" as (all income − all expenses)
 * across every transaction on the account, and show that same account-wide
 * number on every goal's card — so two goals with a $1,000 target each would
 * both claim the same $800 of total savings as 80% complete, with no way to
 * tell how much was actually set aside for either one specifically.
 *
 * The backend already tracks this correctly per goal: `goal.current_value`
 * is incremented only by SAVINGS_DEPOSIT/INVESTMENT transactions actually
 * linked to that goal's id (see finance_service.py's `_goal_contribution` /
 * `GOAL_PROGRESS_TYPES`), reconciled on every create/update/delete. Use that
 * instead of re-deriving a number from the raw transaction list.
 */
function SavingsProgress({ goal: activeGoal, currency = "USD" }) {

  if (!activeGoal) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Savings Goal</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          You haven't set a finance goal yet — add one from the Goals page to track progress here.
        </p>
      </div>
    );
  }

  const goal = Number(activeGoal.target_value);
  const savings = Number(activeGoal.current_value);

  const percentage = Math.max(0, Math.min(Math.round((savings / goal) * 100), 100));

  const donutData = [
    { name: "completed", value: percentage },
    { name: "remaining", value: 100 - percentage },
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">

      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{activeGoal.title}</h3>

      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <PieChart width={112} height={112}>
            <Pie
              data={donutData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={52}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill={CHART_COLORS.positive} />
              <Cell fill={CHART_COLORS.grid} />
            </Pie>
          </PieChart>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-lg font-semibold tabular-nums text-slate-800 dark:text-slate-100">
              {percentage}%
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="font-mono text-xl font-semibold tabular-nums text-slate-800 dark:text-slate-100">
            {formatCurrency(savings, currency)}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">of {formatCurrency(goal, currency)} goal</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{percentage}% Completed</p>
        </div>
      </div>

    </div>
  );
}

export default SavingsProgress;
