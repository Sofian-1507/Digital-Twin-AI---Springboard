import { useState } from "react";
import { toast } from "react-toastify";
import "../styles/Profile.css";

/**
 * ProfileForm — edits the user's profile sub-document.
 * Maps to PATCH /api/v1/users/me/profile (ProfileUpdateRequest).
 * Backend fields: name, age, gender, occupation, monthly_income_baseline, risk_tolerance.
 * Fields phone, city, education do NOT exist in the backend schema.
 */
function ProfileForm({ user, onSave, onCancel }) {

  const profile = user?.profile ?? {};

  const [formData, setFormData] = useState({
    name:                     profile.name                     ?? "",
    age:                      profile.age                      ?? "",
    gender:                   profile.gender                   ?? "",
    occupation:               profile.occupation               ?? "",
    monthly_income_baseline:  profile.monthly_income_baseline  ?? "",
    risk_tolerance:           profile.risk_tolerance           ?? "MODERATE",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function submit(e) {
    e.preventDefault();

    if (!formData.name || !formData.age) {
      toast.error("Name and Age are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        name:                    formData.name,
        age:                     Number(formData.age),
        gender:                  formData.gender   || undefined,
        occupation:              formData.occupation || undefined,
        monthly_income_baseline: formData.monthly_income_baseline !== ""
                                   ? Number(formData.monthly_income_baseline)
                                   : undefined,
        risk_tolerance:          formData.risk_tolerance || undefined,
      });
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Failed to save profile. Please try again.");
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
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />

        <input
          name="age"
          type="number"
          min="13"
          max="120"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="NON_BINARY">Non-binary</option>
          <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
        </select>

        <input
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          placeholder="Occupation"
        />

        <input
          name="monthly_income_baseline"
          type="number"
          min="0"
          step="0.01"
          value={formData.monthly_income_baseline}
          onChange={handleChange}
          placeholder="Monthly Income (₹)"
        />

        <select
          name="risk_tolerance"
          value={formData.risk_tolerance}
          onChange={handleChange}
        >
          <option value="CONSERVATIVE">Conservative</option>
          <option value="MODERATE">Moderate</option>
          <option value="AGGRESSIVE">Aggressive</option>
        </select>

      </div>

      <div className="button-group">

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

      </div>

    </form>
  );
}

export default ProfileForm;