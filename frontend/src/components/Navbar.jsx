import { Bell, LogOut, Settings } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

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
    <header className="flex min-h-22.5 items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-8 dark:border-slate-700 dark:bg-slate-800">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 sm:text-2xl dark:text-slate-100">Welcome back!</h1>
        <p className="mt-1.5 text-[13px] text-slate-500 dark:text-slate-400">
          Here is your personal growth overview.
        </p>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button
          className="flex h-10.5 w-10.5 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-indigo-50/40 text-slate-400 disabled:cursor-not-allowed dark:border-slate-600 dark:bg-slate-700/40"
          aria-label="Notifications (coming soon)"
          title="Notifications aren't available yet"
          disabled
        >
          <Bell size={20} strokeWidth={1.8} />
        </button>

        <Link
          to="/settings"
          className="flex h-10.5 w-10.5 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-indigo-50/40 text-slate-600 dark:text-slate-400 transition-colors hover:bg-indigo-100 dark:border-slate-600 dark:bg-slate-700/40 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Settings"
        >
          <Settings size={20} strokeWidth={1.8} />
        </Link>

        <button
          className="flex h-10.5 w-10.5 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-indigo-50/40 text-slate-600 dark:text-slate-400 transition-colors hover:bg-indigo-100 dark:border-slate-600 dark:bg-slate-700/40 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Log out"
          onClick={handleLogout}
        >
          <LogOut size={20} strokeWidth={1.8} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-10.5 w-10.5 items-center justify-center rounded-full bg-indigo-600 text-[13px] font-bold text-white">
            {initials}
          </div>

          <div className="hidden sm:block">
            <h4 className="text-[13px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-200">{name}</h4>
            <p className="mt-1 text-[11px] text-slate-400">Digital Twin User</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
