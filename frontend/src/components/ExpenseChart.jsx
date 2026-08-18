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
import { formatCurrency } from "../utils/currency";
import { CHART_COLORS } from "../utils/chartColors";

function ExpenseChart({ data, currency = "USD" }) {
  const latest = data?.[data.length - 1];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-slate-800 dark:text-slate-100">Monthly Expense Trend</h3>
      <p className="sr-only">
        Monthly expense trend chart. {latest ? `Most recent month: ${latest.month}, ${formatCurrency(Math.round(latest.expense), currency)}.` : "No data yet."}
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
            stroke={CHART_COLORS.action}
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(ExpenseChart);