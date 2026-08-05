import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import {
  predictionChart,
} from "../data/predictionData";

function FutureChart({ data }) {
  return (
    <div className="future-chart-card">

      <h3>Future Growth Prediction</h3>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <LineChart data={data && data.length > 0 ? data : predictionChart}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#4F46E5"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default FutureChart;