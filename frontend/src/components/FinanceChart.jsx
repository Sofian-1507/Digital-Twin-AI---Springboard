import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import EmptyState from "./ui/EmptyState";
import { CHART_COLORS } from "../utils/chartColors";

/**
 * FinanceChart — renders a monthly savings/cashflow line chart.
 * @param {{ data: Array<{ month: string, savings: number }> }} props
 */
function FinanceChart({ data = [] }) {
  if (data.length === 0) {
    return <EmptyState title="No savings data yet" message="Log a few transactions on the Finance page to see your trend here." />;
  }

  const latest = data[data.length - 1];
  const summary = `Savings trend chart. Latest point: ${latest.month}, $${Math.round(latest.savings).toLocaleString()}.`;

  return (
    <>
      <p className="sr-only">{summary}</p>
      <ResponsiveContainer
        width="100%"
        height={280}
      >

        <LineChart data={data}>

        <CartesianGrid strokeDasharray="3 3"/>

        <XAxis dataKey="month" tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}/>

        <YAxis tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}/>

        <Tooltip/>

        <Line
          type="monotone"
          dataKey="savings"
          stroke={CHART_COLORS.action}
          strokeWidth={3}
        />

        </LineChart>

      </ResponsiveContainer>
    </>
  );

}

export default memo(FinanceChart);