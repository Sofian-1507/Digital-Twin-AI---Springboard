function PredictionSummary({ history }) {

  const latest =
    history.length > 0
      ? history[history.length - 1]
      : {
          finance: 0,
          study: 0,
          health: 0,
          overall: 0,
        };

  return (
    <div className="prediction-summary">

      <div className="prediction-card overall">
        <h4>Overall AI Score</h4>
        <h2>{latest.overall}%</h2>
      </div>

      <div className="prediction-card finance">
        <h4>Finance Prediction</h4>
        <h2>{latest.finance}%</h2>
      </div>

      <div className="prediction-card study">
        <h4>Study Prediction</h4>
        <h2>{latest.study}%</h2>
      </div>

      <div className="prediction-card health">
        <h4>Health Prediction</h4>
        <h2>{latest.health}%</h2>
      </div>

    </div>
  );
}

export default PredictionSummary;