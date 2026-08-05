/** Shared loading indicator, replacing the old plain "Loading…" text nodes. */
function Spinner({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-16 text-slate-500 dark:text-slate-400 ${className}`} role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default Spinner;
