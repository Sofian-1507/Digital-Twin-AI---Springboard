import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";

import StudySummary from "../components/StudySummary";
import StudyForm from "../components/StudyForm";
import StudyChart from "../components/StudyChart";
import SubjectProgress from "../components/SubjectProgress";
import RecommendationCard from "../components/RecommendationCard";
import StudyTable from "../components/StudyTable";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";
import { Input } from "../components/ui/Field";
import Button from "../components/ui/Button";
import { SkeletonStatGrid, SkeletonChart, SkeletonTable } from "../components/ui/Skeleton";
import Modal from "../components/ui/Modal";
import Drawer from "../components/ui/Drawer";

import {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  getSubjectPerformance,
} from "../services/studyService";

import { getProductivitySummary } from "../services/productivityService";

/** Builds RecommendationCard's insight strings from a ProductivitySummaryResponse. */
function buildStudyInsights(summary) {
  if (!summary) return [];

  const insights = [
    `Current productivity score: ${Math.round(
      summary.productivity_score.productivity_score
    )}%`,

    `Focus score: ${Math.round(summary.focus_score.focus_score)}% (${
      summary.focus_score.method_used === "recorded_average"
        ? "based on logged focus ratings"
        : "estimated from attendance"
    })`,

    `Studied ${Math.round(
      summary.completion_percentage.completion_percentage
    )}% of days in the last ${
      summary.completion_percentage.window_days
    } days`,
  ];

  const predicted =
    summary.performance_prediction?.predicted_productivity?.[0]
      ?.projected_score;

  if (predicted != null) {
    insights.push(
      `Predicted productivity next week: ${Math.round(predicted)}%`
    );
  }

  if (summary.performance_prediction?.predicted_exam_score != null) {
    insights.push(
      `Predicted exam score: ${Math.round(
        summary.performance_prediction.predicted_exam_score
      )}%`
    );
  }

  return insights;
}

/** Builds SubjectProgress's [{ name, progress }] list. */
function buildSubjectProgress(subjectPerformance) {
  return subjectPerformance.map((s) => ({
    name: s.subject,
    progress: Math.round(
      s.average_exam_pct ||
        s.average_quiz_pct ||
        s.average_attendance_pct ||
        0
    ),
  }));
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildWeeklyChart(sessions) {
  const totals = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  for (const s of sessions) {
    const d = new Date(s.session_date || s.created_at);
    const label = DAY_NAMES[d.getDay()];
    totals[label] += Number(s.study_hours || 0);
  }

  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
    day,
    hours: Math.round(totals[day] * 10) / 10,
  }));
}

