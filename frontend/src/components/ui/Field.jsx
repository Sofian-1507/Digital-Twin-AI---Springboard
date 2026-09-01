import { Children, useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const inputClasses = `w-full rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100
  placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
  dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500`;

/** Shared text/number/date input — standardizes border, radius, and focus ring. */
export function Input({ className = "", ...props }) {
  return <input className={`${inputClasses} ${className}`} {...props} />;
}

/** Reads { value, label, disabled } option descriptors off <option> children —
 * the same shape every call site in the app already passes to Select — so
 * Select can fully replace the native element without any call site changing. */
function extractOptions(children) {
  return Children.toArray(children)
    .filter((child) => child?.type === "option")
    .map((child) => ({
      value: child.props.value ?? "",
      label: child.props.children,
      disabled: !!child.props.disabled,
    }));
}

/**
 * Shared select — a custom-styled dropdown (not the native OS menu), per
 * design.md's direction: rounded-lg/hairline-border/indigo-accent closed box,
 * a floating panel with the selected row highlighted in indigo + a check
 * mark. Reuses the same click-outside/Escape-to-close pattern established by
 * Dashboard.jsx's AddRecordMenu / Sidebar.jsx's ProfileMenu (see design.md's
 * "Navigation" section — "reuse that pattern for any future dropdown rather
 * than inventing a new one"). Drop-in for the native <select> it replaces:
 * same props (name/value/onChange/children as <option>), so no call site
 * needs to change — onChange still receives an event-shaped
 * { target: { name, value } }.
 */
export function Select({ className = "", children, name, value, onChange, disabled = false, ...rest }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const options = extractOptions(children);
  const selected = options.find((o) => String(o.value) === String(value));

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function selectOption(option) {
    setOpen(false);
    onChange?.({ target: { name, value: option.value, type: "select-one" } });
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative ${inputClasses} h-11.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      } ${className}`}
    >
      <button
        type="button"
        name={name}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-full w-full items-center justify-between gap-2 rounded-lg bg-transparent text-left focus:outline-none disabled:cursor-not-allowed"
        {...rest}
      >
        <span className={`truncate ${!selected || selected.disabled ? "text-slate-400 dark:text-slate-500" : ""}`}>
          {selected ? selected.label : ""}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.8}
          className={`shrink-0 text-slate-500 transition-transform dark:text-slate-400 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute inset-x-0 top-full z-10 mt-1 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          {options
            .filter((option) => !option.disabled)
            .map((option) => {
              const isSelected = String(option.value) === String(value);
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectOption(option)}
                  className={`flex cursor-pointer items-center justify-between gap-2 px-3.5 py-2.5 text-sm ${
                    isSelected
                      ? "bg-indigo-100/60 font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/40"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check size={15} strokeWidth={2} className="shrink-0" />}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

/** Shared textarea — same visual language as Input. */
export function Textarea({ className = "", ...props }) {
  return <textarea className={`${inputClasses} ${className}`} {...props} />;
}
