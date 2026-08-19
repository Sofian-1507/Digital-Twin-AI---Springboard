import { PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "../utils/currency";
import { CHART_COLORS } from "../utils/chartColors";

function SavingsProgress({ transactions, goal: activeGoal, currency = "USD" }) {

  // Bug fix: comparing against "Income"/"Expense" never matched the backend's
  // actual uppercase enum values ("INCOME"/"EXPENSE"), so this always computed
  // $0 savings regardless of real data.
  const income = transactions
    .filter((item) => String(item.type).toUpperCase() === "INCOME")
    .reduce(
      (total, item) =>
        total + Number(item.amount),
      0
    );

  const expense = transactions
    .filter((item) => String(item.type).toUpperCase() === "EXPENSE")
    .reduce(
      (total, item) =>
        total + Number(item.amount),
      0
    );

  const savings = income - expense;

  if (!activeGoal) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Savings Goal</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          You haven't set a finance goal yet — add one from your Profile to track progress here.
        </p>
      </div>
    );
  }

  const goal = Number(activeGoal.target_value);

  // Bug fix (kept from the bar version): Math.min alone let a negative
  // `savings` value (more spent than earned) produce a negative percentage,
  // which the donut can't render either — clamp to 0 first.
  const percentage = Math.max(
    0,
    Math.min(Math.round((savings / goal) * 100), 100)
  );
  const isNegative = savings < 0;
  const fillColor = isNegative ? CHART_COLORS.danger : CHART_COLORS.positive;

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
              <Cell fill={fillColor} />
              <Cell fill={CHART_COLORS.grid} />
            </Pie>
          </PieChart>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className={`font-mono text-lg font-semibold tabular-nums ${isNegative ? "text-red-600" : "text-slate-800 dark:text-slate-100"}`}>
              {percentage}%
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <p className={`font-mono text-xl font-semibold tabular-nums ${isNegative ? "text-red-600" : "text-slate-800 dark:text-slate-100"}`}>
            {formatCurrency(savings, currency)}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">of {formatCurrency(goal, currency)} goal</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isNegative ? "Spending more than you earn" : `${percentage}% Completed`}
          </p>
        </div>
      </div>

    </div>
  );
}

export default SavingsProgress;
