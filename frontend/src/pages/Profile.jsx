import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import ProfileCard from "../components/ProfileCard";
import InfoCard from "../components/InfoCard";
import GoalCard from "../components/GoalCard";
import ProfileForm from "../components/ProfileForm";

import {
  getUser,
  updateUser,
  updateGoal,
  deleteGoal,
  deleteUser
} from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "../styles/Profile.css";

function Profile() {

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
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

  const handleEditGoal = async (goal) => {
    const newTarget = prompt(`Enter new target for ${goal.title} (${goal.unit}):`, goal.target_value);
    if (!newTarget) return;
    try {
      const updatedUser = await updateGoal(goal.goal_id, { target_value: Number(newTarget) });
      setUser(updatedUser);
      toast.success("Goal updated.");
    } catch (err) {
      toast.error("Failed to update goal.");
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      const updatedUser = await deleteGoal(goalId);
      setUser(updatedUser);
      toast.success("Goal deleted.");
    } catch (err) {
      toast.error("Failed to delete goal.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("DANGER: Are you sure you want to permanently delete your account? This action cannot be undone.")) return;
    try {
      await deleteUser();
      toast.success("Account deleted successfully.");
      logout();
      navigate("/login");
    } catch (err) {
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

              <div className="goal-grid">
                {goals.length > 0
                  ? goals.slice(0, 3).map((g) => (
                      <GoalCard
                        key={g.goal_id}
                        title={g.title}
                        value={`${Number(g.current_value).toLocaleString()} / ${Number(g.target_value).toLocaleString()} ${g.unit}`}
                        onEdit={() => handleEditGoal(g)}
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

    </div>

  );

}

export default Profile;