import { useEffect, useRef } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Shared overlay base for ConfirmDialog and every ad-hoc edit-record modal
 * (Finance/Study/Profile). Provides what the audit found missing from every
 * hand-rolled `position:fixed` overlay in the app: a focus trap, Escape-to-close,
 * and focus returned to the trigger on close — implemented once here instead
 * of per-instance.
 */
function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`animate-modal-in @container max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-2xl bg-white p-5 shadow-xl focus:outline-none dark:bg-slate-800`}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
