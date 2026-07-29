import { useState, useEffect } from "react";
import "../styles/Dashboard.css";

import StatCard from "../components/StatCard";
import FinanceChart from "../components/FinanceChart";
import StudyChart from "../components/StudyChart";

import { getUser } from "../services/userService";
import { getCashflow } from "../services/financeService";
import { getSessions } from "../services/studyService";

// Month abbreviations for chart labels
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/**
 * Transform the backend's MonthlyCashflowItem[] into the shape
 * FinanceChart expects: [{ month: "Jan", savings: 4000 }, ...]
 * "savings" = Income total minus Expense total for that month.
 */
function buildChartData(cashflowItems) {
  // Group by year-month
  const map = {};
  for (const item of cashflowItems) {
    const key = `${item.year}-${String(item.month).padStart(2, "0")}`;
    if (!map[key]) map[key] = { key, year: item.year, month: item.month, income: 0, expense: 0 };
    if (item.type === "Income")  map[key].income  += Number(item.total_amount);
    if (item.type === "Expense") map[key].expense += Number(item.total_amount);
  }
  return Object.values(map)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((row) => ({
      month: MONTH_NAMES[row.month - 1],
      savings: Math.max(0, row.income - row.expense),
    }));
}

/**
 * Derive weekly study hours from the paginated sessions list.
 * Groups sessions by day-of-week label.
 */
function buildStudyChartData(sessions) {
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

function Dashboard() {
  const [userData, setUserData]         = useState(null);
  const [financeChart, setFinanceChart] = useState([]);
  const [studyChart, setStudyChart]     = useState([]);
  const [isLoading, setIsLoading]       = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [user, cashflow, studySessions] = await Promise.all([
          getUser(),
          getCashflow(6),
          getSessions({ limit: 50 }),
        ]);

        setUserData(user);
        setFinanceChart(buildChartData(cashflow));
        setStudyChart(buildStudyChartData(studySessions.data || []));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Derive stat card values from the Digital Twin State
  const twin    = userData?.digital_twin_state;
  const profile = userData?.profile;
  const goals   = userData?.active_goals ?? [];

  const savingsRate    = twin ? `${Number(twin.savings_rate_pct).toFixed(1)}%` : "$—";
  const studyScore     = twin ? `${Number(twin.study_consistency_score).toFixed(0)}%` : "—";
  const habitRate      = twin ? `${Number(twin.habit_completion_rate * 100).toFixed(0)}%` : "—";
  const goalsCompleted = goals.length ? `${goals.filter(g => Number(g.current_value) >= Number(g.target_value)).length}/${goals.length}` : "—";

  return (
    <div className="dashboard">

      {/* Header */}

      <div className="dashboard-header">

        <div>
          <h2>Dashboard</h2>

          <p>
            {isLoading
              ? "Loading your Digital Twin overview..."
              : `Welcome back${profile?.name ? ", " + profile.name : ""}! Here's your Digital Twin overview.`}
          </p>
        </div>

        <button className="add-btn">
          + Add Record
        </button>

      </div>

      {/* Summary Cards */}

      <div className="summary-grid">

        <StatCard
          title="Savings Rate"
          value={savingsRate}
          subtitle={twin ? `Emergency Fund: ${Number(twin.emergency_fund_months).toFixed(1)} mo` : "+8% This Month"}
          color="linear-gradient(135deg,#667EEA,#764BA2)"
        />

        <StatCard
          title="Study Consistency"
          value={studyScore}
          subtitle={twin ? `Predicted Exam: ${Number(twin.predicted_exam_score).toFixed(0)}%` : "Weekly Progress"}
          color="linear-gradient(135deg,#36D1DC,#5B86E5)"
        />

        <StatCard
          title="Habit Score"
          value={habitRate}
          subtitle={twin ? `Lifestyle: ${Number(twin.lifestyle_score).toFixed(0)}/100` : "Excellent"}
          color="linear-gradient(135deg,#11998E,#38EF7D)"
        />

        <StatCard
          title="Goals Completed"
          value={goalsCompleted}
          subtitle="Keep Going"
          color="linear-gradient(135deg,#F7971E,#FFD200)"
        />

      </div>

      {/* Charts */}

      <div className="chart-grid">

        <div className="chart-card">

          <h3>Financial Overview</h3>

          <FinanceChart data={financeChart} />

        </div>

        <div className="chart-card">

          <h3>Study Performance</h3>

          <StudyChart data={studyChart} />

        </div>

      </div>

      {/* Progress Cards */}

      <div className="progress-grid">

        <div className="progress-card">

          <h3>Financial Goal</h3>

          <progress
            value={twin ? Math.min(100, Number(twin.savings_rate_pct)) : 75}
            max="100"
          ></progress>

          <p>{twin ? `${Number(twin.savings_rate_pct).toFixed(0)}% Savings Rate` : "75% Completed"}</p>

        </div>

        <div className="progress-card">

          <h3>Study Goal</h3>

          <progress
            value={twin ? Math.min(100, Number(twin.study_consistency_score)) : 90}
            max="100"
          ></progress>

          <p>{twin ? `${Number(twin.study_consistency_score).toFixed(0)}% Consistency` : "90% Completed"}</p>

        </div>

        <div className="progress-card">

          <h3>Lifestyle Goal</h3>

          <progress
            value={twin ? Math.min(100, Number(twin.lifestyle_score)) : 62}
            max="100"
          ></progress>

          <p>{twin ? `${Number(twin.lifestyle_score).toFixed(0)}/100 Lifestyle Score` : "62% Completed"}</p>

        </div>

      </div>

      {/* Bottom Cards */}

      <div className="bottom-grid">

        <div className="recommendation-card">

          <h3>AI Recommendation</h3>

          <p>
            {twin && Number(twin.savings_rate_pct) < 20
              ? "Increase your monthly savings rate to build a stronger financial buffer."
              : "Save an additional $300 this month to achieve your yearly savings goal nearly two months earlier."}
          </p>

          <br />

          <p>
            {twin && Number(twin.study_consistency_score) < 70
              ? "Boost your study consistency to improve your predicted exam score."
              : "Increase your daily study time by one hour to improve your academic prediction score."}
          </p>

        </div>

        <div className="goal-card">

          <h3>Active Goals</h3>

          <ul>
            {goals.length > 0
              ? goals.slice(0, 5).map((g) => (
                  <li key={g.goal_id}>
                    {Number(g.current_value) >= Number(g.target_value) ? "✔" : "○"} {g.title}
                  </li>
                ))
              : (
                <>
                  <li>✔ Complete React Project</li>
                  <li>✔ Finish ML Course</li>
                  <li>✔ Save $1,000</li>
                  <li>✔ Exercise 5 Days/Week</li>
                  <li>✔ Read Two Books</li>
                </>
              )}
          </ul>

        </div>

      </div>

      {/* Recent Activity */}

      <div className="activity-card">

        <h3>Recent Activities</h3>

        <table>

          <thead>

            <tr>

              <th>Date</th>

              <th>Activity</th>

              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td>28 Jul</td>

              <td>Added Expense Record</td>

              <td>Completed</td>

            </tr>

            <tr>

              <td>27 Jul</td>

              <td>Updated Study Hours</td>

              <td>Completed</td>

            </tr>

            <tr>

              <td>26 Jul</td>

              <td>Completed Workout</td>

              <td>Completed</td>

            </tr>

            <tr>

              <td>25 Jul</td>

              <td>Generated AI Prediction</td>

              <td>Completed</td>

            </tr>

            <tr>

              <td>24 Jul</td>

              <td>Updated Financial Goal</td>

              <td>Completed</td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Dashboard;