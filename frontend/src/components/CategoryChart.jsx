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
import { CHART_COLORS } from "../utils/chartColors";

const COLORS = [
  CHART_COLORS.action,
  CHART_COLORS.positive,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
];

function CategoryChart({ data, currency = "USD" }) {
  const top = data?.length ? [...data].sort((a, b) => b.value - a.value)[0] : null;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Expense Categories <span className="text-sm font-normal text-slate-400">(Last 6 Months)</span>
      </h3>
      <p className="sr-only">
        Expense breakdown by category over the last 6 months. {top ? `Top category: ${top.name}, ${formatCurrency(Math.round(top.value), currency)}.` : "No data yet."}
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill={CHART_COLORS.action}
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

          <Legend wrapperStyle={{ color: CHART_COLORS.muted, fontSize: 12 }} />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(CategoryChart);