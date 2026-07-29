import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import HabitSummary from "../components/HabitSummary";
import HabitForm from "../components/HabitForm";
import HabitChart from "../components/HabitChart";
import HabitProgress from "../components/HabitProgress";
import HabitTable from "../components/HabitTable";
import LifestyleRecommendation from "../components/LifestyleRecommendation";

import { getHabitLogs, logDailyHabit } from "../services/habitService";

import "../styles/Habits.css";

function Habits() {
  const [habitList, setHabitList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHabits() {
      try {
        const result = await getHabitLogs({ limit: 30 });
        setHabitList(result.data || []);
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
    const moodMap = { Excellent: 5, Happy: 4, Normal: 3, Sad: 2 };
    const payload = {
      sleep_hours:         Number(formData.sleep),
      exercise_minutes:    Number(formData.exercise),
      water_intake_liters: Number(formData.water),
      screen_time_hours:   0,
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
  }

  return (
    <>
      {isLoading ? (
        <p>Loading habits…</p>
      ) : (
        <>
          <HabitSummary habits={habitList} />

          <HabitForm addHabit={addHabit} />

          <HabitChart />

          <HabitProgress habits={habitList} />

          <LifestyleRecommendation />

          <HabitTable habits={habitList} />
        </>
      )}
    </>
  );
}

export default Habits;