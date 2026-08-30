import { useState } from "react";
import { toast } from "react-toastify";
import { Input, Select } from "./ui/Field";
import Button from "./ui/Button";

const SESSION_TYPES = [
  { value: "DEEP_WORK", label: "Deep Work" },
  { value: "REVIEW", label: "Review" },
  { value: "LECTURE", label: "Lecture" },
  { value: "PRACTICE_EXAM", label: "Practice Exam" },
  { value: "ASSIGNMENT", label: "Assignment" },
  { value: "RESEARCH", label: "Research" },
];

const DEFAULT_FORM = {
  date: "",
  subject: "",
  hours: "",
  minutes: "",
  session_type: "",
  attendance_pct: "",
  linked_goal_id: "",
};

function StudyForm({
  addSession,
  goals = [],
  initialData = null,
  onUpdate = null,
  onCancel = null,
}) {
  const [formData, setFormData] = useState(
    initialData
      ? {
          ...initialData,
          linked_goal_id: initialData.linked_goal_id || "",
        }
      : DEFAULT_FORM
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.subject || !formData.hours) {
      toast.error("Please fill in Date, Subject, and Hours.");
      return;
    }

    if (Number(formData.hours) <= 0 || Number(formData.hours) > 24) {
      toast.error("Hours must be between 0.1 and 24.");
      return;
    }

    if (!formData.session_type) {
      toast.error("Please select a session type.");
      return;
    }

    const attendance = Number(formData.attendance_pct);

    if (
      Number.isNaN(attendance) ||
      attendance < 0 ||
      attendance > 100
    ) {
      toast.error("Attendance must be between 0 and 100.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (initialData && onUpdate) {
        await onUpdate(initialData.id, formData);
      } else {
        await addSession(formData);
        setFormData(DEFAULT_FORM);
      }
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
          required
        />

        <Input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />

        <Input
          type="number"
          name="hours"
          placeholder="Hours"
          min="0"
          max="24"
          step="1"
          value={formData.hours}
          onChange={handleChange}
          required
        />

        <Input
          type="number"
          name="minutes"
          placeholder="Minutes (0–59)"
          min="0"
          max="59"
          step="1"
          value={formData.minutes}
          onChange={handleChange}
        />

        <Select
          name="session_type"
          value={formData.session_type}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Type
          </option>

          {SESSION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>

        <Input
          type="number"
          name="attendance_pct"
          placeholder="Attendance %"
          min="0"
          max="100"
          step="1"
          value={formData.attendance_pct}
          onChange={handleChange}
          required
        />

        <Select
          name="linked_goal_id"
          value={formData.linked_goal_id}
          onChange={handleChange}
        >
          <option value="">No Goal</option>

          {goals.map((goal) => (
            <option key={goal.goal_id} value={goal.goal_id}>
              {goal.title}
            </option>
          ))}
        </Select>

      </div>

      <div className="mt-5 flex gap-2.5">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Session"
            : "Add Session"}
        </Button>

        {initialData && onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default StudyForm;