/**
 * ConfirmDialog — reusable in-app replacement for window.confirm().
 * Reuses the exact modal-overlay pattern already established for edit forms
 * in Finance.jsx/Study.jsx (fixed, full-screen, semi-transparent backdrop).
 */
function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'var(--bg-color, #fff)', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>

        {title && <h3 style={{ marginBottom: '10px' }}>{title}</h3>}

        <p style={{ color: 'var(--text-secondary, #64748b)', marginBottom: '20px' }}>{message}</p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{ background: '#6c757d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{ background: danger ? 'var(--danger-color, #ef4444)' : 'var(--primary-color, #4F46E5)', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmDialog;
