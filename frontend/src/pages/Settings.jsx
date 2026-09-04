import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserX } from "lucide-react";

import PreferencesForm from "../components/PreferencesForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import ConfirmDialog from "../components/ConfirmDialog";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { SkeletonCard } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

import { getUser, updatePreferences, deleteUser } from "../services/userService";
import { changePassword } from "../services/authService";
import { useAuth } from "../context/useAuth";

/**
 * Settings — split out of Profile.jsx. Preferences and account deletion are a
 * different concern from identity/goals (which stay on /profile), so they get
 * their own page, reachable via the gear icon in the sidebar's profile block
 * rather than the main nav (used far less often than the 8 primary sections).
 */
function Settings() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getUser();
        setUser(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
        toast.error("Could not load your settings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  async function savePreferences(preferencesPayload) {
    const updated = await updatePreferences(preferencesPayload);
    setUser(updated);
    toast.success("Preferences updated successfully.");
  }

  const handleDeleteAccount = () => setConfirmDeleteAccount(true);

  const confirmDeleteAccountAction = async () => {
    setConfirmDeleteAccount(false);
    try {
      await deleteUser();
      toast.success("Account deleted successfully.");
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Failed to delete account:", err);
      toast.error("Failed to delete account.");
    }
  };

  if (isLoading) return <SkeletonCard lines={4} />;
  if (!user) return (
    <EmptyState
      icon={UserX}
      title="Could not load your settings"
      message="Something went wrong loading your settings. Please refresh the page to try again."
    />
  );

  return (
    <div className="max-w-2xl">

      <h2 className="mb-6 text-2xl font-semibold text-slate-800 dark:text-slate-100">Settings</h2>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">Preferences</h3>
        <PreferencesForm user={user} onSave={savePreferences} />
      </Card>

      <Card className="mt-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">Change Password</h3>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Changing your password logs out every other device or browser currently signed in.
        </p>
        <ChangePasswordForm onSave={changePassword} />
      </Card>

      <div className="mt-6 rounded-2xl border border-red-200 p-5 dark:border-red-900/60 dark:bg-red-950/10">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
        <p className="mb-4 mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button variant="danger" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDeleteAccount}
        title="Delete Account"
        message="DANGER: Are you sure you want to permanently delete your account? This action cannot be undone."
        confirmLabel="Delete Account"
        danger
        onConfirm={confirmDeleteAccountAction}
        onCancel={() => setConfirmDeleteAccount(false)}
      />

    </div>
  );
}

export default Settings;
