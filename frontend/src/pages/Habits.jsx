import { useState } from "react";

import HabitSummary from "../components/HabitSummary";
import HabitForm from "../components/HabitForm";
import HabitChart from "../components/HabitChart";
import HabitProgress from "../components/HabitProgress";
import HabitTable from "../components/HabitTable";
import LifestyleRecommendation from "../components/LifestyleRecommendation";

import { habits } from "../data/habitData";

import "../styles/Habits.css";

function Habits() {
  const [habitList, setHabitList] = useState(habits);

  function addHabit(habit) {
    setHabitList([
      {
        id: Date.now(),
        ...habit,
      },
      ...habitList,
    ]);
  }

  return (
  <>
    <HabitSummary habits={habitList} />

    <HabitForm addHabit={addHabit} />

    <HabitChart />

    <HabitProgress habits={habitList} />

    <LifestyleRecommendation />

    <HabitTable habits={habitList} />
  </>
);
}


export default Habits;