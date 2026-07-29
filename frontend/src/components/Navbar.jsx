import "../styles/Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div>
        <h1>Welcome back!</h1>

        <p>
          Here is your personal growth overview.
        </p>
      </div>

      <div className="navbar-right">
        <button className="notification-button">
          🔔
        </button>

        <div className="profile-info">
          <div className="top-avatar">
            IS
          </div>

          <div>
            <h4>Ishwari</h4>

            <p>Digital Twin User</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;