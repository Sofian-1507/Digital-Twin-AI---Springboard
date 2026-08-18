import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "../utils/chartColors";

function ScenarioChart({ scenarios }) {
  if (!scenarios || scenarios.length === 0) {
    return null;
  }

  const primaryLabel = scenarios[0].primary_metric_label;
  const chartData = scenarios.map((scenario) => ({
    name: scenario.name,
    value: scenario.primary_metric_value,
  }));

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-slate-100">
        {primaryLabel} by Scenario
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" name={primaryLabel} fill={CHART_COLORS.action} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScenarioChart;
