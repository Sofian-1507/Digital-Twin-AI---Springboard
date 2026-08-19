import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  BookOpen,
  CheckSquare,
  BrainCircuit,
  MessageSquare,
  Activity,
  Sun,
  Moon,
  Settings,
  LogOut,
  User,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "../context/useAuth";

// Grouped by purpose rather than one flat list: Overview (glance at everything),
// Track (log/review data), Foresight (what the model predicts). Identity
// (My Profile / Settings / Logout) lives in the profile dropdown at the
// bottom of the sidebar instead of its own nav group.
// Assistant is rendered separately below, since it's the one preview/experimental
// feature rather than a fully-real section.
const menuGroups = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "Activity",  path: "/activity",   icon: Activity },
    ],
  },
  {
    label: "Track",
    items: [
      { name: "Finance", path: "/finance", icon: Wallet },
      { name: "Study",   path: "/study",   icon: BookOpen },
      { name: "Habits",  path: "/habits",  icon: CheckSquare },
    ],
  },
  {
    label: "Foresight",
    items: [
      { name: "Prediction", path: "/prediction", icon: BrainCircuit },
    ],
  },
];

function navLinkClasses({ isActive }) {
  return `mb-2 flex items-center justify-center gap-3.5 rounded-lg px-3 py-3 text-[15px] no-underline transition-colors group-hover:justify-start ${
    isActive
      ? "bg-indigo-600 font-semibold text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
  }`;
}

/** Avatar + name trigger at the bottom of the sidebar — opens upward (it's
 * pinned to the bottom of the screen) with My Profile / Settings / Logout. */
function ProfileMenu({ name, initials, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex w-full items-center justify-center gap-3 rounded-lg px-1 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-white/10 group-hover:justify-start"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[13px] font-bold text-white">
          {initials}
        </div>
        <div className="hidden min-w-0 flex-1 text-left group-hover:block">
          <h4 className="truncate text-[13px] font-medium text-slate-800 dark:text-slate-100">{name}</h4>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Digital Twin User</p>
        </div>
        <ChevronUp
          size={16}
          strokeWidth={1.8}
          className={`hidden shrink-0 text-slate-500 transition-transform dark:text-slate-400 group-hover:block ${open ? "" : "rotate-180"}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-10 mb-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          <Link
            role="menuitem"
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/40"
          >
            <User size={16} strokeWidth={1.8} /> My Profile
          </Link>
          <Link
            role="menuitem"
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/40"
          >
            <Settings size={16} strokeWidth={1.8} /> Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2.5 border-t border-slate-100 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-slate-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-slate-700/40"
          >
            <LogOut size={16} strokeWidth={1.8} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

function Sidebar() {
  const { user, logout, toggleDarkMode } = useAuth();
  const navigate = useNavigate();
  const isDark = Boolean(user?.preferences?.dark_mode);

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
    <aside className="peer group fixed left-0 top-0 z-30 flex h-screen w-16 flex-col overflow-hidden border-r border-slate-200 bg-white text-slate-800 transition-[width] duration-200 ease-out hover:w-64 hover:overflow-y-auto dark:border-r-0 dark:bg-slate-900 dark:text-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-3 py-6 dark:border-white/10 group-hover:px-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
          DT
        </div>

        <div className="hidden whitespace-nowrap group-hover:block">
          <h2 className="text-[19px] font-semibold">Digital Twin</h2>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">AI Decision Assistant</p>
        </div>
      </div>

      <nav className="flex-1 px-2 py-6 group-hover:px-3.5" aria-label="Main">
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 hidden whitespace-nowrap pl-3 text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 group-hover:block">
              {group.label.toUpperCase()}
            </p>

            {group.items.map(({ name, path, icon: Icon }) => (
              <NavLink key={name} to={path} aria-label={name} className={navLinkClasses}>
                <span className="flex w-5 shrink-0 justify-center">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <span className="hidden whitespace-nowrap group-hover:inline">{name}</span>
              </NavLink>
            ))}
          </div>
        ))}

        <div className="mt-2 border-t border-slate-200 pt-4 dark:border-white/10">
          <NavLink to="/assistant" aria-label="AI Assistant (preview)" className={navLinkClasses}>
            <span className="flex w-5 shrink-0 justify-center">
              <MessageSquare size={18} strokeWidth={1.8} />
            </span>
            <span className="hidden items-center gap-2 whitespace-nowrap group-hover:flex">
              AI Assistant
              <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                Preview
              </span>
            </span>
          </NavLink>
        </div>
      </nav>

      <div className="border-t border-slate-200 px-2 py-4 dark:border-white/10 group-hover:px-3.5">
        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="mb-2 flex h-9 w-full items-center justify-center gap-2.5 rounded-lg px-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white group-hover:justify-start group-hover:px-2"
        >
          {isDark ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
          <span className="hidden whitespace-nowrap text-xs group-hover:inline">{isDark ? "Light mode" : "Dark mode"}</span>
        </button>

        <ProfileMenu name={name} initials={initials} onLogout={handleLogout} />
      </div>
    </aside>
  );
}

export default Sidebar;
