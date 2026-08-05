import { StatGrid, StatTile } from "./ui/StatTile";

function HabitSummary({ habits }) {
  const totalWater = habits.reduce(
    (sum, item) => sum + Number(item.water),
    0
  );

  const averageSleep = (
    habits.reduce(
      (sum, item) => sum + Number(item.sleep),
      0
    ) / habits.length
  ).toFixed(1);

  const totalExercise = habits.reduce(
    (sum, item) => sum + Number(item.exercise),
    0
  );

  const moodScore =
    habits.filter(
      (item) =>
        item.mood === "Happy" ||
        item.mood === "Excellent"
    ).length;

  return (
    <StatGrid>
      <StatTile label="Water Intake" value={`${totalWater} L`} />
      <StatTile label="Average Sleep" value={`${averageSleep} hrs`} />
      <StatTile label="Total Exercise" value={`${totalExercise} min`} />
      <StatTile label="Positive Mood" value={`${moodScore}/${habits.length}`} />
    </StatGrid>
  );
}

export default HabitSummary;
