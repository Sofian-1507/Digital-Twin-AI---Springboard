import { useState } from "react";
import { toast } from "react-toastify";
import "../styles/Profile.css";

/**
 * GoalForm — creates a new active goal, or edits an existing one when
 * `initialData`/`onUpdate` are supplied (same convention as StudyForm/TransactionForm).
 * Maps to POST /api/v1/users/me/goals (create) or PATCH /api/v1/users/me/goals/{id} (edit).
 */
function GoalForm({ onSave, initialData = null, onUpdate = null, onCancel = null }) {

  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      category: "FINANCE",
      target_value: "",
      unit: "",
      target_date: "",
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function submit(e) {
    e.preventDefault();

    if (!formData.title || !formData.target_value || !formData.unit || !formData.target_date) {
      toast.error("Title, Target Value, Unit, and Target Date are required.");
      return;
    }
    if (Number(formData.target_value) <= 0) {
      toast.error("Target Value must be greater than 0.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData && onUpdate) {
        await onUpdate(initialData.goal_id, {
          title: formData.title,
          category: formData.category,
          target_value: Number(formData.target_value),
          current_value: formData.current_value !== "" && formData.current_value != null
            ? Number(formData.current_value)
            : undefined,
          unit: formData.unit,
          target_date: new Date(formData.target_date).toISOString(),
        });
      } else {
        await onSave({
          title: formData.title,
          category: formData.category,
          target_value: Number(formData.target_value),
          unit: formData.unit,
          target_date: new Date(formData.target_date).toISOString(),
        });
      }
      // Success toast is shown by Profile.jsx to avoid duplicates
    } catch {
      toast.error(initialData ? "Failed to update goal. Please try again." : "Failed to add goal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="profile-form"
      onSubmit={submit}
    >

      <div className="form-grid">

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Goal Title"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="FINANCE">Finance</option>
          <option value="STUDY">Study</option>
          <option value="HABIT">Habit</option>
          <option value="FITNESS">Fitness</option>
          <option value="CAREER">Career</option>
        </select>

        <input
          name="target_value"
          type="number"
          min="0.01"
          step="0.01"
          value={formData.target_value}
          onChange={handleChange}
          placeholder="Target Value"
          required
        />

        {initialData && (
          <input
            name="current_value"
            type="number"
            min="0"
            step="0.01"
            value={formData.current_value ?? ""}
            onChange={handleChange}
            placeholder="Current Value"
          />
        )}

        <input
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          placeholder="Unit (e.g. USD, hours)"
          required
        />

        <input
          name="target_date"
          type="date"
          value={formData.target_date}
          onChange={handleChange}
          required
        />

      </div>

      <div className="button-group">

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Goal" : "Add Goal"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}

      </div>

    </form>
  );
}

export default GoalForm;
