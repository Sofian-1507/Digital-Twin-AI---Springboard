import { useState } from "react";

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
    <div className="simulation-card">

      <h3>What-If Simulation</h3>

      <form onSubmit={runSimulation}>

        <div className="simulation-grid">

          <input
            type="number"
            name="income"
            placeholder="Monthly Income"
            value={formData.income}
            onChange={handleChange}
          />

          <input
            type="number"
            name="studyHours"
            placeholder="Study Hours / Day"
            value={formData.studyHours}
            onChange={handleChange}
          />

          <input
            type="number"
            name="sleepHours"
            placeholder="Sleep Hours"
            value={formData.sleepHours}
            onChange={handleChange}
          />

          <input
            type="number"
            name="exerciseMinutes"
            placeholder="Exercise Minutes"
            value={formData.exerciseMinutes}
            onChange={handleChange}
          />

        </div>

        <button className="simulation-btn">
          Run Simulation
        </button>

      </form>

      {score !== null && (

        <div className="simulation-result">

          <h2>Future Success Score</h2>

          <h1>{score}%</h1>

        </div>

      )}

    </div>
  );
}

export default SimulationForm;