function HabitProgress({ habits }) {
    if (habits.length === 0) {
    return (
      <div className="habit-progress-card">
        <h3>No Habit Data Available</h3>
      </div>
    );
  }

  const latestHabit = habits[0];

  const waterProgress = Math.min(
    (Number(latestHabit.water) / 3) * 100,
    100
  );

  const sleepProgress = Math.min(
    (Number(latestHabit.sleep) / 8) * 100,
    100
  );

  const exerciseProgress = Math.min(
    (Number(latestHabit.exercise) / 60) * 100,
    100
  );
  
  return (
    <div className="habit-progress-card">

      <h3>Today's Progress</h3>

      {/* Water */}

      <div className="progress-item">

        <div className="progress-header">
          <span>💧 Water Intake</span>
          <span>{Math.round(waterProgress)}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${waterProgress}%`,
            }}
          ></div>
        </div>

      </div>

      {/* Sleep */}

      <div className="progress-item">

        <div className="progress-header">
          <span>😴 Sleep</span>
          <span>{Math.round(sleepProgress)}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${sleepProgress}%`,
            }}
          ></div>
        </div>

      </div>

      {/* Exercise */}

      <div className="progress-item">

        <div className="progress-header">
          <span>🏃 Exercise</span>
          <span>{Math.round(exerciseProgress)}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${exerciseProgress}%`,
            }}
          ></div>
        </div>

      </div>

    </div>
  );
}

export default HabitProgress;