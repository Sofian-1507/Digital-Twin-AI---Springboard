import { Edit, Trash2 } from "lucide-react";

function GoalCard({ title, value, onEdit, onDelete }) {
  return(
    <div className="relative rounded-2xl bg-white dark:bg-slate-800 p-6 text-center shadow-sm">
      <div className="absolute right-2.5 top-2.5 flex gap-1.5">
        {onEdit && (
          <button onClick={onEdit} className="p-0 text-slate-400 hover:text-indigo-600" aria-label="Edit">
            <Edit size={14} />
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="p-0 text-red-400 hover:text-red-600" aria-label="Delete">
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <h3 className="mb-3.5 text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
      <h2 className="font-mono text-xl font-semibold tabular-nums text-indigo-600">{value}</h2>
    </div>
  );
}

export default GoalCard;