function Study() {
  const { user } = useAuth();

  /*
   * Only STUDY-category goals are shown in the Study form.
   *
   * Example:
   *   "Complete Python Course"
   *   "Study 100 Hours"
   *   "Score 90% in Exams"
   *
   * These come directly from Profile -> Goals.
   *
   * If the user has no STUDY goal, the form still works because
   * "No Goal" is always available.
   */
  const studyGoals =
    user?.active_goals?.filter((g) => g.category === "STUDY") ?? [];

  const [sessions, setSessions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [productivitySummary, setProductivitySummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editingRecord, setEditingRecord] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  const [subjectFilter, setSubjectFilter] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const [result, summary, subjectPerformance] = await Promise.all([
          getSessions({ limit: 50 }),
          getProductivitySummary(),
          getSubjectPerformance(),
        ]);

        const data = result.data || [];

        setSessions(data);
        setTotalPages(result.total_pages || 1);
        setChartData(buildWeeklyChart(data));
        setProductivitySummary(summary);
        setSubjectProgress(buildSubjectProgress(subjectPerformance));
      } catch (err) {
        console.error("Failed to fetch study sessions:", err);
        toast.error(
          "Could not load study sessions. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessions();
  }, []);

  // Re-fetch the table whenever subject filter or page changes.
  useEffect(() => {
    if (isLoading) return;

    let cancelled = false;

    async function fetchTablePage() {
      setIsTableLoading(true);

      try {
        const result = await getSessions({
          page,
          limit: 20,
          ...(subjectFilter ? { subject: subjectFilter } : {}),
        });

        if (cancelled) return;

        const data = result.data || [];

        setSessions(data);
        setTotalPages(result.total_pages || 1);
        setChartData(buildWeeklyChart(data));
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to fetch study sessions:", err);
        toast.error(
          "Could not load study sessions. Please try again later."
        );
      } finally {
        if (!cancelled) {
          setIsTableLoading(false);
        }
      }
    }

    fetchTablePage();

    return () => {
      cancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, subjectFilter]);

  function applySubjectFilter(e) {
    e.preventDefault();

    setSubjectFilter(subjectInput.trim());
    setPage(1);
  }

  function clearSubjectFilter() {
    setSubjectInput("");
    setSubjectFilter("");
    setPage(1);
  }

  /**
   * Creates a new study session.
   *
   * linked_goal_id is passed only when the user selected a goal.
   * "No Goal" sends null.
   */
  async function addSession(formData) {
    try {
      const payload = {
        subject: formData.subject,

        study_hours:
          Number(formData.hours) +
          Number(formData.minutes || 0) / 60,

        session_type: formData.session_type,

        attendance_pct: Number(formData.attendance_pct),

        linked_goal_id: formData.linked_goal_id || null,

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
      setAddDrawerOpen(false);
    } catch (err) {
      console.error("Failed to add study session:", err);

      toast.error(
        "Failed to log study session. Please try again."
      );

      throw err;
    }
  }

  const handleUpdate = async (id, formData) => {
    try {
      const payload = {
        subject: formData.subject,

        study_hours:
          Number(formData.hours) +
          Number(formData.minutes || 0) / 60,

        session_type: formData.session_type,

        attendance_pct: Number(formData.attendance_pct),

        linked_goal_id: formData.linked_goal_id || null,

        session_date: formData.date
          ? new Date(formData.date).toISOString()
          : undefined,
      };

      const updatedRecord = await updateSession(id, payload);

      setSessions((prev) => {
        const updated = prev.map((s) =>
          s.id === id ? updatedRecord : s
        );

        setChartData(buildWeeklyChart(updated));

        return updated;
      });

      toast.success("Study session updated successfully.");
      setEditingRecord(null);
    } catch (err) {
      console.error("Failed to update session:", err);

      toast.error(
        "Failed to update study session. Please try again."
      );

      throw err;
    }
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    const id = confirmDeleteId;

    setConfirmDeleteId(null);

    try {
      await deleteSession(id);

      setSessions((prev) => {
        const updated = prev.filter((s) => s.id !== id);

        setChartData(buildWeeklyChart(updated));

        return updated;
      });

      toast.success("Study session deleted.");
    } catch (err) {
      console.error("Failed to delete session:", err);
      toast.error("Failed to delete study session.");
    }
  };

  const startEdit = (record) => {
    const dateStr = record.session_date || record.date;

    const totalHours = Number(
      record.study_hours ?? record.hours ?? 0
    );

    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);

    setEditingRecord({
      id: record.id,

      date: dateStr ? dateStr.substring(0, 10) : "",

      subject: record.subject,

      hours,

      minutes,

      session_type:
        record.session_type || "DEEP_WORK",

      attendance_pct:
        record.attendance_pct ?? 100,

      linked_goal_id:
        record.linked_goal_id || "",
    });
  };

  return (
    <div>

      {/* Header */}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Study Dashboard
        </h2>

        <Button onClick={() => setAddDrawerOpen(true)}>
          + Add Study Session
        </Button>

      </div>

      {isLoading ? (

        <div className="flex flex-col gap-5">

          <SkeletonStatGrid count={4} />

          <SkeletonChart />

          <SkeletonTable rows={6} cols={4} />

        </div>

      ) : (

        <div className="flex flex-col gap-6">

          <StudySummary
            sessions={sessions}
            productivitySummary={productivitySummary}
          />

          <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
            <StudyChart data={chartData} />
          </div>

          <SubjectProgress subjects={subjectProgress} />

          <RecommendationCard
            insights={buildStudyInsights(productivitySummary)}
          />

          {/* Subject filter */}

          <form
            className="flex flex-wrap items-center gap-3"
            onSubmit={applySubjectFilter}
          >

            <Input
              type="text"
              placeholder="Filter by subject…"
              value={subjectInput}
              onChange={(e) =>
                setSubjectInput(e.target.value)
              }
              aria-label="Filter by subject"
              className="w-auto"
            />

            <Button type="submit">
              Apply
            </Button>

            {subjectFilter && (
              <Button
                type="button"
                variant="secondary"
                onClick={clearSubjectFilter}
              >
                Clear
              </Button>
            )}

          </form>

          {isTableLoading ? (

            <SkeletonTable rows={6} cols={4} />

          ) : (

            <StudyTable
              sessions={sessions}
              onEdit={startEdit}
              onDelete={handleDelete}
            />

          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={isTableLoading}
          />

        </div>

      )}

      {/* ADD STUDY SESSION */}

      <Drawer
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        title="Add Study Session"
      >

        <StudyForm
          addSession={addSession}
          goals={studyGoals}
        />

      </Drawer>

      {/* EDIT STUDY SESSION */}

      <Modal
        open={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title="Edit Study Session"
        maxWidth="max-w-xl"
      >

        <StudyForm
          initialData={editingRecord}
          onUpdate={handleUpdate}
          goals={studyGoals}
          onCancel={() => setEditingRecord(null)}
        />

      </Modal>

      {/* DELETE CONFIRMATION */}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Study Session"
        message="Are you sure you want to delete this session? This action cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />

    </div>
  );
}

export default Study;