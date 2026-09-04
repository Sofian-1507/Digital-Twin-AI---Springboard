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
import Button from "../components/ui/Button";
import Drawer from "../components/ui/Drawer";
import {
  SkeletonStatGrid,
  SkeletonChart,
  SkeletonTable,
} from "../components/ui/Skeleton";
import {
  getHabitLogs,
  logDailyHabit,
  deleteHabitLog,
} from "../services/habitService";
import { getUser } from "../services/userService";
import {
  getHabitTrend,
  getHabitAnalyticsSummary,
} from "../services/habitAnalyticsService";
import { getApiErrorMessage } from "../utils/apiError";

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const MOOD_LABELS = {
  5: "Excellent",
  4: "Happy",
  3: "Normal",
  2: "Sad",
  1: "Sad",
};

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

function buildHabitChartData(dailyTrend) {
  return dailyTrend.map((point) => ({
    day: new Date(point.date).toLocaleDateString(undefined, {
      weekday: "short",
    }),
    score: Math.round(point.habit_score),
  }));
}

function buildLifestyleInsights(summary) {
  if (!summary) return [];

  const streakInsight = `Current streak: ${
    summary.habit_streak.current_streak
  } day${
    summary.habit_streak.current_streak === 1 ? "" : "s"
  } (longest: ${summary.habit_streak.longest_streak})`;

  const negativeInsights = summary.negative_habits.habits.map(
    (h) =>
      `${capitalize(h.habit.replace("_", " "))}: avg ${h.average_value} ${h.unit}. ${h.detail}`
  );

  const positiveInsights = summary.positive_habits.habits.map(
    (h) =>
      `${capitalize(h.habit.replace("_", " "))} is on track — avg ${h.average_value} ${h.unit}.`
  );

  const missedInsight =
    summary.missed_habits.missed_days > 0
      ? [
          `Missed logging on ${summary.missed_habits.missed_days} of the last ${summary.missed_habits.window_days} days.`,
        ]
      : [];

  return [
    streakInsight,
    ...missedInsight,
    ...negativeInsights,
    ...positiveInsights,
  ].slice(0, 6);
}

function Habits() {
  const [user, setUser] = useState(null);

  const [habitList, setHabitList] = useState([]);
  const [habitChartData, setHabitChartData] = useState([]);
  const [habitAnalyticsSummary, setHabitAnalyticsSummary] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);

  /*
   * Get all active HABIT goals.
   */
  const habitGoals =
    user?.active_goals?.filter(
      (goal) => goal.category === "HABIT"
    ) || [];

  useEffect(() => {
    async function fetchHabits() {
      try {
        const [result, trend, summary, userData] =
          await Promise.all([
            getHabitLogs({ limit: 30 }),
            getHabitTrend({ dailyDays: 7 }),
            getHabitAnalyticsSummary(),
            getUser(),
          ]);

        setHabitList(
          (result.data || []).map(toDisplayHabit)
        );

        setTotalPages(result.total_pages || 1);

        setHabitChartData(
          buildHabitChartData(trend.daily || [])
        );

        setHabitAnalyticsSummary(summary);

        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch habit logs:", err);

        toast.error(
          "Could not load habit logs. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchHabits();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    let cancelled = false;

    async function fetchTablePage() {
      setIsTableLoading(true);

      try {
        const result = await getHabitLogs({
          page,
          limit: 30,
        });

        if (cancelled) return;

        setHabitList(
          (result.data || []).map(toDisplayHabit)
        );

        setTotalPages(result.total_pages || 1);
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to fetch habit logs:", err);

        toast.error(
          "Could not load habit logs. Please try again later."
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
  }, [page]);

  async function addHabit(formData) {
    try {
      const moodMap = {
        Excellent: 5,
        Happy: 4,
        Normal: 3,
        Sad: 2,
      };

      const payload = {
        sleep_hours: Number(formData.sleep),

        exercise_minutes: Number(formData.exercise),

        water_intake_liters: Number(formData.water),

        screen_time_hours: Number(
          formData.screenTime || 0
        ),

        mood_rating: moodMap[formData.mood] ?? 3,

        /*
         * Habit Goal
         */
        linked_goal_id:
          formData.linked_goal_id || undefined,

        log_date: formData.date
          ? new Date(formData.date).toISOString()
          : undefined,
      };

      const newRecord = toDisplayHabit(
        await logDailyHabit(payload)
      );

      const trend = await getHabitTrend({
        dailyDays: 7,
      });

      setHabitChartData(
        buildHabitChartData(trend.daily || [])
      );

      setHabitList((prev) => {
        const sameDay = (h) =>
          new Date(h.log_date).toDateString() ===
          new Date(newRecord.log_date).toDateString();

        if (prev.some(sameDay)) {
          return prev.map((h) =>
            sameDay(h) ? newRecord : h
          );
        }

        return [newRecord, ...prev];
      });

      toast.success("Habit log saved successfully.");

      setAddDrawerOpen(false);
    } catch (err) {
      console.error("Failed to add habit log:", err);

      toast.error(
        getApiErrorMessage(
          err,
          "Failed to log habit. Please try again."
        )
      );

      throw err;
    }
  }

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    const id = confirmDeleteId;

    setConfirmDeleteId(null);

    try {
      await deleteHabitLog(id);

      setHabitList((prev) =>
        prev.filter((h) => h.id !== id)
      );

      toast.success("Habit log deleted.");
    } catch (err) {
      console.error(
        "Failed to delete habit log:",
        err
      );

      toast.error("Failed to delete habit log.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Habit Dashboard
        </h2>

        <Button
          onClick={() => setAddDrawerOpen(true)}
        >
          + Add Today's Habits
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-5">
          <SkeletonStatGrid count={4} />
          <SkeletonChart />
          <SkeletonTable rows={6} cols={5} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <HabitSummary habits={habitList} />

          <HabitChart data={habitChartData} />

          {habitGoals.length > 0 && (
            <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Habit Goals
              </h3>

              <div className="mt-3 flex flex-col gap-3">
                {habitGoals.map((goal) => (
                  <div
                    key={goal.goal_id}
                    className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50"
                  >
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {goal.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Progress:{" "}
                      {Number(
                        goal.current_value
                      ).toLocaleString()}{" "}
                      /{" "}
                      {Number(
                        goal.target_value
                      ).toLocaleString()}{" "}
                      {goal.unit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <HabitProgress habits={habitList} />

          <LifestyleRecommendation
            insights={buildLifestyleInsights(
              habitAnalyticsSummary
            )}
          />

          {isTableLoading ? (
            <SkeletonTable rows={6} cols={5} />
          ) : (
            <HabitTable
              habits={habitList}
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

      <Drawer
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        title="Add Today's Habits"
      >
        {/* Pass HABIT goals to HabitForm */}
        <HabitForm
          addHabit={addHabit}
          goals={habitGoals}
        />
      </Drawer>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Habit Log"
        message="Are you sure you want to delete this habit log? This action cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

export default Habits;