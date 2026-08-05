function SavingsProgress({ transactions }) {

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

  const goal = 3000;

  // Bug fix: Math.min alone let a negative `savings` value (more spent than
  // earned) produce a negative percentage, which the browser renders as an
  // invalid CSS width — falling back to the fill div's default 100%, i.e. a
  // NEGATIVE savings rate visually showed as a COMPLETE progress bar.
  const percentage = Math.max(
    0,
    Math.min(Math.round((savings / goal) * 100), 100)
  );
  const isNegative = savings < 0;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">

      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Savings Goal</h3>

      <h2 className={`mt-2 font-mono text-2xl font-semibold tabular-nums ${isNegative ? "text-red-600" : "text-slate-800 dark:text-slate-100"}`}>
        ${savings.toLocaleString()} / ${goal.toLocaleString()}
      </h2>

      <div className="my-5 h-4 w-full overflow-hidden rounded-full bg-slate-200">

        <div
          className={`h-full rounded-full bg-linear-to-r ${isNegative ? "from-red-500 to-red-600" : "from-emerald-500 to-emerald-600"}`}
          style={{ width: `${percentage}%` }}
        ></div>

      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">{isNegative ? "Spending more than you earn" : `${percentage}% Completed`}</p>

    </div>
  );
}

export default SavingsProgress;
