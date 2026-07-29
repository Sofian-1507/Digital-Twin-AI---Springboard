function HabitSummary({ habits }) {
  const totalWater = habits.reduce(
    (sum, item) => sum + Number(item.water),
    0
  );

  const averageSleep = (
    habits.reduce(
      (sum, item) => sum + Number(item.sleep),
      0
    ) / habits.length
  ).toFixed(1);

  const totalExercise = habits.reduce(
    (sum, item) => sum + Number(item.exercise),
    0
  );

  const moodScore =
    habits.filter(
      (item) =>
        item.mood === "Happy" ||
        item.mood === "Excellent"
    ).length;

  return (
    <div className="habit-summary">

      <div className="habit-card">
        <h4>Water Intake</h4>
        <h2>{totalWater} L</h2>
      </div>

      <div className="habit-card">
        <h4>Average Sleep</h4>
        <h2>{averageSleep} hrs</h2>
      </div>

      <div className="habit-card">
        <h4>Total Exercise</h4>
        <h2>{totalExercise} min</h2>
      </div>

      <div className="habit-card">
        <h4>Positive Mood</h4>
        <h2>{moodScore}/{habits.length}</h2>
      </div>

    </div>
  );
}

export default HabitSummary;