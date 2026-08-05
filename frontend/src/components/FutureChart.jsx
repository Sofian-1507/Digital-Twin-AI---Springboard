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
  const chartData = data && data.length > 0 ? data : predictionChart;
  const latest = chartData[chartData.length - 1];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">

      <h3 className="mb-5 text-lg font-semibold text-slate-800 dark:text-slate-100">Future Growth Prediction</h3>
      <p className="sr-only">
        Future growth prediction chart. {latest ? `Latest point: ${latest.month}, score ${Math.round(latest.score)}.` : "No data yet."}
      </p>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <LineChart data={chartData} margin={{ bottom: 12 }}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="month" interval={0} tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={45} />

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