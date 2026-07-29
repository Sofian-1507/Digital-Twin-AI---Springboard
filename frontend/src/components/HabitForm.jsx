import { useState } from "react";

function HabitForm({ addHabit }) {

  const [formData, setFormData] = useState({
    date: "",
    water: "",
    sleep: "",
    exercise: "",
    mood: "Happy",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.water ||
      !formData.sleep ||
      !formData.exercise
    ) {
      alert("Please fill all fields.");
      return;
    }

    addHabit(formData);

    setFormData({
      date: "",
      water: "",
      sleep: "",
      exercise: "",
      mood: "Happy",
    });
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
          name="water"
          placeholder="Water (L)"
          value={formData.water}
          onChange={handleChange}
        />

        <input
          type="number"
          name="sleep"
          placeholder="Sleep (hrs)"
          value={formData.sleep}
          onChange={handleChange}
        />

        <input
          type="number"
          name="exercise"
          placeholder="Exercise (min)"
          value={formData.exercise}
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

      <button className="habit-btn">
        Save Habit
      </button>

    </form>
  );
}

export default HabitForm;