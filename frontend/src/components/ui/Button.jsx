const VARIANTS = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400 dark:text-slate-300 dark:hover:bg-slate-700",
};

/** Shared button primitive — standardizes color, radius, focus ring, and disabled state across the app. */
function Button({ variant = "primary", className = "", disabled, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
        transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${VARIANTS[variant]} ${className}`}
      disabled={disabled}
      {...props}
    />
  );
}

export default Button;
