import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import ProfileCard from "../components/ProfileCard";
import InfoCard from "../components/InfoCard";
import GoalCard from "../components/GoalCard";
import ProfileForm from "../components/ProfileForm";
import GoalForm from "../components/GoalForm";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  getUser,
  updateUser,
  addGoal,
  updateGoal,
  deleteGoal,
  deleteUser
} from "../services/userService";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

import "../styles/Profile.css";

function Profile() {

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [addingGoal, setAddingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [confirmDeleteGoalId, setConfirmDeleteGoalId] = useState(null);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    async function loadUser() {
      try {
        const data = await getUser();
        setUser(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Could not load your profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();

  }, []);

  async function saveUser(profilePayload) {
    const updated = await updateUser(profilePayload);
    setUser(updated);
    setEditing(false);
    toast.success("Profile updated successfully.");
  }

  const handleAddGoal = async (goalPayload) => {
    const updatedUser = await addGoal(goalPayload);
    setUser(updatedUser);
    setAddingGoal(false);
    toast.success("Goal added successfully.");
  };

  const startEditGoal = (goal) => {
    setEditingGoal({
      goal_id: goal.goal_id,
      title: goal.title,
      category: goal.category,
      target_value: goal.target_value,
      current_value: goal.current_value,
      unit: goal.unit,
      target_date: goal.target_date ? goal.target_date.substring(0, 10) : "",
    });
  };

  const handleUpdateGoal = async (goalId, payload) => {
    const updatedUser = await updateGoal(goalId, payload);
    setUser(updatedUser);
    setEditingGoal(null);
    toast.success("Goal updated.");
  };

  const handleDeleteGoal = (goalId) => setConfirmDeleteGoalId(goalId);

  const confirmDeleteGoal = async () => {
    const goalId = confirmDeleteGoalId;
    setConfirmDeleteGoalId(null);
    try {
      const updatedUser = await deleteGoal(goalId);
      setUser(updatedUser);
      toast.success("Goal deleted.");
    } catch (err) {
      console.error("Failed to delete goal:", err);
      toast.error("Failed to delete goal.");
    }
  };

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

  if (isLoading) return <h2>Loading...</h2>;
  if (!user) return <h2>Could not load profile.</h2>;

  // Use live active_goals from the backend; show first 3
  const goals = user?.active_goals ?? [];

  return (

    <div className="profile-page">

      <h2>My Digital Twin Profile</h2>

      {editing ? (

        <ProfileForm
          user={user}
          onSave={saveUser}
          onCancel={() => setEditing(false)}
        />

      ) : (

        <>

          <div className="profile-layout">

            <ProfileCard
              user={user}
              onEdit={() => setEditing(true)}
            />

            <div className="profile-right">

              <InfoCard user={user} />

              {addingGoal ? (
                <GoalForm
                  onSave={handleAddGoal}
                  onCancel={() => setAddingGoal(false)}
                />
              ) : (
                <button
                  onClick={() => setAddingGoal(true)}
                  style={{ marginBottom: '15px', padding: '10px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', background: 'var(--primary-color, #4F46E5)', color: 'white' }}
                >
                  + New Goal
                </button>
              )}

              <div className="goal-grid">
                {goals.length > 0
                  ? goals.slice(0, 3).map((g) => (
                      <GoalCard
                        key={g.goal_id}
                        title={g.title}
                        value={`${Number(g.current_value).toLocaleString()} / ${Number(g.target_value).toLocaleString()} ${g.unit}`}
                        onEdit={() => startEditGoal(g)}
                        onDelete={() => handleDeleteGoal(g.goal_id)}
                      />
                    ))
                  : (
                    <>
                      <GoalCard title="Financial Goal" value="No goal set" />
                      <GoalCard title="Study Goal"    value="No goal set" />
                      <GoalCard title="Lifestyle Goal" value="No goal set" />
                    </>
                  )}
              </div>

              <div style={{ marginTop: '30px', padding: '20px', border: '1px solid var(--danger-color, #ef4444)', borderRadius: '12px' }}>
                <h3 style={{ color: 'var(--danger-color, #ef4444)' }}>Danger Zone</h3>
                <p style={{ color: 'var(--text-secondary, #64748b)', fontSize: '0.9rem', marginBottom: '15px' }}>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button 
                  onClick={handleDeleteAccount}
                  style={{ background: 'var(--danger-color, #ef4444)', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Delete Account
                </button>
              </div>

            </div>

          </div>

        </>

      )}

      {editingGoal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'var(--bg-color, #fff)', padding: '20px', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <GoalForm
              initialData={editingGoal}
              onUpdate={handleUpdateGoal}
              onCancel={() => setEditingGoal(null)}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteGoalId !== null}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDeleteGoal}
        onCancel={() => setConfirmDeleteGoalId(null)}
      />

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

export default Profile;