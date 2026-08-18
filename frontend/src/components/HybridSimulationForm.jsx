import { useState } from "react";
import { toast } from "react-toastify";

import { runHybridScenarios, submitRecommendationFeedback } from "../services/simulationService";
import { getApiErrorMessage } from "../utils/apiError";
import ScenarioComparison from "./ScenarioComparison";
import ScenarioChart from "./ScenarioChart";
import RecommendationCard from "./SimulationRecommendationCard";

function HybridSimulationForm() {
  const [formData, setFormData] = useState({
    additional_monthly_saving: "",
    additional_weekly_study_hours: "",
    additional_exercise_minutes: "",
    sleep_adjustment_hours: "",
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
      const data = await runHybridScenarios({
        additional_monthly_saving: Number(formData.additional_monthly_saving) || 0,
        additional_weekly_study_hours: Number(formData.additional_weekly_study_hours) || 0,
        additional_exercise_minutes: Number(formData.additional_exercise_minutes) || 0,
        sleep_adjustment_hours: Number(formData.sleep_adjustment_hours) || 0,
        months_ahead: Number(formData.months_ahead),
      });
      setResult(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to run simulation. Enter at least one non-zero change."));
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
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Combined Lifestyle What-If</h3>
      <p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
        Blend savings, study, and fitness changes into named lifestyle scenarios (e.g. Balanced Growth, Aggressive
        Savings Focus) and see which one scores best overall.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Extra Monthly Saving (₹)
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
            Extra Weekly Study Hours
          </label>
          <input
            type="number"
            name="additional_weekly_study_hours"
            value={formData.additional_weekly_study_hours}
            onChange={handleChange}
            placeholder="3"
            min="0"
            max="80"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Extra Daily Exercise (min)
          </label>
          <input
            type="number"
            name="additional_exercise_minutes"
            value={formData.additional_exercise_minutes}
            onChange={handleChange}
            placeholder="30"
            min="0"
            max="600"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Sleep Adjustment (hrs)
          </label>
          <input
            type="number"
            name="sleep_adjustment_hours"
            value={formData.sleep_adjustment_hours}
            onChange={handleChange}
            placeholder="1"
            min="-6"
            max="6"
            step="0.5"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </div>

        {error && <div className="lg:col-span-4 sm:col-span-2 text-sm text-red-600 dark:text-red-400">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="lg:col-span-4 sm:col-span-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
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

export default HybridSimulationForm;
