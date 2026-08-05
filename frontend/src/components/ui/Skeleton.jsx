/** Shimmering placeholder shape — replaces bare "Loading…" text with a shape matching the content it stands in for. */
function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 motion-reduce:animate-none dark:bg-slate-700 ${className}`}
      aria-hidden="true"
    />
  );
}

/** Generic card-shaped placeholder — for identity/form pages (Profile, Settings) that aren't stat/table shaped. */
export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm" role="status" aria-label="Loading">
      <Skeleton className="mb-5 h-5 w-32" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full max-w-md" />
        ))}
      </div>
    </div>
  );
}

/** Chart-shaped placeholder. */
export function SkeletonChart({ height = "h-64" }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm" role="status" aria-label="Loading chart">
      <Skeleton className="mb-5 h-5 w-40" />
      <Skeleton className={`w-full ${height}`} />
    </div>
  );
}

export function SkeletonStatGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" role="status" aria-label="Loading stats">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="mt-4 h-7 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm" role="status" aria-label="Loading table">
      <Skeleton className="mb-5 h-5 w-40" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
