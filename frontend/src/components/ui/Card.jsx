/** Shared card primitive — the white, rounded, soft-shadow container used throughout the app. */
function Card({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag
      className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Card;
