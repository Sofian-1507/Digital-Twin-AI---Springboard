import { useState } from "react";
import { toast } from "react-toastify";
import { Select } from "./ui/Field";
import Button from "./ui/Button";
import { getApiErrorMessage } from "../utils/apiError";

/**
 * PreferencesForm — edits the user's embedded preferences sub-document.
 * Maps to PATCH /api/v1/users/me/preferences (PreferencesUpdateRequest).
 * Backend fields: currency, language, dark_mode, email_notifications, weekly_report_enabled.
 * dark_mode isn't edited here — it's toggled from the sidebar's sun/moon
 * button (see AuthContext's toggleDarkMode), which PATCHes the same field.
 */
function PreferencesForm({ user, onSave }) {
  const preferences = user?.preferences ?? {};

  const [formData, setFormData] = useState({
    currency:               preferences.currency               ?? "USD",
    language:               preferences.language               ?? "en",
    email_notifications:    preferences.email_notifications    ?? true,
    weekly_report_enabled:  preferences.weekly_report_enabled  ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function submit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save preferences. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select name="currency" value={formData.currency} onChange={handleChange}>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="INR">INR (₹)</option>
        </Select>

        <Select name="language" value={formData.language} onChange={handleChange}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </Select>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            name="email_notifications"
            checked={formData.email_notifications}
            onChange={handleChange}
            className="h-4.5 w-4.5 cursor-pointer accent-indigo-600"
          />
          Email notifications
        </label>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            name="weekly_report_enabled"
            checked={formData.weekly_report_enabled}
            onChange={handleChange}
            className="h-4.5 w-4.5 cursor-pointer accent-indigo-600"
          />
          Weekly summary report
        </label>
      </div>

      <div className="mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </form>
  );
}

export default PreferencesForm;
