import ProgressList from "./ui/ProgressList";

function HabitProgress({ habits }) {
  if (habits.length === 0) {
    return <ProgressList title="Today's Progress" items={[]} emptyMessage="No habit data available yet." />;
  }

  const latestHabit = habits[0];

  const items = [
    { key: "water", label: "💧 Water Intake", value: (Number(latestHabit.water) / 3) * 100, color: "bg-sky-500" },
    { key: "sleep", label: "😴 Sleep", value: (Number(latestHabit.sleep) / 8) * 100, color: "bg-indigo-600" },
    { key: "exercise", label: "🏃 Exercise", value: (Number(latestHabit.exercise) / 60) * 100, color: "bg-emerald-500" },
  ];

  return <ProgressList title="Today's Progress" items={items} />;
}

export default HabitProgress;
