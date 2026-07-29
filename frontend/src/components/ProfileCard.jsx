function ProfileCard({ user, onEdit }) {

  return (

    <div className="profile-card">

      <img
        src="https://i.pravatar.cc/200"
        alt="profile"
      />

      <h2>{user.name}</h2>

      <p>{user.occupation}</p>

      <button onClick={onEdit}>
        Edit Profile
      </button>

    </div>

  );

}

export default ProfileCard;