function StudySummary({ sessions }) {
  const totalHours = sessions.reduce(
    (sum, session) => sum + Number(session.hours),
    0
  );

  const totalSubjects = new Set(
    sessions.map((session) => session.subject)
  ).size;

  const completedSessions = sessions.filter(
    (session) => session.status === "Completed"
  ).length;

  const goalPercentage = Math.round(
    (completedSessions / sessions.length) * 100
  );

  const productivity =
    totalHours >= 20
      ? "Excellent"
      : totalHours >= 12
      ? "Good"
      : "Average";

  return (
    <div className="study-summary">

      <div className="study-card">
        <h4>Total Study Hours</h4>
        <h2>{totalHours} hrs</h2>
      </div>

      <div className="study-card">
        <h4>Subjects</h4>
        <h2>{totalSubjects}</h2>
      </div>

      <div className="study-card">
        <h4>Goal Completion</h4>
        <h2>{goalPercentage}%</h2>
      </div>

      <div className="study-card">
        <h4>Productivity</h4>
        <h2>{productivity}</h2>
      </div>

    </div>
  );
}

export default StudySummary;