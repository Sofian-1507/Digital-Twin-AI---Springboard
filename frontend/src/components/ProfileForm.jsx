import { useState } from "react";
import "../styles/Profile.css";

function ProfileForm({ user, onSave, onCancel }) {

  const [formData, setFormData] = useState(user);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function submit(e) {
    e.preventDefault();

    if (
      formData.name === "" ||
      formData.email === ""
    ) {
      alert("Please fill all required fields");
      return;
    }

    onSave(formData);
  }

  return (
    <form
      className="profile-form"
      onSubmit={submit}
    >

      <div className="form-grid">

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
        />

        <input
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
        />

        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
        />

        <input
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          placeholder="Occupation"
        />

        <input
          name="education"
          value={formData.education}
          onChange={handleChange}
          placeholder="Education"
        />

      </div>

      <div className="button-group">

        <button type="submit">
          Save Profile
        </button>

        <button
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>

      </div>

    </form>
  );
}

export default ProfileForm;