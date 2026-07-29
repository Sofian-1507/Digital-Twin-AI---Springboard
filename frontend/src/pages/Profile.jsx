import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import ProfileCard from "../components/ProfileCard";
import InfoCard from "../components/InfoCard";
import GoalCard from "../components/GoalCard";
import ProfileForm from "../components/ProfileForm";

import {
  getUser,
  updateUser,
} from "../services/userService";

import "../styles/Profile.css";

function Profile() {

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);

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
    // profilePayload is already correctly shaped by ProfileForm
    const updated = await updateUser(profilePayload);
    setUser(updated);
    setEditing(false);
  }

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

        </>

      )}

    </div>

  );

}

export default Profile;