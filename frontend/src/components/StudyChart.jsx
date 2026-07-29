import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { weeklyStudy } from "../data/studyData";

function StudyChart() {
  return (
    <div className="study-chart-card">

      <h3>Weekly Study Progress</h3>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart data={weeklyStudy}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="hours"
            fill="#4F46E5"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default StudyChart;