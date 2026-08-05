import { StatGrid, StatTile } from "./ui/StatTile";

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
    <div className="">
      <StatGrid>
        <StatTile predicted label="Overall AI Score" value={`${latest.overall}%`} />
        <StatTile predicted label="Finance Prediction" value={`${latest.finance}%`} />
        <StatTile predicted label="Study Prediction" value={`${latest.study}%`} />
        <StatTile predicted label="Health Prediction" value={`${latest.health}%`} />
      </StatGrid>
    </div>
  );
}

export default PredictionSummary;
