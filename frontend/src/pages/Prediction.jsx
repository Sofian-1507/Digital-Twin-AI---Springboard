import { useState, useEffect } from "react";

import PredictionSummary from "../components/PredictionSummary";
import PredictionCards from "../components/PredictionCards";
import FutureChart from "../components/FutureChart";
import SimulationForm from "../components/SimulationForm";
import AIInsights from "../components/AIInsights";
import PredictionHistory from "../components/PredictionHistory";

import { getUser } from "../services/userService";

import "../styles/Prediction.css";

function Prediction() {
  const [userData, setUserData]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUser()
      .then((data) => setUserData(data))
      .catch((err) => console.error("Failed to fetch user data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Transform the user's active goals list into the shape PredictionHistory expects:
  // [{ date, type, prediction, accuracy }]
  // Since the backend doesn't have a prediction history table yet, we derive a summary
  // from the DigitalTwinState fields.
  const twin = userData?.digital_twin_state;
  const goals = userData?.active_goals ?? [];

  const derivedHistory = twin
    ? [
        {
          date: twin.last_updated_at
            ? new Date(twin.last_updated_at).toLocaleDateString()
            : "—",
          type: "Financial",
          prediction: `Savings Rate: ${Number(twin.savings_rate_pct).toFixed(1)}%`,
          accuracy: `${Number(twin.savings_rate_pct).toFixed(0)}%`,
        },
        {
          date: twin.last_updated_at
            ? new Date(twin.last_updated_at).toLocaleDateString()
            : "—",
          type: "Academic",
          prediction: `Predicted Exam Score: ${Number(twin.predicted_exam_score).toFixed(0)}%`,
          accuracy: `${Number(twin.study_consistency_score).toFixed(0)}%`,
        },
      ]
    : [];

  return (

    <div className="prediction-page">

      <h2>AI Prediction Dashboard</h2>

      {isLoading ? (
        <p>Loading predictions…</p>
      ) : (
        <>
          <PredictionSummary history={derivedHistory} />

          <PredictionCards />

          <FutureChart />

          <SimulationForm />

          <AIInsights />

          <PredictionHistory history={derivedHistory} />
        </>
      )}

    </div>

  );

}

export default Prediction;