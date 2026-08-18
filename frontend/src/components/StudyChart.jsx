import { memo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import EmptyState from "./ui/EmptyState";
import { CHART_COLORS } from "../utils/chartColors";

/**
 * StudyChart — renders a weekly study hours bar chart.
 * @param {{ data: Array<{ day: string, hours: number }> }} props
 */
function StudyChart({ data = [] }) {
  const totalHours = data.reduce((sum, d) => sum + Number(d.hours || 0), 0);
  const hasData = data.some((d) => Number(d.hours) > 0);

  return (
    <div>

      <h3 className="mb-5 text-lg font-semibold text-slate-800 dark:text-slate-100">Weekly Study Progress</h3>

      {!hasData ? (
        <EmptyState title="No study data yet" message="Log a study session to see your weekly progress here." />
      ) : (
        <>
      <p className="sr-only">Weekly study hours chart. Total this week: {totalHours} hours.</p>

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
            dataKey="hours"
            fill={CHART_COLORS.action}
            radius={[8, 8, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>
        </>
      )}

    </div>
  );
}

export default memo(StudyChart);