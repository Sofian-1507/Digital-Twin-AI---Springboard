function ScenarioComparison({ scenarios }) {

  if (!scenarios || scenarios.length === 0) {
    return null;
  }

  return (
    <div className="scenario-comparison">

      <h3>
        Future Scenario Comparison
      </h3>

      <div className="scenario-grid">

        {scenarios.map(
          (scenario, index) => (

            <div
              className="scenario-card"
              key={index}
            >

              <h4>
                {scenario.name}
              </h4>

              <p>
                Monthly Saving
              </p>

              <strong>
                ₹{scenario.monthly_saving}
              </strong>

              <p>
                Future Saving
              </p>

              <strong>
                ₹{scenario.future_saving}
              </strong>

            </div>

          )
        )}

      </div>

    </div>
  );
}

export default ScenarioComparison;