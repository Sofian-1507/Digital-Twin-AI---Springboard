import "../styles/Dashboard.css";

import StatCard from "../components/StatCard";
import FinanceChart from "../components/FinanceChart";
import StudyChart from "../components/StudyChart";

function Dashboard() {
  return (
    <div className="dashboard">

      {/* Header */}

      <div className="dashboard-header">

        <div>
          <h2>Dashboard</h2>

          <p>
            Welcome back! Here's your Digital Twin overview.
          </p>
        </div>

        <button className="add-btn">
          + Add Record
        </button>

      </div>

      {/* Summary Cards */}

      <div className="summary-grid">

        <StatCard
          title="Total Savings"
          value="$12,450"
          subtitle="+8% This Month"
          color="linear-gradient(135deg,#667EEA,#764BA2)"
        />

        <StatCard
          title="Study Hours"
          value="48 Hrs"
          subtitle="Weekly Progress"
          color="linear-gradient(135deg,#36D1DC,#5B86E5)"
        />

        <StatCard
          title="Habit Score"
          value="89%"
          subtitle="Excellent"
          color="linear-gradient(135deg,#11998E,#38EF7D)"
        />

        <StatCard
          title="Goals Completed"
          value="7/10"
          subtitle="Keep Going"
          color="linear-gradient(135deg,#F7971E,#FFD200)"
        />

      </div>

      {/* Charts */}

      <div className="chart-grid">

        <div className="chart-card">

          <h3>Financial Overview</h3>

          <FinanceChart />

        </div>

        <div className="chart-card">

          <h3>Study Performance</h3>

          <StudyChart />

        </div>

      </div>

      {/* Progress Cards */}

      <div className="progress-grid">

        <div className="progress-card">

          <h3>Financial Goal</h3>

          <progress
            value="75"
            max="100"
          ></progress>

          <p>75% Completed</p>

        </div>

        <div className="progress-card">

          <h3>Study Goal</h3>

          <progress
            value="90"
            max="100"
          ></progress>

          <p>90% Completed</p>

        </div>

        <div className="progress-card">

          <h3>Fitness Goal</h3>

          <progress
            value="62"
            max="100"
          ></progress>

          <p>62% Completed</p>

        </div>

      </div>

      {/* Bottom Cards */}

      <div className="bottom-grid">

        <div className="recommendation-card">

          <h3>AI Recommendation</h3>

          <p>
            Save an additional $300 this month to
            achieve your yearly savings goal nearly
            two months earlier.
          </p>

          <br />

          <p>
            Increase your daily study time by
            one hour to improve your academic
            prediction score.
          </p>

        </div>

        <div className="goal-card">

          <h3>Upcoming Goals</h3>

          <ul>

            <li>✔ Complete React Project</li>

            <li>✔ Finish ML Course</li>

            <li>✔ Save $1,000</li>

            <li>✔ Exercise 5 Days/Week</li>

            <li>✔ Read Two Books</li>

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