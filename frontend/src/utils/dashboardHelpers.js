/**
 * src/utils/dashboardHelpers.js
 * Pure data-transform helpers for Dashboard.jsx, extracted out so the page
 * component itself stays focused on data-fetching and rendering.
 */

// Month abbreviations for chart labels
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/** Groups raw MonthlyCashflowItem[] into per-month { income, expense } totals. */
export function groupMonthlyTotals(cashflowItems) {
  const map = {};
  for (const item of cashflowItems) {
    const key = `${item.year}-${String(item.month).padStart(2, "0")}`;
    if (!map[key]) map[key] = { key, year: item.year, month: item.month, income: 0, expense: 0 };
    // Backend TransactionType enum values are upper-case ("INCOME"/"EXPENSE").
    if (item.type === "INCOME")  map[key].income  += Number(item.total_amount);
    if (item.type === "EXPENSE") map[key].expense += Number(item.total_amount);
  }
  return Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Transform the backend's MonthlyCashflowItem[] into the shape
 * FinanceChart expects: [{ month: "Jan", savings: 4000 }, ...]
 * "savings" = Income total minus Expense total for that month.
 */
export function buildChartData(cashflowItems) {
  return groupMonthlyTotals(cashflowItems).map((row) => ({
    month: MONTH_NAMES[row.month - 1],
    savings: Math.max(0, row.income - row.expense),
  }));
}

/** Latest month's savings rate = (income - expense) / income * 100, or null with no income data. */
export function computeSavingsRate(cashflowItems) {
  const months = groupMonthlyTotals(cashflowItems);
  if (!months.length) return null;
  const latest = months[months.length - 1];
  if (!latest.income) return null;
  return Math.max(0, ((latest.income - latest.expense) / latest.income) * 100);
}

/**
 * Derive weekly study hours from the paginated sessions list.
 * Groups sessions by day-of-week label.
 */
export function buildStudyChartData(sessions) {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const totals = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
  for (const s of sessions) {
    const d = new Date(s.session_date || s.created_at);
    const label = days[d.getDay()];
    totals[label] += Number(s.study_hours || 0);
  }
  return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => ({
    day,
    hours: Math.round(totals[day] * 10) / 10,
  }));
}
