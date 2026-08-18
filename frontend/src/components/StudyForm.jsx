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
  session_type: "DEEP_WORK",
  attendance_pct: 100,
};

function StudyForm({ addSession, initialData = null, onUpdate = null, onCancel = null }) {
  const [formData, setFormData] = useState(initialData || DEFAULT_FORM);
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

    const attendance = Number(formData.attendance_pct);
    if (Number.isNaN(attendance) || attendance < 0 || attendance > 100) {
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
    <form className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm" onSubmit={submitHandler}>
      <h3 className="mb-5 text-lg font-semibold text-slate-800 dark:text-slate-100">Add Study Session</h3>

      {/* Capped at 2 columns (not 4) since this form renders both inline on
          the Study page (viewport-width) and inside the Edit modal (fixed
          ~576px) — 4 columns was fine on the page but crushed the 4 fields
          into unreadable slivers inside the narrower modal. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <Input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
        />

        <Input
          type="number"
          name="hours"
          placeholder="Hours (0.1–24)"
          min="0.1"
          max="24"
          step="0.1"
          value={formData.hours}
          onChange={handleChange}
        />

        <Select name="session_type" value={formData.session_type} onChange={handleChange}>
          {SESSION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
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
        />

      </div>

      <div className="mt-5 flex gap-2.5">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Session" : "Add Session"}
        </Button>
        {initialData && onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default StudyForm;
