function SimulationResult({ result }) {

  if (!result) {
    return null;
  }

  return (
    <div className="simulation-result">

      <h3>Simulation Result</h3>

      <div className="simulation-result-grid">

        <div className="simulation-box">

          <h4>Current Plan</h4>

          <p>
            Monthly Saving
          </p>

          <strong>
            ₹{result.baseline.monthly_saving}
          </strong>

          <p>
            {result.months} Month Saving
          </p>

          <strong>
            ₹{result.baseline.future_saving}
          </strong>

        </div>


        <div className="simulation-box">

          <h4>Simulated Plan</h4>

          <p>
            Monthly Saving
          </p>

          <strong>
            ₹{result.simulated.monthly_saving}
          </strong>

          <p>
            {result.months} Month Saving
          </p>

          <strong>
            ₹{result.simulated.future_saving}
          </strong>

        </div>


        <div className="simulation-box improvement">

          <h4>Improvement</h4>

          <strong>
            +₹{result.improvement}
          </strong>

          <p>
            +{result.improvement_percentage}%
          </p>

        </div>

      </div>

    </div>
  );
}

export default SimulationResult;