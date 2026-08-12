import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


function ScenarioChart({ scenarios }) {

  if (!scenarios || scenarios.length === 0) {
    return null;
  }

  const chartData = scenarios.map(
    (scenario) => ({
      name: scenario.name,
      savings: scenario.future_saving,
    })
  );

  return (

    <div className="scenario-chart">

      <h3>
        Future Savings Comparison
      </h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart data={chartData}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="savings"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );
}

export default ScenarioChart;