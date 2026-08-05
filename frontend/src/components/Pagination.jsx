/**
 * Pagination — simple prev/next + page indicator for backend list endpoints
 * that return { page, limit, total, total_pages }.
 */
function Pagination({ page, totalPages, onPageChange, disabled = false }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4" role="navigation" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
        aria-label="Previous page"
        className="rounded-lg bg-indigo-600 px-4.5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-200"
      >
        ‹ Prev
      </button>

      <span className="text-sm text-slate-500 dark:text-slate-400">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
        aria-label="Next page"
        className="rounded-lg bg-indigo-600 px-4.5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-200"
      >
        Next ›
      </button>
    </div>
  );
}

export default Pagination;
