import { Edit, Trash2 } from "lucide-react";

function GoalCard({ title, value, onEdit, onDelete }) {
  return(
    <div className="goal-card" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
        {onEdit && (
          <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Edit">
            <Edit size={14} />
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--danger-color, #ef4444)' }} aria-label="Delete">
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}

export default GoalCard;