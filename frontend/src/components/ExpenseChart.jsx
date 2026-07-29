import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { monthlyExpenses } from "../data/financeData";

function ExpenseChart() {
  return (
    <div className="chart-card">
      <h3>Monthly Expense Trend</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyExpenses}>
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

export default ExpenseChart;