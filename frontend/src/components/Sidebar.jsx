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

// Grouped by purpose rather than one flat list: Overview (glance at everything),
// Track (log/review data), Foresight (what the model predicts), You (identity).
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
  {
    label: "You",
    items: [
      { name: "My Profile", path: "/profile", icon: User },
    ],
  },
];

function navLinkClasses({ isActive }) {
  return `mb-2 flex items-center justify-center gap-3.5 rounded-lg px-3 py-3 text-[15px] no-underline transition-colors md:justify-start ${
    isActive
      ? "bg-indigo-600 font-semibold text-white"
      : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;
}

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-16 flex-col overflow-y-auto bg-slate-900 text-white md:w-64">
      <div className="flex items-center gap-3 border-b border-white/10 px-3 py-6 md:px-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold">
          DT
        </div>

        <div className="hidden md:block">
          <h2 className="text-[19px] font-semibold">Digital Twin</h2>
          <p className="mt-1 text-[11px] text-slate-400">AI Decision Assistant</p>
        </div>
      </div>

      <nav className="flex-1 px-2 py-6 md:px-3.5" aria-label="Main">
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 hidden pl-3 text-[11px] font-bold tracking-wider text-slate-400 md:block">
              {group.label.toUpperCase()}
            </p>

            {group.items.map(({ name, path, icon: Icon }) => (
              <NavLink key={name} to={path} aria-label={name} className={navLinkClasses}>
                <span className="flex w-5 shrink-0 justify-center">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <span className="hidden md:inline">{name}</span>
              </NavLink>
            ))}
          </div>
        ))}

        <div className="mt-2 border-t border-white/10 pt-4">
          <NavLink to="/assistant" aria-label="AI Assistant (preview)" className={navLinkClasses}>
            <span className="flex w-5 shrink-0 justify-center">
              <MessageSquare size={18} strokeWidth={1.8} />
            </span>
            <span className="hidden items-center gap-2 md:flex">
              AI Assistant
              <span className="rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-violet-300">
                Preview
              </span>
            </span>
          </NavLink>
        </div>
      </nav>

      <div className="border-t border-white/10 p-3 md:p-4.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[13px] font-bold text-slate-900">
            DT
          </div>

          <div className="hidden md:block">
            <h4 className="text-[13px] font-medium">My Digital Twin</h4>
            <p className="mt-1 text-[11px] text-slate-400">Personal Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
