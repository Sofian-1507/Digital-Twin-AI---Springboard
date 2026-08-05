import { memo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function ExpenseChart({ data }) {
  const latest = data?.[data.length - 1];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-slate-800 dark:text-slate-100">Monthly Expense Trend</h3>
      <p className="sr-only">
        Monthly expense trend chart. {latest ? `Most recent month: ${latest.month}, $${Math.round(latest.expense).toLocaleString()}.` : "No data yet."}
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="#4F46E5"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(ExpenseChart);