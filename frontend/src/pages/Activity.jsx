import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getActivityHistory } from "../services/activityService";
import "../styles/Activity.css";

function badgeClassFor(actionType) {
  const at = actionType || "";
  if (at.startsWith("CREATED") || at.startsWith("UPSERTED")) return "activity-badge activity-badge--create";
  if (at.startsWith("UPDATED")) return "activity-badge activity-badge--update";
  if (at.startsWith("DELETED")) return "activity-badge activity-badge--delete";
  return "activity-badge activity-badge--default";
}

function Activity() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const result = await getActivityHistory({ limit: 50 });
        setActivities(result.items || []);
      } catch (err) {
        console.error("Failed to fetch activity history:", err);
        toast.error("Could not load activity history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchActivities();
  }, []);

  return (
    <div className="activity-page">
      <h2>Activity History</h2>
      <p className="activity-subtitle">
        A timeline of all your recent actions across Digital Twin.
      </p>

      {isLoading ? (
        <p>Loading activity...</p>
      ) : activities.length === 0 ? (
        <p>No activity found.</p>
      ) : (
        <div className="activity-card">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => {
                // action_type is like: CREATED_FINANCE, UPDATED_STUDY, DELETED_HABIT, UPSERTED_HABIT
                const at = act.action_type || "";
                return (
                  <tr key={act.id}>
                    <td>
                      {new Date(act.timestamp).toLocaleString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <span className={badgeClassFor(at)}>
                        {at.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{act.entity_type}</td>
                    <td className="activity-description">
                      {act.description || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Activity;
