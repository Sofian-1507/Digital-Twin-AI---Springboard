function SavingsProgress({ transactions }) {

  const income = transactions
    .filter((item) => item.type === "Income")
    .reduce(
      (total, item) =>
        total + Number(item.amount),
      0
    );

  const expense = transactions
    .filter((item) => item.type === "Expense")
    .reduce(
      (total, item) =>
        total + Number(item.amount),
      0
    );

  const savings = income - expense;

  const goal = 3000;

  const percentage = Math.min(
    Math.round((savings / goal) * 100),
    100
  );

  return (
    <div className="savings-card">

      <h3>Savings Goal</h3>

      <h2>
        ${savings} / ${goal}
      </h2>

      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        ></div>

      </div>

      <p>{percentage}% Completed</p>

    </div>
  );
}

export default SavingsProgress;