import { useEffect, useState } from "react";

import ProfileCard from "../components/ProfileCard";
import InfoCard from "../components/InfoCard";
import GoalCard from "../components/GoalCard";
import ProfileForm from "../components/ProfileForm";

import {
  getUser,
  updateUser
} from "../services/userService";

import "../styles/Profile.css";

function Profile() {

  const [user, setUser] = useState(null);

  const [editing, setEditing] = useState(false);

  useEffect(() => {

    async function loadUser() {

      const data = await getUser();

      setUser(data);

    }

    loadUser();

  }, []);

  async function saveUser(data) {

    const updated = await updateUser(data);

    setUser(updated);

    setEditing(false);

  }

  if (!user) return <h2>Loading...</h2>;

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

                <GoalCard
                  title="Financial Goal"
                  value="$50,000 Savings"
                />

                <GoalCard
                  title="Study Goal"
                  value="Complete AI Course"
                />

                <GoalCard
                  title="Lifestyle Goal"
                  value="Exercise 5 Days"
                />

              </div>

            </div>

          </div>

        </>

      )}

    </div>

  );

}

export default Profile;