import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

function StudyTable({ sessions, onEdit, onDelete }) {

  const [search, setSearch] = useState("");

  const [sessionType, setSessionType] = useState("All");

  const filteredSessions = sessions.filter((item) => {

    const subjectMatch = item.subject
      .toLowerCase()
      .includes(search.toLowerCase());

    const typeMatch =
      sessionType === "All"
        ? true
        : item.session_type === sessionType;

    return subjectMatch && typeMatch;
  });

  return (
    <div className="study-table-card">

      <div className="study-table-header">

        <h3>Study History</h3>

        <div className="study-filter">

          <input
            type="text"
            placeholder="Search Subject"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={sessionType}
            onChange={(e) =>
              setSessionType(e.target.value)
            }
          >
            <option value="All">All Types</option>
            <option value="DEEP_WORK">Deep Work</option>
            <option value="REVISION">Revision</option>
            <option value="LECTURE">Lecture</option>
            <option value="GROUP_STUDY">Group Study</option>
            <option value="PRACTICE">Practice</option>
          </select>

        </div>

      </div>

      <table>

        <thead>

          <tr>

            <th>Date</th>

            <th>Subject</th>

            <th>Hours</th>

            <th>Session Type</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {filteredSessions.map((item) => (

            <tr key={item.id}>

              <td>{item.session_date ? new Date(item.session_date).toLocaleDateString() : "-"}</td>

              <td>{item.subject}</td>

              <td>{item.study_hours ?? item.hours ?? 0} hrs</td>

              <td>

                <span
                  className={
                    item.session_type === "DEEP_WORK" || item.session_type === "REVISION"
                      ? "completed-tag"
                      : "pending-tag"
                  }
                >
                  {item.session_type ? item.session_type.replace(/_/g, " ") : "-"}
                </span>

              </td>

              <td>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => onEdit && onEdit(item)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    aria-label="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete && onDelete(item.id)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--danger-color, #ef4444)' }}
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default StudyTable;