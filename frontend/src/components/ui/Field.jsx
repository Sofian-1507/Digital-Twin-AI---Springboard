const inputClasses = `w-full rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100
  placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
  dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500`;

/** Shared text/number/date input — standardizes border, radius, and focus ring. */
export function Input({ className = "", ...props }) {
  return <input className={`${inputClasses} ${className}`} {...props} />;
}

/** Shared select — same visual language as Input. Native <select> rendering
 * computes a few px shorter than <input> even with identical classes, so an
 * explicit height keeps every field in a form the same size. */
export function Select({ className = "", children, ...props }) {
  return (
    <select className={`${inputClasses} h-11.5 ${className}`} {...props}>
      {children}
    </select>
  );
}

/** Shared textarea — same visual language as Input. */
export function Textarea({ className = "", ...props }) {
  return <textarea className={`${inputClasses} ${className}`} {...props} />;
}
