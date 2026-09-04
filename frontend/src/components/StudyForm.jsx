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
  quiz_marks: "",
  max_quiz_marks: "",
  exam_marks: "",
  max_exam_marks: "",
  focus_score: "",
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
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.date) errors.date = "Date is required.";
    if (!formData.subject) errors.subject = "Subject is required.";

    // Validated against the COMBINED duration (hours + minutes), matching what
    // Study.jsx actually sends as study_hours — checking `hours` alone rejected
    // legitimate short sessions like "0 hours, 30 minutes" even though 0.5h is
    // well within the backend's accepted range (0.1–24).
    const totalHours = Number(formData.hours || 0) + Number(formData.minutes || 0) / 60;
    if (totalHours <= 0 || totalHours > 24) {
      errors.hours = "Duration must be between 6 minutes (0.1h) and 24 hours.";
    }

    if (!formData.session_type) errors.session_type = "Select a session type.";

    const attendance = Number(formData.attendance_pct);
    if (Number.isNaN(attendance) || attendance < 0 || attendance > 100) {
      errors.attendance_pct = "Attendance must be between 0 and 100.";
    }

    if (formData.quiz_marks !== "" && formData.quiz_marks != null && formData.max_quiz_marks === "") {
      errors.max_quiz_marks = "Enter the max quiz marks too, so the percentage can be computed.";
    }
    if (formData.exam_marks !== "" && formData.exam_marks != null && formData.max_exam_marks === "") {
      errors.max_exam_marks = "Enter the max exam marks too, so the percentage can be computed.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Please fix the highlighted fields.");
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
          error={fieldErrors.date}
          required
        />

        <Input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          error={fieldErrors.subject}
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
          error={fieldErrors.hours}
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
          error={fieldErrors.session_type}
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
          error={fieldErrors.attendance_pct}
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

      <p className="mb-3 mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        Quiz / exam scores (optional)
      </p>

      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2">

        <Input
          type="number"
          name="quiz_marks"
          placeholder="Quiz marks"
          min="0"
          step="0.01"
          value={formData.quiz_marks}
          onChange={handleChange}
        />

        <Input
          type="number"
          name="max_quiz_marks"
          placeholder="Out of (max quiz marks)"
          min="0"
          step="0.01"
          value={formData.max_quiz_marks}
          onChange={handleChange}
          error={fieldErrors.max_quiz_marks}
        />

        <Input
          type="number"
          name="exam_marks"
          placeholder="Exam marks"
          min="0"
          step="0.01"
          value={formData.exam_marks}
          onChange={handleChange}
        />

        <Input
          type="number"
          name="max_exam_marks"
          placeholder="Out of (max exam marks)"
          min="0"
          step="0.01"
          value={formData.max_exam_marks}
          onChange={handleChange}
          error={fieldErrors.max_exam_marks}
        />

        <Input
          type="number"
          name="focus_score"
          placeholder="Focus score (0-100)"
          min="0"
          max="100"
          step="1"
          value={formData.focus_score}
          onChange={handleChange}
        />

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