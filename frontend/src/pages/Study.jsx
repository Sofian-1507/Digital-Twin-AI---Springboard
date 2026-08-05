import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import StudySummary from "../components/StudySummary";
import StudyForm from "../components/StudyForm";
import StudyChart from "../components/StudyChart";
import SubjectProgress from "../components/SubjectProgress";
import RecommendationCard from "../components/RecommendationCard";
import StudyTable from "../components/StudyTable";

import { getSessions, createSession, updateSession, deleteSession } from "../services/studyService";
import { getProductivitySummary } from "../services/productivityService";

import "../styles/Study.css";

/** Builds RecommendationCard's insight strings from a ProductivitySummaryResponse. */
function buildStudyInsights(summary) {
  if (!summary) return [];

  const insights = [
    `📊 Current productivity score: ${Math.round(summary.productivity_score.productivity_score)}%`,
    `🎯 Focus score: ${Math.round(summary.focus_score.focus_score)}% (${
      summary.focus_score.method_used === "recorded_average"
        ? "based on logged focus ratings"
        : "estimated from attendance"
    })`,
    `✅ Studied ${Math.round(summary.completion_percentage.completion_percentage)}% of days in the last ${
      summary.completion_percentage.window_days
    } days`,
  ];

  const predicted = summary.performance_prediction?.predicted_productivity?.[0]?.projected_score;
  if (predicted != null) {
    insights.push(`🚀 Predicted productivity next week: ${Math.round(predicted)}%`);
  }
  if (summary.performance_prediction?.predicted_exam_score != null) {
    insights.push(`🎓 Predicted exam score: ${Math.round(summary.performance_prediction.predicted_exam_score)}%`);
  }

  return insights;
}

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
  const [productivitySummary, setProductivitySummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const [result, summary] = await Promise.all([
          getSessions({ limit: 50 }),
          getProductivitySummary(),
        ]);
        const data = result.data || [];
        setSessions(data);
        setChartData(buildWeeklyChart(data));
        setProductivitySummary(summary);
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
    try {
      const payload = {
        subject:      formData.subject,
        study_hours:  Number(formData.hours),
        session_type: "DEEP_WORK",
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
      toast.success("Study session logged successfully.");
    } catch (err) {
      console.error("Failed to add study session:", err);
      toast.error("Failed to log study session. Please try again.");
      throw err;
    }
  }

  const handleUpdate = async (id, formData) => {
    try {
      const payload = {
        subject:      formData.subject,
        study_hours:  Number(formData.hours),
        session_type: "DEEP_WORK",
        attendance_pct: 100,
        session_date: formData.date
          ? new Date(formData.date).toISOString()
          : undefined,
      };
      const updatedRecord = await updateSession(id, payload);
      setSessions((prev) => {
        const updated = prev.map(s => s.id === id ? updatedRecord : s);
        setChartData(buildWeeklyChart(updated));
        return updated;
      });
      toast.success("Study session updated successfully.");
      setEditingRecord(null);
    } catch (err) {
      console.error("Failed to update session:", err);
      toast.error("Failed to update session. Please try again.");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      await deleteSession(id);
      setSessions((prev) => {
        const updated = prev.filter(s => s.id !== id);
        setChartData(buildWeeklyChart(updated));
        return updated;
      });
      toast.success("Study session deleted.");
    } catch (err) {
      console.error("Failed to delete session:", err);
      toast.error("Failed to delete session.");
    }
  };

  const startEdit = (record) => {
    const dateStr = record.session_date || record.date;
    setEditingRecord({
      id: record.id,
      date: dateStr ? dateStr.substring(0, 10) : "",
      subject: record.subject,
      hours: record.hours || record.study_hours,
      status: record.status || "Completed",
    });
  };

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

          <RecommendationCard insights={buildStudyInsights(productivitySummary)} />

          <StudyTable 
            sessions={sessions} 
            onEdit={startEdit} 
            onDelete={handleDelete} 
          />
        </>
      )}

      {editingRecord && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'var(--bg-color, #fff)', padding: '20px', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <StudyForm 
              initialData={editingRecord} 
              onUpdate={handleUpdate} 
              onCancel={() => setEditingRecord(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Study;