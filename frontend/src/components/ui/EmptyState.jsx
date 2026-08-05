/** Shared empty-state block for lists/tables with no data. */
function EmptyState({ title = "Nothing here yet", message, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-14 text-center dark:border-slate-700">
      {Icon && <Icon className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600 dark:text-slate-400" />}
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-300">{title}</p>
      {message && <p className="max-w-sm text-sm text-slate-400 dark:text-slate-500 dark:text-slate-400">{message}</p>}
    </div>
  );
}

export default EmptyState;
