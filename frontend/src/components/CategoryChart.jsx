import { memo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "../utils/currency";

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

function CategoryChart({ data, currency = "USD" }) {
  const top = data?.length ? [...data].sort((a, b) => b.value - a.value)[0] : null;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-slate-800 dark:text-slate-100">Expense Categories</h3>
      <p className="sr-only">
        Expense breakdown by category. {top ? `Top category: ${top.name}, ${formatCurrency(Math.round(top.value), currency)}.` : "No data yet."}
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data && data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[index % COLORS.length]
                }
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(CategoryChart);