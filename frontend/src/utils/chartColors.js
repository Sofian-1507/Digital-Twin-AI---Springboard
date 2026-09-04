/**
 * Chart stroke/fill colors, kept in sync with the --color-* tokens in
 * src/index.css by hand — Recharts takes literal color props, not Tailwind
 * classes, so these can't inherit the token override the way className-based
 * components do.
 */
export const CHART_COLORS = {
  action: "#0F766E",    // teal — primary action accent (matches --color-indigo-600)
  predicted: "#8B4B8A", // plum — predicted/AI content (matches --color-violet-500)
  positive: "#15803D",  // emerald
  warning: "#B45309",   // amber
  danger: "#BE123C",    // red
  grid: "#E7E5E4",      // slate-200 — gridlines
  muted: "#78716C",     // slate-500 — secondary series/labels
};

export default CHART_COLORS;
