import { useState, useEffect } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { toast } from "react-toastify";
import "../styles/Dashboard.css";

import StatCard from "../components/StatCard";
import FinanceChart from "../components/FinanceChart";
import StudyChart from "../components/StudyChart";

import { getUser } from "../services/userService";
import { getCashflow } from "../services/financeService";
import { getSessions } from "../services/studyService";
import { getTrendSummary } from "../services/trendService";
import { getProductivityScore } from "../services/productivityService";
import { getConsistencyScore } from "../services/habitAnalyticsService";
import { buildChartData, computeSavingsRate, buildStudyChartData } from "../utils/dashboardHelpers";

function Dashboard() {
  const [userData, setUserData]         = useState(null);
  const [financeChart, setFinanceChart] = useState([]);
  const [studyChart, setStudyChart]     = useState([]);
  const [savingsRatePct, setSavingsRatePct] = useState(null);
  const [productivityScore, setProductivityScore] = useState(null);
  const [consistencyScore, setConsistencyScore]   = useState(null);
  const [trend, setTrend]               = useState(null);
  const [isLoading, setIsLoading]       = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [user, cashflow, studySessions, trendSummary, productivity, consistency] = await Promise.all([
          getUser(),
          getCashflow(6),
          getSessions({ limit: 50 }),
          getTrendSummary(),
          getProductivityScore(),
          getConsistencyScore(),
        ]);

        setUserData(user);
        setFinanceChart(buildChartData(cashflow));
        setSavingsRatePct(computeSavingsRate(cashflow));
        setStudyChart(buildStudyChartData(studySessions.data || []));
        setTrend(trendSummary);
        setProductivityScore(productivity);
        setConsistencyScore(consistency);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        toast.error("Could not load your dashboard. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Stat cards are driven by the Milestone 2 analytics engines (Financial
  // Forecasting, Productivity Analytics, Habit Analytics) rather than
  // User.digital_twin_state, which nothing in the backend ever computes/writes.
  const profile = userData?.profile;
  const goals   = userData?.active_goals ?? [];

  const savingsRate    = savingsRatePct != null ? `${savingsRatePct.toFixed(1)}%` : "—";
  const studyScore     = productivityScore ? `${Math.round(productivityScore.productivity_score)}%` : "—";
  const habitRate      = consistencyScore ? `${Math.round(consistencyScore.consistency_score)}%` : "—";
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
          subtitle={
            trend?.savings?.projected_savings?.length
              ? `Predicted next month: $${Math.round(trend.savings.projected_savings[0].value).toLocaleString()}`
              : "No transactions logged yet"
          }
          color="linear-gradient(135deg,#667EEA,#764BA2)"
        />

        <StatCard
          title="Study Consistency"
          value={studyScore}
          subtitle={
            trend?.study?.predicted_exam_score != null
              ? `Predicted Exam: ${Math.round(trend.study.predicted_exam_score)}%`
              : "No study sessions logged yet"
          }
          color="linear-gradient(135deg,#36D1DC,#5B86E5)"
        />

        <StatCard
          title="Habit Score"
          value={habitRate}
          subtitle={
            trend?.fitness?.projected_fitness_score?.length
              ? `Predicted next week: ${Math.round(trend.fitness.projected_fitness_score[0].value)}%`
              : "No habit logs yet"
          }
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
            value={savingsRatePct != null ? Math.min(100, savingsRatePct) : 0}
            max="100"
          ></progress>

          <p>{savingsRatePct != null ? `${savingsRatePct.toFixed(0)}% Savings Rate` : "No data yet"}</p>

        </div>

        <div className="progress-card">

          <h3>Study Goal</h3>

          <progress
            value={productivityScore ? Math.min(100, productivityScore.productivity_score) : 0}
            max="100"
          ></progress>

          <p>{productivityScore ? `${Math.round(productivityScore.productivity_score)}% Consistency` : "No data yet"}</p>

        </div>

        <div className="progress-card">

          <h3>Lifestyle Goal</h3>

          <progress
            value={consistencyScore ? Math.min(100, consistencyScore.consistency_score) : 0}
            max="100"
          ></progress>

          <p>{consistencyScore ? `${Math.round(consistencyScore.consistency_score)}/100 Lifestyle Score` : "No data yet"}</p>

        </div>

      </div>

      {/* Bottom Cards */}

      <div className="bottom-grid">

        <div className="recommendation-card">

          <h3>AI Recommendation</h3>

          <p>
            {trend
              ? `💰 Predicted savings next month: $${Math.round(
                  trend.savings?.projected_savings?.[0]?.value ?? 0
                ).toLocaleString()} (confidence ${Math.round((trend.savings?.confidence_score ?? 0) * 100)}%).`
              : "Log a few transactions on the Finance page to get a personalized savings prediction."}
          </p>

          <br />

          <p>
            {trend
              ? `📚 Predicted study score next week: ${Math.round(
                  trend.study?.projected_productivity?.[0]?.value ?? 0
                )}% (confidence ${Math.round((trend.study?.productivity_confidence_score ?? 0) * 100)}%).`
              : "Log a few study sessions to get a personalized study prediction."}
          </p>

        </div>

        <div className="goal-card">

          <h3>Active Goals</h3>

          <ul>
            {goals.length > 0
              ? goals.slice(0, 5).map((g) => {
                  const done = Number(g.current_value) >= Number(g.target_value);
                  return (
                    <li key={g.goal_id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {done
                        ? <CheckCircle2 size={15} strokeWidth={2} style={{ color: "#38EF7D", flexShrink: 0 }} />
                        : <Circle       size={15} strokeWidth={2} style={{ color: "#888",     flexShrink: 0 }} />}
                      {g.title}
                    </li>
                  );
                })
              : (
                <li style={{ color: "#888", fontStyle: "italic" }}>
                  No active goals yet. Add one from your Profile page.
                </li>
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