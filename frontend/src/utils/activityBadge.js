/** Shared action-type → badge tone mapping, used by the Activity page and the Dashboard's activity feed. */
export function activityBadgeTone(actionType) {
  const at = actionType || "";
  if (at.startsWith("CREATED") || at.startsWith("UPSERTED")) return "success";
  if (at.startsWith("UPDATED")) return "info";
  if (at.startsWith("DELETED")) return "danger";
  return "neutral";
}
