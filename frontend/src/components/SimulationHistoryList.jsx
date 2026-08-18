import { useEffect, useState } from "react";

import { getSimulationHistory } from "../services/simulationService";
import { SkeletonCard } from "./ui/Skeleton";
import SimulationDetailDrawer from "./SimulationDetailDrawer";

const DOMAIN_LABELS = {
  FINANCE: "Finance",
  ACADEMIC: "Study",
  HABIT: "Fitness",
  HYBRID_LIFESTYLE: "Combined",
};

const STATUS_STYLES = {
  SUCCESS: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  PARTIAL: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

function SimulationHistoryList() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getSimulationHistory({ limit: 10 })
      .then((data) => {
        if (!cancelled) setHistory(data);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) return <SkeletonCard lines={3} />;

  if (hasError) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-2 text-base font-semibold text-slate-800 dark:text-slate-100">Simulation History</h3>
        <p className="text-sm text-red-600 dark:text-red-400">
          Couldn't load your simulation history. Please try again later.
        </p>
      </div>
    );
  }

  if (history.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-slate-100">Simulation History</h3>

      <ul className="flex flex-col">
        {history.map((item) => (
          <li key={item.id} className="border-b border-slate-100 last:border-b-0 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setSelectedId(item.id)}
              className="flex w-full flex-wrap items-center justify-between gap-2 py-3 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/40"
            >
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {DOMAIN_LABELS[item.domain] || item.domain}
              </span>
              <span className="text-slate-500 dark:text-slate-400">Best: {item.top_scenario_name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  STATUS_STYLES[item.status] || "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {item.status}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <SimulationDetailDrawer
        simulationId={selectedId}
        open={selectedId != null}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}

export default SimulationHistoryList;
