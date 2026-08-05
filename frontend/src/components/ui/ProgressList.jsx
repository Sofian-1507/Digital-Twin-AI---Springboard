/**
 * Shared "title + list of labeled progress bars" component — replaces the
 * near-identical markup SubjectProgress (Study) and HabitProgress (Habits)
 * each hand-rolled independently.
 */
function ProgressList({ title, items, emptyMessage }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.key}>
              <div className="mb-1.5 flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>{item.label}</span>
                <span className="font-mono tabular-nums">{Math.round(item.value)}%</span>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-full rounded-full ${item.color || "bg-indigo-600"}`}
                  style={{ width: `${Math.min(item.value, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProgressList;
