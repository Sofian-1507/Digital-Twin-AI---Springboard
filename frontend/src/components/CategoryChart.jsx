import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { categoryData } from "../data/financeData";

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

function CategoryChart() {
  return (
    <div className="chart-card">
      <h3>Expense Categories</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>

          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {categoryData.map((entry, index) => (
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

export default CategoryChart;