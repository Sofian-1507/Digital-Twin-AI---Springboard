import { useState } from "react";

function StudyForm({ addSession }) {
  const [formData, setFormData] = useState({
    date: "",
    subject: "",
    hours: "",
    status: "Completed",
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
      !formData.subject ||
      !formData.hours
    ) {
      alert("Please fill all fields.");
      return;
    }

    addSession(formData);

    setFormData({
      date: "",
      subject: "",
      hours: "",
      status: "Completed",
    });
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
          placeholder="Hours"
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

      <button className="study-btn">
        Add Session
      </button>
    </form>
  );
}

export default StudyForm;