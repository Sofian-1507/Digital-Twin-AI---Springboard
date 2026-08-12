import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import PredictionSummary from "../components/PredictionSummary";
import PredictionCards from "../components/PredictionCards";
import FutureChart from "../components/FutureChart";
import SimulationForm from "../components/SimulationForm";
import AIInsights from "../components/AIInsights";
import PredictionHistory from "../components/PredictionHistory";
import GoalTrendList from "../components/GoalTrendList";
import { SkeletonStatGrid, SkeletonChart } from "../components/ui/Skeleton";

import { getTrendSummary } from "../services/trendService";
import { getProductivityScore, getWeeklyProductivityTrend } from "../services/productivityService";
import { getConsistencyScore } from "../services/habitAnalyticsService";
import SimulationForm from "../components/SimulationForm";
// Short "Aug 3" style label for chart x-axes, from an ISO date/period string.
function formatShortDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const TABS = [
  { id: "forecasts", label: "Forecasts" },
  { id: "what-if", label: "What-If" },
];

function Prediction() {
  const [activeTab, setActiveTab]         = useState("forecasts");
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
        toast.error("Could not load your predictions. Please try again later.");
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
        },
        {
          title: "Fitness",
          current: Math.round(consistencyScore?.consistency_score ?? 0),
          future: Math.round(trend.fitness?.projected_fitness_score?.[0]?.value ?? 0),
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

    <div>

      <h2 className="mb-6 text-2xl font-semibold text-slate-800 dark:text-slate-100">AI Prediction Dashboard</h2>

      <div role="tablist" aria-label="Prediction views" className="mb-6 flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`-mb-px border-b-2 px-1 py-2.5 text-sm font-semibold ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-5">
          <SkeletonStatGrid count={4} />
          <SkeletonChart />
        </div>
      ) : activeTab === "forecasts" ? (
        <div role="tabpanel" id="panel-forecasts" aria-labelledby="tab-forecasts" className="flex flex-col gap-6">
          <PredictionSummary history={derivedHistory} />

          <PredictionCards predictions={predictionCards} />

          <FutureChart data={futureChartData} />
          <SimulationForm />
          <AIInsights insights={aiInsights} />

          <GoalTrendList goals={trend?.goals} />

          <PredictionHistory history={derivedHistory} />
        </div>
      ) : (
        <div role="tabpanel" id="panel-what-if" aria-labelledby="tab-what-if">
          <SimulationForm />
        </div>
      )}

    </div>

  );

}

export default Prediction;