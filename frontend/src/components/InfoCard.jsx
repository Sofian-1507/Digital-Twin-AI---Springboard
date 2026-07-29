/**
 * InfoCard — displays the user's personal information.
 * Reads from user.profile (nested backend schema from /users/me).
 * Fields available: name, age, gender, occupation, monthly_income_baseline, risk_tolerance.
 * Fields NOT in the backend schema (phone, city, education) have been removed.
 */
function InfoCard({ user }) {
  const profile = user?.profile ?? {};

  return (

    <div className="info-card">

      <h3>Personal Information</h3>

      <div className="info-grid">

        <div>
          <label>Email</label>
          <p>{user?.email ?? "—"}</p>
        </div>

        <div>
          <label>Age</label>
          <p>{profile.age ?? "—"}</p>
        </div>

        <div>
          <label>Gender</label>
          <p>{profile.gender ?? "—"}</p>
        </div>

        <div>
          <label>Occupation</label>
          <p>{profile.occupation ?? "—"}</p>
        </div>

        <div>
          <label>Monthly Income</label>
          <p>
            {profile.monthly_income_baseline != null
              ? `₹${Number(profile.monthly_income_baseline).toLocaleString()}`
              : "—"}
          </p>
        </div>

        <div>
          <label>Risk Tolerance</label>
          <p>{profile.risk_tolerance ?? "—"}</p>
        </div>

      </div>

    </div>

  );

}

export default InfoCard;