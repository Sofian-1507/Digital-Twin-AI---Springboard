import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Shared slide-over panel — same focus-trap/Escape/focus-return contract as
 * Modal, but slides in from the right edge rather than centering, for flows
 * that shouldn't block the whole page (e.g. adding a record while the list
 * behind it stays visible).
 */
function Drawer({ open, onClose, title, children }) {
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement;

    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll(FOCUSABLE);
    (focusables?.[0] || panel)?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose?.();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      const items = Array.from(panel.querySelectorAll(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 motion-reduce:transition-none"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="animate-drawer-in @container flex h-full w-full max-w-md flex-col overflow-y-auto bg-white p-6 shadow-xl focus:outline-none dark:bg-slate-800 motion-reduce:animate-none"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Drawer;
