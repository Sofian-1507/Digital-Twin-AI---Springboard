import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import HabitSummary from "../components/HabitSummary";
import HabitForm from "../components/HabitForm";
import HabitChart from "../components/HabitChart";
import HabitProgress from "../components/HabitProgress";
import HabitTable from "../components/HabitTable";
import LifestyleRecommendation from "../components/LifestyleRecommendation";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";
import { SkeletonStatGrid, SkeletonChart, SkeletonTable } from "../components/ui/Skeleton";

import { getHabitLogs, logDailyHabit, deleteHabitLog } from "../services/habitService";
import { getHabitTrend, getHabitAnalyticsSummary } from "../services/habitAnalyticsService";
import { getApiErrorMessage } from "../utils/apiError";

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const MOOD_LABELS = { 5: "Excellent", 4: "Happy", 3: "Normal", 2: "Sad", 1: "Sad" };

/**
 * Bug fix: HabitSummary/HabitProgress/HabitTable read display fields
 * (date/water/sleep/exercise/mood) that don't exist on the raw
 * HabitRecordResponse (log_date/water_intake_liters/sleep_hours/
 * exercise_minutes/mood_rating) — they were rendering blank/undefined.
 * This maps the real API shape onto the fields those components expect,
 * without changing what those components (or the backend) look like.
 */
function toDisplayHabit(record) {
  return {
    ...record,
    date: new Date(record.log_date).toLocaleDateString(),
    water: record.water_intake_liters,
    sleep: record.sleep_hours,
    exercise: record.exercise_minutes,
    mood: MOOD_LABELS[record.mood_rating] ?? "Normal",
  };
}

/** Builds HabitChart's [{ day, score }] series from the last 7 daily trend points. */
function buildHabitChartData(dailyTrend) {
  return dailyTrend.map((point) => ({
    day: new Date(point.date).toLocaleDateString(undefined, { weekday: "short" }),
    score: Math.round(point.habit_score),
  }));
}

/** Builds LifestyleRecommendation's insight strings from a HabitAnalyticsSummaryResponse. */
function buildLifestyleInsights(summary) {
  if (!summary) return [];

  const streakInsight = `Current streak: ${summary.habit_streak.current_streak} day${
    summary.habit_streak.current_streak === 1 ? "" : "s"
  } (longest: ${summary.habit_streak.longest_streak})`;

  const negativeInsights = summary.negative_habits.habits.map(
    (h) => `${capitalize(h.habit.replace("_", " "))}: avg ${h.average_value} ${h.unit}. ${h.detail}`
  );

  const positiveInsights = summary.positive_habits.habits.map(
    (h) => `${capitalize(h.habit.replace("_", " "))} is on track — avg ${h.average_value} ${h.unit}.`
  );

  const missedInsight = summary.missed_habits.missed_days > 0
    ? [`Missed logging on ${summary.missed_habits.missed_days} of the last ${summary.missed_habits.window_days} days.`]
    : [];

  return [streakInsight, ...missedInsight, ...negativeInsights, ...positiveInsights].slice(0, 6);
}

function Habits() {
  const [habitList, setHabitList] = useState([]);
  const [habitChartData, setHabitChartData] = useState([]);
  const [habitAnalyticsSummary, setHabitAnalyticsSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);

  useEffect(() => {
    async function fetchHabits() {
      try {
        const [result, trend, summary] = await Promise.all([
          getHabitLogs({ limit: 30 }),
          getHabitTrend({ dailyDays: 7 }),
          getHabitAnalyticsSummary(),
        ]);
        setHabitList((result.data || []).map(toDisplayHabit));
        setTotalPages(result.total_pages || 1);
        setHabitChartData(buildHabitChartData(trend.daily || []));
        setHabitAnalyticsSummary(summary);
      } catch (err) {
        console.error("Failed to fetch habit logs:", err);
        toast.error("Could not load habit logs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchHabits();
  }, []);

  // Re-fetch the table page whenever the page changes (skips first render,
  // which is already covered by the initial fetch above).
  useEffect(() => {
    if (isLoading) return;
    // Guards against an older in-flight request resolving after a newer one (e.g. rapid
    // page-clicks) and overwriting fresher data.
    let cancelled = false;
    async function fetchTablePage() {
      setIsTableLoading(true);
      try {
        const result = await getHabitLogs({ page, limit: 30 });
        if (cancelled) return;
        setHabitList((result.data || []).map(toDisplayHabit));
        setTotalPages(result.total_pages || 1);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch habit logs:", err);
        toast.error("Could not load habit logs. Please try again later.");
      } finally {
        if (!cancelled) setIsTableLoading(false);
      }
    }
    fetchTablePage();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /**
   * Posts today's habit log to the backend (upsert) and updates local state.
   * HabitForm passes { date, water, sleep, exercise, mood }.
   */
  async function addHabit(formData) {
    try {
      const moodMap = { Excellent: 5, Happy: 4, Normal: 3, Sad: 2 };
      const payload = {
        sleep_hours:         Number(formData.sleep),
        exercise_minutes:    Number(formData.exercise),
        water_intake_liters: Number(formData.water),
        screen_time_hours:   Number(formData.screenTime || 0),
        mood_rating:         moodMap[formData.mood] ?? 3,
        log_date: formData.date
          ? new Date(formData.date).toISOString()
          : undefined,
      };
      const newRecord = toDisplayHabit(await logDailyHabit(payload));
      // Upsert: replace if same date, else prepend
      setHabitList((prev) => {
        const sameDay = (h) =>
          new Date(h.log_date).toDateString() ===
          new Date(newRecord.log_date).toDateString();
        if (prev.some(sameDay)) {
          return prev.map((h) => (sameDay(h) ? newRecord : h));
        }
        return [newRecord, ...prev];
      });
      toast.success("Habit log saved successfully.");
    } catch (err) {
      console.error("Failed to add habit log:", err);
      toast.error(getApiErrorMessage(err, "Failed to log habit. Please try again."));
      throw err;
    }
  }

  const handleDelete = (id) => setConfirmDeleteId(id);

  const confirmDelete = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      await deleteHabitLog(id);
      setHabitList((prev) => prev.filter(h => h.id !== id));
      toast.success("Habit log deleted.");
    } catch (err) {
      console.error("Failed to delete habit log:", err);
      toast.error("Failed to delete habit log.");
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col gap-5">
          <SkeletonStatGrid count={4} />
          <SkeletonChart />
          <SkeletonTable rows={6} cols={5} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <HabitSummary habits={habitList} />

          <HabitForm addHabit={addHabit} />

          <HabitChart data={habitChartData} />

          <HabitProgress habits={habitList} />

          <LifestyleRecommendation insights={buildLifestyleInsights(habitAnalyticsSummary)} />

          {isTableLoading ? (
            <SkeletonTable rows={6} cols={5} />
          ) : (
            <HabitTable habits={habitList} onDelete={handleDelete} />
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} disabled={isTableLoading} />
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Habit Log"
        message="Are you sure you want to delete this habit log? This action cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </>
  );
}

export default Habits;