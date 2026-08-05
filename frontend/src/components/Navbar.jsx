import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const name     = user?.profile?.name ?? "Digital Twin User";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="navbar">
      <div>
        <h1>Welcome back!</h1>

        <p>
          Here is your personal growth overview.
        </p>
      </div>

      <div className="navbar-right">
        <button
          className="notification-button"
          aria-label="Notifications (coming soon)"
          title="Notifications aren't available yet"
          disabled
        >
          <Bell size={20} strokeWidth={1.8} />
        </button>

        <button className="notification-button" aria-label="Log out" onClick={handleLogout}>
          <LogOut size={20} strokeWidth={1.8} />
        </button>

        <div className="profile-info">
          <div className="top-avatar">
            {initials}
          </div>

          <div>
            <h4>{name}</h4>

            <p>Digital Twin User</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;