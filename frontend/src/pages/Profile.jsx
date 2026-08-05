import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserX } from "lucide-react";

import ProfileCard from "../components/ProfileCard";
import InfoCard from "../components/InfoCard";
import GoalCard from "../components/GoalCard";
import ProfileForm from "../components/ProfileForm";
import GoalForm from "../components/GoalForm";
import ConfirmDialog from "../components/ConfirmDialog";
import Button from "../components/ui/Button";
import { SkeletonCard } from "../components/ui/Skeleton";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";

import {
  getUser,
  updateUser,
  addGoal,
  updateGoal,
  deleteGoal,
} from "../services/userService";

function Profile() {

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [addingGoal, setAddingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [confirmDeleteGoalId, setConfirmDeleteGoalId] = useState(null);

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

  if (isLoading) return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
      <SkeletonCard lines={2} />
      <SkeletonCard lines={4} />
    </div>
  );
  if (!user) return (
    <EmptyState
      icon={UserX}
      title="Could not load your profile"
      message="Something went wrong loading your profile. Please refresh the page to try again."
    />
  );

  // Use live active_goals from the backend; show first 3
  const goals = user?.active_goals ?? [];

  return (

    <div>

      <h2 className="mb-6 text-2xl font-semibold text-slate-800 dark:text-slate-100">My Digital Twin Profile</h2>

      {editing ? (

        <ProfileForm
          user={user}
          onSave={saveUser}
          onCancel={() => setEditing(false)}
        />

      ) : (

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">

          <ProfileCard
            user={user}
            onEdit={() => setEditing(true)}
          />

          <div className="flex flex-col gap-5">

            <InfoCard user={user} />

            {addingGoal ? (
              <GoalForm
                onSave={handleAddGoal}
                onCancel={() => setAddingGoal(false)}
              />
            ) : (
              <Button onClick={() => setAddingGoal(true)} className="self-start">
                + New Goal
              </Button>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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

          </div>

        </div>

      )}

      <Modal open={!!editingGoal} onClose={() => setEditingGoal(null)} title="Edit Goal" maxWidth="max-w-lg">
        <GoalForm
          initialData={editingGoal}
          onUpdate={handleUpdateGoal}
          onCancel={() => setEditingGoal(null)}
        />
      </Modal>

      <ConfirmDialog
        open={confirmDeleteGoalId !== null}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDeleteGoal}
        onCancel={() => setConfirmDeleteGoalId(null)}
      />

    </div>

  );

}

export default Profile;
