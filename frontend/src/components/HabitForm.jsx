import { useState } from "react";
import { toast } from "react-toastify";
import { Input, Select } from "./ui/Field";
import Button from "./ui/Button";

function HabitForm({ addHabit }) {

  const [formData, setFormData] = useState({
    date: "",
    water: "",
    sleep: "",
    exercise: "",
    screenTime: "",
    mood: "Happy",
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

    if (!formData.date || !formData.water || !formData.sleep || !formData.exercise) {
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
      });
      // The parent handler (Habits.jsx) handles the success toast now
    } catch (err) {
      // Parent (Habits.jsx) handles the error toast.
      // Log here for debugging in case of unexpected errors.
      console.error("HabitForm submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm" onSubmit={submitHandler}>

      <h3 className="mb-5 text-lg font-semibold text-slate-800 dark:text-slate-100">Add Today's Habit</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">

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

        <Select name="mood" value={formData.mood} onChange={handleChange}>
          <option>Excellent</option>
          <option>Happy</option>
          <option>Normal</option>
          <option>Sad</option>
        </Select>

      </div>

      <Button className="mt-5" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Habit"}
      </Button>

    </form>
  );
}

export default HabitForm;
