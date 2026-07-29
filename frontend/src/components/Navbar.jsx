import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const { user } = useAuth();

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
        <button className="notification-button" aria-label="Notifications">
          <Bell size={20} strokeWidth={1.8} />
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