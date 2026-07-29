import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

/**
 * FinanceChart — renders a monthly savings/cashflow line chart.
 * @param {{ data: Array<{ month: string, savings: number }> }} props
 */
function FinanceChart({ data = [] }) {

  return (

    <ResponsiveContainer
      width="100%"
      height={280}
    >

      <LineChart data={data}>

        <CartesianGrid strokeDasharray="3 3"/>

        <XAxis dataKey="month"/>

        <YAxis/>

        <Tooltip/>

        <Line
          type="monotone"
          dataKey="savings"
          stroke="#4F46E5"
          strokeWidth={3}
        />

      </LineChart>

    </ResponsiveContainer>

  );

}

export default FinanceChart;