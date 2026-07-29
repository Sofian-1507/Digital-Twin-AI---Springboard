import {

LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid

} from "recharts";

import { expenseData } from "../data/dashboardData";

function FinanceChart() {

return(

<ResponsiveContainer
width="100%"
height={280}
>

<LineChart data={expenseData}>

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