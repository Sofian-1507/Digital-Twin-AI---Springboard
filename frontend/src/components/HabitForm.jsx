import { useState } from "react";
import { toast } from "react-toastify";

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
    <form
      className="habit-form"
      onSubmit={submitHandler}
    >

      <h3>Add Today's Habit</h3>

      <div className="habit-form-grid">

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.1"
          min="0"
          max="20"
          name="water"
          placeholder="Water (L)"
          value={formData.water}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.5"
          min="0"
          max="24"
          name="sleep"
          placeholder="Sleep (hrs)"
          value={formData.sleep}
          onChange={handleChange}
        />

        <input
          type="number"
          min="0"
          max="1440"
          name="exercise"
          placeholder="Exercise (min)"
          value={formData.exercise}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.5"
          min="0"
          max="24"
          name="screenTime"
          placeholder="Screen Time (hrs)"
          value={formData.screenTime}
          onChange={handleChange}
        />

        <select
          name="mood"
          value={formData.mood}
          onChange={handleChange}
        >
          <option>Excellent</option>
          <option>Happy</option>
          <option>Normal</option>
          <option>Sad</option>
        </select>

      </div>

      <button className="habit-btn" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Habit"}
      </button>

    </form>
  );
}

export default HabitForm;