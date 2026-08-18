import { useState } from "react";
import { toast } from "react-toastify";
import { Input, Select } from "./ui/Field";
import Button from "./ui/Button";
import { getApiErrorMessage } from "../utils/apiError";

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
      // Success toast is shown by Profile.jsx to avoid duplicates
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save profile. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="rounded-2xl bg-white dark:bg-slate-800 p-7 shadow-sm" onSubmit={submit}>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />

        <Input
          name="age"
          type="number"
          min="13"
          max="120"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          required
        />

        <Select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="NON_BINARY">Non-binary</option>
          <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
        </Select>

        <Input
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          placeholder="Occupation"
        />

        <Input
          name="monthly_income_baseline"
          type="number"
          min="0"
          step="0.01"
          value={formData.monthly_income_baseline}
          onChange={handleChange}
          placeholder="Monthly Income (₹)"
        />

        <Select name="risk_tolerance" value={formData.risk_tolerance} onChange={handleChange}>
          <option value="CONSERVATIVE">Conservative</option>
          <option value="MODERATE">Moderate</option>
          <option value="AGGRESSIVE">Aggressive</option>
        </Select>

      </div>

      <div className="mt-7 flex gap-3.5">

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Profile"}
        </Button>

        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>

      </div>

    </form>
  );
}

export default ProfileForm;
