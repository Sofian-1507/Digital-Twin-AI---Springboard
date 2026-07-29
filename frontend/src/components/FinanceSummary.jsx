function FinanceSummary() {

  return (

    <div className="finance-summary">

      <div className="finance-card income">
        <h4>Total Income</h4>
        <h2>$2,500</h2>
      </div>

      <div className="finance-card expense">
        <h4>Total Expense</h4>
        <h2>$595</h2>
      </div>

      <div className="finance-card savings">
        <h4>Total Savings</h4>
        <h2>$1,905</h2>
      </div>

      <div className="finance-card budget">
        <h4>Budget Used</h4>
        <h2>24%</h2>
      </div>

    </div>

  );

}

export default FinanceSummary;