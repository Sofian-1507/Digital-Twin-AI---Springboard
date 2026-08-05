import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import HabitSummary from "../components/HabitSummary";
import HabitForm from "../components/HabitForm";
import HabitChart from "../components/HabitChart";
import HabitProgress from "../components/HabitProgress";
import HabitTable from "../components/HabitTable";
import LifestyleRecommendation from "../components/LifestyleRecommendation";

import { getHabitLogs, logDailyHabit, deleteHabitLog } from "../services/habitService";
import { getHabitTrend, getHabitAnalyticsSummary } from "../services/habitAnalyticsService";

import "../styles/Habits.css";

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
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

  const streakInsight = `🔥 Current streak: ${summary.habit_streak.current_streak} day${
    summary.habit_streak.current_streak === 1 ? "" : "s"
  } (longest: ${summary.habit_streak.longest_streak})`;

  const negativeInsights = summary.negative_habits.habits.map(
    (h) => `⚠️ ${capitalize(h.habit.replace("_", " "))}: avg ${h.average_value} ${h.unit}. ${h.detail}`
  );

  const positiveInsights = summary.positive_habits.habits.map(
    (h) => `✅ ${capitalize(h.habit.replace("_", " "))} is on track — avg ${h.average_value} ${h.unit}.`
  );

  return [streakInsight, ...negativeInsights, ...positiveInsights].slice(0, 5);
}

function Habits() {
  const [habitList, setHabitList] = useState([]);
  const [habitChartData, setHabitChartData] = useState([]);
  const [habitAnalyticsSummary, setHabitAnalyticsSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHabits() {
      try {
        const [result, trend, summary] = await Promise.all([
          getHabitLogs({ limit: 30 }),
          getHabitTrend({ dailyDays: 7 }),
          getHabitAnalyticsSummary(),
        ]);
        setHabitList(result.data || []);
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
      const newRecord = await logDailyHabit(payload);
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
      toast.error("Failed to log habit. Please try again.");
      throw err;
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this habit log?")) return;
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
        <p>Loading habits…</p>
      ) : (
        <>
          <HabitSummary habits={habitList} />

          <HabitForm addHabit={addHabit} />

          <HabitChart data={habitChartData} />

          <HabitProgress habits={habitList} />

          <LifestyleRecommendation insights={buildLifestyleInsights(habitAnalyticsSummary)} />

          <HabitTable habits={habitList} onDelete={handleDelete} />
        </>
      )}
    </>
  );
}

export default Habits;