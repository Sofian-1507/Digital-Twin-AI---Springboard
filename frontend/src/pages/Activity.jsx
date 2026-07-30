import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getActivityHistory } from "../services/activityService";

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
    <div style={{ padding: '20px' }}>
      <h2>Activity History</h2>
      <p style={{ color: 'var(--text-secondary, #64748b)', marginBottom: '20px' }}>
        A timeline of all your recent actions across Digital Twin.
      </p>

      {isLoading ? (
        <p>Loading activity...</p>
      ) : activities.length === 0 ? (
        <p>No activity found.</p>
      ) : (
        <div style={{ backgroundColor: 'var(--card-bg, #fff)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                <th style={{ padding: '12px 10px', color: 'var(--text-secondary, #64748b)' }}>Time</th>
                <th style={{ padding: '12px 10px', color: 'var(--text-secondary, #64748b)' }}>Action</th>
                <th style={{ padding: '12px 10px', color: 'var(--text-secondary, #64748b)' }}>Entity</th>
                <th style={{ padding: '12px 10px', color: 'var(--text-secondary, #64748b)' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => {
                // action_type is like: CREATED_FINANCE, UPDATED_STUDY, DELETED_HABIT, UPSERTED_HABIT
                const at = act.action_type || "";
                const isCreate  = at.startsWith("CREATED") || at.startsWith("UPSERTED");
                const isUpdate  = at.startsWith("UPDATED");
                const isDelete  = at.startsWith("DELETED");
                const badgeBg   = isCreate ? 'rgba(34, 197, 94, 0.1)'
                                : isUpdate ? 'rgba(59, 130, 246, 0.1)'
                                : isDelete ? 'rgba(239, 68, 68, 0.1)'
                                : '#f1f5f9';
                const badgeColor = isCreate ? '#16a34a'
                                 : isUpdate ? '#2563eb'
                                 : isDelete ? '#dc2626'
                                 : '#64748b';
                return (
                  <tr key={act.id} style={{ borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                    <td style={{ padding: '12px 10px' }}>
                      {new Date(act.timestamp).toLocaleString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold',
                        backgroundColor: badgeBg,
                        color: badgeColor
                      }}>
                        {at.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>{act.entity_type}</td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-secondary, #64748b)' }}>
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
