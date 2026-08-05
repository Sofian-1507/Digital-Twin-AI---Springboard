import { useState, useEffect } from "react";

import PredictionSummary from "../components/PredictionSummary";
import PredictionCards from "../components/PredictionCards";
import FutureChart from "../components/FutureChart";
import SimulationForm from "../components/SimulationForm";
import AIInsights from "../components/AIInsights";
import PredictionHistory from "../components/PredictionHistory";

import { getTrendSummary } from "../services/trendService";
import { getProductivityScore, getWeeklyProductivityTrend } from "../services/productivityService";
import { getConsistencyScore } from "../services/habitAnalyticsService";

import "../styles/Prediction.css";

// Short "Aug 3" style label for chart x-axes, from an ISO date/period string.
function formatShortDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function Prediction() {
  const [trend, setTrend]                 = useState(null);
  const [productivityScore, setProductivityScore] = useState(null);
  const [consistencyScore, setConsistencyScore]   = useState(null);
  const [weeklyTrend, setWeeklyTrend]      = useState([]);
  const [isLoading, setIsLoading]          = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [trendSummary, productivity, consistency, weekly] = await Promise.all([
          getTrendSummary(),
          getProductivityScore(),
          getConsistencyScore(),
          getWeeklyProductivityTrend(6),
        ]);
        setTrend(trendSummary);
        setProductivityScore(productivity);
        setConsistencyScore(consistency);
        setWeeklyTrend(weekly.trend || []);
      } catch (err) {
        console.error("Failed to fetch prediction data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Single real snapshot (the backend doesn't persist a history of past predictions,
  // so PredictionSummary/PredictionHistory get today's real confidence scores as one row
  // instead of the fabricated multi-row mock they used to render).
  const derivedHistory = trend
    ? [
        {
          id: 1,
          date: trend.generated_at ? new Date(trend.generated_at).toLocaleDateString() : "—",
          finance: Math.round((trend.savings?.confidence_score ?? 0) * 100),
          study: Math.round((trend.study?.productivity_confidence_score ?? 0) * 100),
          health: Math.round((trend.fitness?.confidence_score ?? 0) * 100),
          overall: Math.round((trend.overall_confidence_score ?? 0) * 100),
        },
      ]
    : [];

  // Study + Fitness are both real 0-100 scores, so they map cleanly onto PredictionCards'
  // current/future percentage format. Savings is a currency amount, not a percentage,
  // so it isn't forced into this card — it's represented in AIInsights instead.
  const predictionCards = trend
    ? [
        {
          title: "Study",
          current: Math.round(productivityScore?.productivity_score ?? 0),
          future: Math.round(trend.study?.projected_productivity?.[0]?.value ?? 0),
          color: "#4F46E5",
        },
        {
          title: "Fitness",
          current: Math.round(consistencyScore?.consistency_score ?? 0),
          future: Math.round(trend.fitness?.projected_fitness_score?.[0]?.value ?? 0),
          color: "#10B981",
        },
      ]
    : [];

  // Historical weekly productivity trend + the trend engine's projected future weeks,
  // concatenated chronologically for a single "past -> predicted" growth line.
  const futureChartData = [
    ...weeklyTrend.map((w) => ({
      month: formatShortDate(w.week_start),
      score: Math.round(w.average_productivity_score),
    })),
    ...(trend?.study?.projected_productivity ?? []).map((p) => ({
      month: formatShortDate(p.period),
      score: Math.round(p.value),
    })),
  ];

  const aiInsights = trend
    ? [
        `💰 Predicted savings next month: $${Math.round(
          trend.savings?.projected_savings?.[0]?.value ?? 0
        ).toLocaleString()} (confidence ${Math.round((trend.savings?.confidence_score ?? 0) * 100)}%)`,
        `📚 Predicted study score next week: ${Math.round(
          trend.study?.projected_productivity?.[0]?.value ?? 0
        )}% (confidence ${Math.round((trend.study?.productivity_confidence_score ?? 0) * 100)}%)`,
        `🏃 Predicted fitness score next week: ${Math.round(
          trend.fitness?.projected_fitness_score?.[0]?.value ?? 0
        )}% (confidence ${Math.round((trend.fitness?.confidence_score ?? 0) * 100)}%)`,
        ...(trend.study?.predicted_exam_score != null
          ? [`🎓 Predicted exam score: ${Math.round(trend.study.predicted_exam_score)}%`]
          : []),
        `📈 Overall prediction confidence: ${Math.round((trend.overall_confidence_score ?? 0) * 100)}%`,
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

          <PredictionCards predictions={predictionCards} />

          <FutureChart data={futureChartData} />

          <SimulationForm />

          <AIInsights insights={aiInsights} />

          <PredictionHistory history={derivedHistory} />
        </>
      )}

    </div>

  );

}

export default Prediction;