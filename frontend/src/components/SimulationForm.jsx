import { useState } from "react";

import {
  runFinanceScenarios
} from "../services/simulationService";

import ScenarioComparison
  from "./ScenarioComparison";

import ScenarioChart
  from "./ScenarioChart";
import SimulationResult from "./SimulationResult";
import RecommendationCard
  from "./RecommendationCard";
function SimulationForm() {

  const [formData, setFormData] = useState({
    monthly_income: "",
    monthly_expense: "",
    additional_saving: "",
    months: 6,
  });

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });

  };

const handleSubmit = async (e) => {

  e.preventDefault();

  setLoading(true);
  setError("");
  setResult(null);

  try {

    const data =
      await runFinanceScenarios({

        monthly_income:
          Number(
            formData.monthly_income
          ),

        monthly_expense:
          Number(
            formData.monthly_expense
          ),

        months:
          Number(formData.months),

      });

    setResult(data);

  } catch (err) {

    setError(
      err.message ||
      "Unable to run simulation."
    );

  } finally {

    setLoading(false);

  }
};


  return (

    <div className="simulation-card">

      <h3>
        Finance What-If Simulation
      </h3>

      <p>
        Change your financial decision
        and see the possible future outcome.
      </p>


      <form
        onSubmit={handleSubmit}
        className="simulation-form"
      >

        <div className="form-group">

          <label>
            Monthly Income
          </label>

          <input
            type="number"
            name="monthly_income"
            value={
              formData.monthly_income
            }
            onChange={handleChange}
            placeholder="40000"
            min="1"
            required
          />

        </div>


        <div className="form-group">

          <label>
            Monthly Expense
          </label>

          <input
            type="number"
            name="monthly_expense"
            value={
              formData.monthly_expense
            }
            onChange={handleChange}
            placeholder="25000"
            min="0"
            required
          />

        </div>


        <div className="form-group">

          <label>
            Additional Monthly Saving
          </label>

          <input
            type="number"
            name="additional_saving"
            value={
              formData.additional_saving
            }
            onChange={handleChange}
            placeholder="3000"
            min="0"
            required
          />

        </div>


        <div className="form-group">

          <label>
            Simulation Period
          </label>

          <select
            name="months"
            value={formData.months}
            onChange={handleChange}
          >

            <option value="3">
              3 Months
            </option>

            <option value="6">
              6 Months
            </option>

            <option value="12">
              12 Months
            </option>

          </select>

        </div>


        {error && (

          <div className="simulation-error">
            {error}
          </div>

        )}


        <button
          type="submit"
          className="simulation-btn"
          disabled={loading}
        >

          {loading
            ? "Running Simulation..."
            : "Run Simulation"}

        </button>

      </form>
      {result && (
  <>
    <ScenarioComparison
      scenarios={result.scenarios}
    />

    <ScenarioChart
      scenarios={result.scenarios}
    />
    <RecommendationCard
    recommendation={result.recommendation}
    />
  </>
)}


      <SimulationResult
        result={result}
      />

    </div>

  );
}

export default SimulationForm;