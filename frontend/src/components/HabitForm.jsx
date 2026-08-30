import { useState } from "react";
import { toast } from "react-toastify";
import { Input, Select } from "./ui/Field";
import Button from "./ui/Button";

function HabitForm({ addHabit, goals = [] }) {
  const [formData, setFormData] = useState({
    date: "",
    water: "",
    sleep: "",
    exercise: "",
    screenTime: "",
    mood: "Happy",
    linked_goal_id: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.water ||
      !formData.sleep ||
      !formData.exercise
    ) {
      toast.error("Please fill in all habit fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addHabit(formData);

      setFormData({
        date: "",
        water: "",
        sleep: "",
        exercise: "",
        screenTime: "",
        mood: "Happy",
        linked_goal_id: "",
      });
    } catch (err) {
      console.error("HabitForm submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2">

        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <Input
          type="number"
          step="0.1"
          min="0"
          max="20"
          name="water"
          placeholder="Water (L)"
          value={formData.water}
          onChange={handleChange}
        />

        <Input
          type="number"
          step="0.5"
          min="0"
          max="24"
          name="sleep"
          placeholder="Sleep (hrs)"
          value={formData.sleep}
          onChange={handleChange}
        />

        <Input
          type="number"
          min="0"
          max="1440"
          name="exercise"
          placeholder="Exercise (min)"
          value={formData.exercise}
          onChange={handleChange}
        />

        <Input
          type="number"
          step="0.5"
          min="0"
          max="24"
          name="screenTime"
          placeholder="Screen Time (hrs)"
          value={formData.screenTime}
          onChange={handleChange}
        />

        <Select
          name="mood"
          value={formData.mood}
          onChange={handleChange}
        >
          <option value="Excellent">Excellent</option>
          <option value="Happy">Happy</option>
          <option value="Normal">Normal</option>
          <option value="Sad">Sad</option>
        </Select>

        {/* Habit Goal */}
        <Select
          name="linked_goal_id"
          value={formData.linked_goal_id}
          onChange={handleChange}
        >
          <option value="">No Goal</option>

          {goals.map((goal) => (
            <option
              key={goal.goal_id}
              value={goal.goal_id}
            >
              {goal.title}
            </option>
          ))}
        </Select>

      </div>

      <Button
        type="submit"
        className="mt-5"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Habit"}
      </Button>
    </form>
  );
}

export default HabitForm;