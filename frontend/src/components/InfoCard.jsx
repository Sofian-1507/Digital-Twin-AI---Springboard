function InfoCard({ user }) {

  return (

    <div className="info-card">

      <h3>Personal Information</h3>

      <div className="info-grid">

        <div>
          <label>Email</label>
          <p>{user.email}</p>
        </div>

        <div>
          <label>Phone</label>
          <p>{user.phone}</p>
        </div>

        <div>
          <label>Age</label>
          <p>{user.age}</p>
        </div>

        <div>
          <label>City</label>
          <p>{user.city}</p>
        </div>

        <div>
          <label>Occupation</label>
          <p>{user.occupation}</p>
        </div>

        <div>
          <label>Education</label>
          <p>{user.education}</p>
        </div>

      </div>

    </div>

  );

}

export default InfoCard;