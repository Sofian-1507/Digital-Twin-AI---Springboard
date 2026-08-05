import { useState } from "react";
import { Input } from "./ui/Field";
import Button from "./ui/Button";

function SimulationForm() {
  const [formData, setFormData] = useState({
    income: "",
    studyHours: "",
    sleepHours: "",
    exerciseMinutes: "",
  });

  const [score, setScore] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const runSimulation = (e) => {
    e.preventDefault();

    const income = Number(formData.income);
    const study = Number(formData.studyHours);
    const sleep = Number(formData.sleepHours);
    const exercise = Number(formData.exerciseMinutes);

    const predictedScore = Math.min(
      Math.round(
        income / 100 +
        study * 5 +
        sleep * 3 +
        exercise * 0.2
      ),
      100
    );

    setScore(predictedScore);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">

      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">What-If Simulation (Illustrative)</h3>

      <p className="mb-4 mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        This is a simple illustrative estimate, not a model backed by your real data.
      </p>

      <form onSubmit={runSimulation}>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Input
            type="number"
            name="income"
            placeholder="Monthly Income"
            value={formData.income}
            onChange={handleChange}
          />

          <Input
            type="number"
            name="studyHours"
            placeholder="Study Hours / Day"
            value={formData.studyHours}
            onChange={handleChange}
          />

          <Input
            type="number"
            name="sleepHours"
            placeholder="Sleep Hours"
            value={formData.sleepHours}
            onChange={handleChange}
          />

          <Input
            type="number"
            name="exerciseMinutes"
            placeholder="Exercise Minutes"
            value={formData.exerciseMinutes}
            onChange={handleChange}
          />

        </div>

        <Button className="mt-5">
          Run Simulation
        </Button>

      </form>

      {score !== null && (

        <div className="mt-6 rounded-xl bg-indigo-50 dark:bg-slate-700/40 p-5 text-center">

          <h2 className="text-sm font-medium text-slate-600 dark:text-slate-400">Illustrative Estimate</h2>

          <h1 className="mt-2 text-4xl font-bold text-indigo-600">{score}%</h1>

        </div>

      )}

    </div>
  );
}

export default SimulationForm;
