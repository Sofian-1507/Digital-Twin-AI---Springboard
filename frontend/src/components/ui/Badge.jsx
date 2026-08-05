const TONES = {
  neutral: "bg-slate-100 text-slate-600",
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-indigo-100 text-indigo-700",
  predicted: "bg-violet-100 text-violet-700",
};

/** Shared pill badge — used for statuses, categories, and action-type labels. */
function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
