import { useState } from "react";
import { toast } from "react-toastify";
import { Input } from "./ui/Field";
import Button from "./ui/Button";
import { getApiErrorMessage } from "../utils/apiError";

const DEFAULT_FORM = { current_password: "", new_password: "", confirm_password: "" };

/**
 * ChangePasswordForm — POST /api/v1/users/me/change-password.
 * Invalidates every other logged-in session for this account; the backend returns
 * a fresh token so this session keeps working, which onSave is responsible for storing.
 */
function ChangePasswordForm({ onSave }) {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();

    if (formData.new_password.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (formData.new_password !== formData.confirm_password) {
      toast.error("New password and confirmation don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        current_password: formData.current_password,
        new_password: formData.new_password,
      });
      setFormData(DEFAULT_FORM);
      toast.success("Password changed. Your other sessions have been logged out.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to change password. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Input
        type="password"
        name="current_password"
        placeholder="Current password"
        value={formData.current_password}
        onChange={handleChange}
        autoComplete="current-password"
        required
      />
      <Input
        type="password"
        name="new_password"
        placeholder="New password (min. 8 characters)"
        value={formData.new_password}
        onChange={handleChange}
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Input
        type="password"
        name="confirm_password"
        placeholder="Confirm new password"
        value={formData.confirm_password}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />

      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Changing..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
