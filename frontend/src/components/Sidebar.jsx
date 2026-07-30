import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Wallet,
  BookOpen,
  CheckSquare,
  BrainCircuit,
  MessageSquare,
  Activity
} from "lucide-react";

import "../styles/Sidebar.css";

const menuItems = [
  { name: "Dashboard",    path: "/dashboard",  icon: LayoutDashboard },
  { name: "My Profile",   path: "/profile",    icon: User            },
  { name: "Finance",      path: "/finance",    icon: Wallet          },
  { name: "Study",        path: "/study",      icon: BookOpen        },
  { name: "Habits",       path: "/habits",     icon: CheckSquare     },
  { name: "Simulation",   path: "/simulation", icon: BrainCircuit    },
  { name: "AI Assistant", path: "/assistant",  icon: MessageSquare   },
  { name: "Activity",     path: "/activity",   icon: Activity        },
];

function Sidebar() {
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

        {menuItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <span className="menu-icon">
              <Icon size={18} strokeWidth={1.8} />
            </span>

            <span>
              {name}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-box">
          <div className="user-avatar">
            DT
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