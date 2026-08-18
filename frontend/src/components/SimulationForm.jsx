import { useState } from "react";
import { toast } from "react-toastify";

import { runFinanceScenarios, submitRecommendationFeedback } from "../services/simulationService";
import { getApiErrorMessage } from "../utils/apiError";
import ScenarioComparison from "./ScenarioComparison";
import ScenarioChart from "./ScenarioChart";
import RecommendationCard from "./SimulationRecommendationCard";

function SimulationForm() {
  const [formData, setFormData] = useState({
    additional_monthly_saving: "",
    expense_reduction_pct: "",
    months_ahead: 6,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await runFinanceScenarios({
        additional_monthly_saving: Number(formData.additional_monthly_saving) || 0,
        expense_reduction_pct: Number(formData.expense_reduction_pct) || 0,
        months_ahead: Number(formData.months_ahead),
      });
      setResult(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to run simulation."));
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (recommendationId, feedback) => {
    try {
      await submitRecommendationFeedback(recommendationId, feedback);
      toast.success("Thanks for the feedback!");
    } catch {
      toast.error("Couldn't record your feedback.");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Finance What-If Simulation</h3>
      <p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
        See how saving more or cutting expenses changes your future savings — projected off your real transaction history.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Additional Monthly Saving (₹)
          </label>
          <input
            type="number"
            name="additional_monthly_saving"
            value={formData.additional_monthly_saving}
            onChange={handleChange}
            placeholder="2000"
            min="0"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Expense Reduction (%)
          </label>
          <input
            type="number"
            name="expense_reduction_pct"
            value={formData.expense_reduction_pct}
            onChange={handleChange}
            placeholder="10"
            min="0"
            max="100"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Simulation Period
          </label>
          <select
            name="months_ahead"
            value={formData.months_ahead}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
          </select>
        </div>

        {error && <div className="sm:col-span-3 text-sm text-red-600 dark:text-red-400">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Running Simulation..." : "Run Simulation"}
        </button>
      </form>

      {result && (
        <div className="mt-6 flex flex-col gap-6">
          <ScenarioComparison scenarios={result.scenarios} />
          <ScenarioChart scenarios={result.scenarios} />
          <RecommendationCard key={result.recommendation.id} recommendation={result.recommendation} onFeedback={handleFeedback} />
        </div>
      )}
    </div>
  );
}

export default SimulationForm;
