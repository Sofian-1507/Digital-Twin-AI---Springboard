import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { weeklyHabits } from "../data/habitData";

function HabitChart() {
  return (
    <div className="habit-chart-card">

      <h3>Weekly Habit Score</h3>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <BarChart data={weeklyHabits}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="score"
            fill="#10B981"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default HabitChart;