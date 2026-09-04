import { useEffect, useState } from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-cartesian-dist";
import { toast } from "react-toastify";

// Cartesian-only build (~1/4 the size of full plotly.js — no 3D/geo/mapbox
// trace types, which this bar chart never uses) so the Prediction page's
// lazy-loaded chunk doesn't balloon to several MB for one chart.
const Plot = createPlotlyComponent(Plotly);

import { getDomainComparison } from "../services/simulationService";
import { getApiErrorMessage } from "../utils/apiError";
import { CHART_COLORS } from "../utils/chartColors";
import { SkeletonChart } from "./ui/Skeleton";
import EmptyState from "./ui/EmptyState";

const DOMAIN_TRACES = [
  { key: "finance", label: "Finance", color: CHART_COLORS.action },
  { key: "study", label: "Study", color: CHART_COLORS.positive },
  { key: "fitness", label: "Fitness", color: CHART_COLORS.predicted },
];

/**
 * Interactive (zoom/pan/hover/legend-toggle) scenario score comparison across
 * finance/study/fitness — the one thing Recharts (used everywhere else in this
 * app) doesn't cover well. Additive: every existing chart stays exactly as it
 * is, this fills a real interactivity gap rather than duplicating one of them.
 * Pulls from GET /simulation/compare — no new backend endpoint needed.
 */
function ScenarioExplorer() {
  const [comparison, setComparison] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchComparison() {
      try {
        const data = await getDomainComparison();
        if (!cancelled) setComparison(data);
      } catch (err) {
        if (cancelled) return;
        setHasError(true);
        toast.error(getApiErrorMessage(err, "Could not load the scenario explorer."));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchComparison();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) return <SkeletonChart />;

  if (hasError || !comparison) {
    return <EmptyState title="Scenario explorer unavailable" message="Could not load scenario comparison data." />;
  }

  const traces = DOMAIN_TRACES.map(({ key, label, color }) => {
    const scenarios = comparison[key]?.scenarios ?? [];
    return {
      type: "bar",
      name: label,
      x: scenarios.map((s) => s.name),
      y: scenarios.map((s) => Math.round(s.score)),
      marker: { color },
      hovertemplate: "%{x}<br>Score: %{y}/100<extra>%{fullData.name}</extra>",
    };
  });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-1 text-base font-semibold text-slate-800 dark:text-slate-100">Scenario Explorer</h3>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Zoom, hover, or click a legend entry to isolate a domain — every scenario's score, side by side.
      </p>

      <Plot
        data={traces}
        layout={{
          barmode: "group",
          autosize: true,
          height: 360,
          margin: { l: 48, r: 16, t: 16, b: 60 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          font: { family: '"Inter", ui-sans-serif, sans-serif', color: CHART_COLORS.muted, size: 12 },
          legend: { orientation: "h", y: -0.2 },
          xaxis: { tickangle: -20, gridcolor: CHART_COLORS.grid },
          yaxis: { title: "Score", range: [0, 100], gridcolor: CHART_COLORS.grid },
        }}
        config={{ displaylogo: false, responsive: true, modeBarButtonsToRemove: ["lasso2d", "select2d"] }}
        style={{ width: "100%" }}
        useResizeHandler
      />
    </div>
  );
}

export default ScenarioExplorer;
