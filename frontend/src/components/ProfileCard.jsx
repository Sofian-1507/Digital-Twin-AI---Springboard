function ProfileCard({ user, onEdit }) {
  const name       = user?.profile?.name       ?? "—";
  const occupation = user?.profile?.occupation ?? "Digital Twin User";

  // Derive initials for the avatar placeholder
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (

    <div className="profile-card">

      <div
        className="profile-avatar-placeholder"
        aria-label={`Avatar for ${name}`}
      >
        {initials}
      </div>

      <h2>{name}</h2>

      <p>{occupation}</p>

      <button onClick={onEdit}>
        Edit Profile
      </button>

    </div>

  );
}

export default ProfileCard;