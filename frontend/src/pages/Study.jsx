import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import StudySummary from "../components/StudySummary";
import StudyForm from "../components/StudyForm";
import StudyChart from "../components/StudyChart";
import SubjectProgress from "../components/SubjectProgress";
import RecommendationCard from "../components/RecommendationCard";
import StudyTable from "../components/StudyTable";

import { getSessions, createSession } from "../services/studyService";

import "../styles/Study.css";

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
  const [sessions, setSessions]   = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const result = await getSessions({ limit: 50 });
        const data = result.data || [];
        setSessions(data);
        setChartData(buildWeeklyChart(data));
      } catch (err) {
        console.error("Failed to fetch study sessions:", err);
        toast.error("Could not load study sessions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSessions();
  }, []);

  /**
   * Posts a new session to the backend and prepends it to the local list.
   * session_type uses a valid backend enum value: "DEEP_WORK".
   */
  async function addSession(formData) {
    const payload = {
      subject:      formData.subject,
      study_hours:  Number(formData.hours),
      session_type: "DEEP_WORK",   // Backend enum: DEEP_WORK | REVIEW | LECTURE | PRACTICE_EXAM | ASSIGNMENT | RESEARCH
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
  }

  return (
    <div className="study-page">

      <h2>Study Dashboard</h2>

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