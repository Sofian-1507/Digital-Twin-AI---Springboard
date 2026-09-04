import { useState } from "react";
import { toast } from "react-toastify";
import { Input, Select } from "./ui/Field";
import Button from "./ui/Button";
import { getApiErrorMessage } from "../utils/apiError";

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
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function submit(e) {
    e.preventDefault();

    const errors = {};
    if (!formData.title) errors.title = "Title is required.";
    if (!formData.target_value) errors.target_value = "Target value is required.";
    else if (Number(formData.target_value) <= 0) errors.target_value = "Must be greater than 0.";
    if (!formData.unit) errors.unit = "Unit is required.";
    if (!formData.target_date) errors.target_date = "Target date is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Please fix the highlighted fields.");
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
    } catch (err) {
      toast.error(getApiErrorMessage(
        err, initialData ? "Failed to update goal. Please try again." : "Failed to add goal. Please try again."
      ));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm" onSubmit={submit}>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Goal Title"
          error={fieldErrors.title}
          required
        />

        <Select name="category" value={formData.category} onChange={handleChange}>
          <option value="FINANCE">Finance</option>
          <option value="STUDY">Study</option>
          <option value="HABIT">Habit</option>
          <option value="FITNESS">Fitness</option>
          <option value="CAREER">Career</option>
        </Select>

        <Input
          name="target_value"
          type="number"
          min="0.01"
          step="0.01"
          value={formData.target_value}
          onChange={handleChange}
          placeholder="Target Value"
          error={fieldErrors.target_value}
          required
        />

        {initialData && (
          <Input
            name="current_value"
            type="number"
            min="0"
            step="0.01"
            value={formData.current_value ?? ""}
            onChange={handleChange}
            placeholder="Current Value"
          />
        )}

        <Input
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          placeholder="Unit (e.g. USD, hours)"
          error={fieldErrors.unit}
          required
        />

        <Input
          name="target_date"
          type="date"
          value={formData.target_date}
          onChange={handleChange}
          error={fieldErrors.target_date}
          required
        />

      </div>

      <div className="mt-6 flex gap-3">

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Goal" : "Add Goal"}
        </Button>

        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}

      </div>

    </form>
  );
}

export default GoalForm;
