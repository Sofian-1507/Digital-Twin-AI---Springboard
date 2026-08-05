import { useState } from "react";
import { Input } from "./ui/Field";
import EmptyState from "./ui/EmptyState";

function PredictionHistory({ history }) {

  const [search, setSearch] = useState("");

  const filteredHistory = history.filter((item) =>
    item.date.includes(search)
  );

  return (
    <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Prediction History</h3>

        <Input
          type="text"
          placeholder="Search Date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-48"
        />

      </div>

      {filteredHistory.length === 0 ? (
        <EmptyState title="No prediction history yet" message="Predictions will appear here as your analytics data grows." />
      ) : (
        <table className="w-full min-w-125 border-collapse text-center text-sm">

          <thead>
            <tr>
              <th className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-3.5 font-semibold text-slate-500 dark:text-slate-400">Date</th>
              <th className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-3.5 font-semibold text-slate-500 dark:text-slate-400">Finance</th>
              <th className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-3.5 font-semibold text-slate-500 dark:text-slate-400">Study</th>
              <th className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-3.5 font-semibold text-slate-500 dark:text-slate-400">Health</th>
              <th className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-3.5 font-semibold text-slate-500 dark:text-slate-400">Overall</th>
            </tr>
          </thead>

          <tbody>
            {filteredHistory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                <td className="border-b border-slate-100 dark:border-slate-700 p-3.5 font-mono tabular-nums text-slate-600 dark:text-slate-400">{item.date}</td>
                <td className="border-b border-slate-100 dark:border-slate-700 p-3.5 font-mono tabular-nums text-slate-600 dark:text-slate-400">{item.finance}%</td>
                <td className="border-b border-slate-100 dark:border-slate-700 p-3.5 font-mono tabular-nums text-slate-600 dark:text-slate-400">{item.study}%</td>
                <td className="border-b border-slate-100 dark:border-slate-700 p-3.5 font-mono tabular-nums text-slate-600 dark:text-slate-400">{item.health}%</td>
                <td className="border-b border-slate-100 dark:border-slate-700 p-3.5 font-mono tabular-nums text-slate-600 dark:text-slate-400">{item.overall}%</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
}

export default PredictionHistory;
