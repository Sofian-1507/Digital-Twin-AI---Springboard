/**
 * Chart stroke/fill colors, kept in sync with the --color-* tokens in
 * src/index.css by hand — Recharts takes literal color props, not Tailwind
 * classes, so these can't inherit the token override the way className-based
 * components do.
 */
export const CHART_COLORS = {
  action: "#2F6F5E",    // teal — primary action accent (matches --color-indigo-600)
  predicted: "#8267C4", // violet — predicted/AI content (matches --color-violet-500)
  positive: "#1F7A52",  // emerald
  warning: "#B5780F",   // amber
  danger: "#B23A34",    // red
  grid: "#E4DACB",      // slate-200 — gridlines
  muted: "#8A7F72",     // slate-500 — secondary series/labels
};

export default CHART_COLORS;
