import ProgressList from "./ui/ProgressList";

function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function HabitProgress({ habits }) {
  // habits is sorted most-recent-first, so if the newest entry isn't today,
  // nothing is — checking habits[0] is enough. Without this check, this card
  // silently showed yesterday's (or older) data mislabeled as "Today's Progress"
  // whenever the user hadn't logged anything yet today.
  const latestHabit = habits[0];
  const hasTodayEntry = latestHabit && isToday(latestHabit.log_date);

  if (!hasTodayEntry) {
    return (
      <ProgressList
        title="Today's Progress"
        items={[]}
        emptyMessage="No habits logged today yet."
      />
    );
  }

  const items = [
    { key: "water", label: "Water Intake", value: (Number(latestHabit.water) / 3) * 100, color: "bg-amber-600" },
    { key: "sleep", label: "Sleep", value: (Number(latestHabit.sleep) / 8) * 100, color: "bg-indigo-600" },
    { key: "exercise", label: "Exercise", value: (Number(latestHabit.exercise) / 60) * 100, color: "bg-emerald-600" },
  ];

  return <ProgressList title="Today's Progress" items={items} />;
}

export default HabitProgress;
