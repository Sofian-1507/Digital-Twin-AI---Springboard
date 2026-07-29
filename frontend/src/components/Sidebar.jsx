import { NavLink } from "react-router-dom";

import "../styles/Sidebar.css";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "▦",
    },
    {
      name: "My Profile",
      path: "/profile",
      icon: "◉",
    },
    {
      name: "Finance",
      path: "/finance",
      icon: "₹",
    },
    {
      name: "Study",
      path: "/study",
      icon: "▤",
    },
    {
      name: "Habits",
      path: "/habits",
      icon: "✓",
    },
    {
      name: "Simulation",
      path: "/simulation",
      icon: "◌",
    },
    {
      name: "AI Assistant",
      path: "/assistant",
      icon: "✦",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo-icon">
          DT
        </div>

        <div>
          <h2>Digital Twin</h2>

          <p>AI Decision Assistant</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        <p className="menu-title">
          MAIN MENU
        </p>

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >
            <span className="menu-icon">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-box">
          <div className="user-avatar">
            IS
          </div>

          <div>
            <h4>My Digital Twin</h4>

            <p>Personal Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;