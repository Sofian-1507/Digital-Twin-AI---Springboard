import { useState } from "react";
import { toast } from "react-toastify";

function StudyForm({ addSession }) {
  const [formData, setFormData] = useState({
    date: "",
    subject: "",
    hours: "",
    status: "Completed",
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

    if (!formData.date || !formData.subject || !formData.hours) {
      toast.error("Please fill in Date, Subject, and Hours.");
      return;
    }

    if (Number(formData.hours) <= 0 || Number(formData.hours) > 24) {
      toast.error("Hours must be between 0.1 and 24.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addSession(formData);
      setFormData({
        date: "",
        subject: "",
        hours: "",
        status: "Completed",
      });
      toast.success("Study session added successfully.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="study-form"
      onSubmit={submitHandler}
    >
      <h3>Add Study Session</h3>

      <div className="study-form-grid">

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
        />

        <input
          type="number"
          name="hours"
          placeholder="Hours (0.1–24)"
          min="0.1"
          max="24"
          step="0.1"
          value={formData.hours}
          onChange={handleChange}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option>Completed</option>
          <option>Pending</option>
        </select>

      </div>

      <button className="study-btn" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Session"}
      </button>
    </form>
  );
}

export default StudyForm;