import { useState, useEffect } from "react";

import StudySummary from "../components/StudySummary";
import StudyForm from "../components/StudyForm";
import StudyChart from "../components/StudyChart";
import SubjectProgress from "../components/SubjectProgress";
import RecommendationCard from "../components/RecommendationCard";
import StudyTable from "../components/StudyTable";

import { getSessions, createSession } from "../services/studyService";

import "../styles/Study.css";

// Map study form sessions to chart data: { day, hours }
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function buildWeeklyChart(sessions) {
  const totals = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  for (const s of sessions) {
    const d = new Date(s.session_date || s.created_at);
    const label = DAY_NAMES[d.getDay()];
    totals[label] += Number(s.study_hours || 0);
  }
  return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => ({
    day,
    hours: Math.round(totals[day] * 10) / 10,
  }));
}

function Study() {
  const [sessions, setSessions]     = useState([]);
  const [chartData, setChartData]   = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    async function fetchSessions() {
      try {
        const result = await getSessions({ limit: 50 });
        const data = result.data || [];
        setSessions(data);
        setChartData(buildWeeklyChart(data));
      } catch (err) {
        console.error("Failed to fetch study sessions:", err);
        setError("Could not load study sessions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSessions();
  }, []);

  /**
   * Posts a new session to the backend and prepends it to the local list.
   * StudyForm passes { date, subject, hours, status }.
   * Mapped to backend's StudyCreateRequest schema.
   */
  async function addSession(formData) {
    try {
      const payload = {
        subject: formData.subject,
        study_hours: Number(formData.hours),
        session_type: "Self-Study",      // Default — form doesn't have this field
        attendance_pct: 100,
        session_date: formData.date
          ? new Date(formData.date).toISOString()
          : undefined,
      };
      const newRecord = await createSession(payload);
      setSessions((prev) => {
        const updated = [newRecord, ...prev];
        setChartData(buildWeeklyChart(updated));
        return updated;
      });
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to add session.";
      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  }

  return (
    <div className="study-page">

      <h2>Study Dashboard</h2>

      {error && (
        <p style={{ color: "#e53e3e", marginBottom: "1rem" }}>{error}</p>
      )}

      {isLoading ? (
        <p>Loading sessions…</p>
      ) : (
        <>
          <StudySummary sessions={sessions} />

          <StudyForm addSession={addSession} />

          <StudyChart data={chartData} />

          <SubjectProgress />

          <RecommendationCard />

          <StudyTable sessions={sessions} />
        </>
      )}

    </div>
  );
}

export default Study;