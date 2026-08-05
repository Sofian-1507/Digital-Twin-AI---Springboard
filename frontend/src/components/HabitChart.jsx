import { memo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function HabitChart({ data }) {
  const latest = data?.[data.length - 1];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">

      <h3 className="mb-5 text-lg font-semibold text-slate-800 dark:text-slate-100">Weekly Habit Score</h3>
      <p className="sr-only">
        Weekly habit score chart. {latest ? `Most recent day: ${latest.day}, score ${Math.round(latest.score)}.` : "No data yet."}
      </p>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <BarChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="day" interval={0} tick={{ fontSize: 10 }} />

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

export default memo(HabitChart);