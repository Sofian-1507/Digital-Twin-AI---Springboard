import { useState } from "react";
import { toast } from "react-toastify";

import { runFitnessScenarios, submitRecommendationFeedback } from "../services/simulationService";
import { getApiErrorMessage } from "../utils/apiError";
import ScenarioComparison from "./ScenarioComparison";
import ScenarioChart from "./ScenarioChart";
import RecommendationCard from "./RecommendationCard";

function FitnessSimulationForm() {
  const [formData, setFormData] = useState({
    additional_exercise_minutes: "",
    sleep_adjustment_hours: "",
    weeks_ahead: 4,
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
      const data = await runFitnessScenarios({
        additional_exercise_minutes: Number(formData.additional_exercise_minutes) || 0,
        sleep_adjustment_hours: Number(formData.sleep_adjustment_hours) || 0,
        weeks_ahead: Number(formData.weeks_ahead),
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
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Fitness What-If Simulation</h3>
      <p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
        See how more exercise or better sleep changes your projected habit score — based on your real habit logs.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Additional Daily Exercise (min)
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

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Simulation Period
          </label>
          <select
            name="weeks_ahead"
            value={formData.weeks_ahead}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            <option value="2">2 Weeks</option>
            <option value="4">4 Weeks</option>
            <option value="8">8 Weeks</option>
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

export default FitnessSimulationForm;
