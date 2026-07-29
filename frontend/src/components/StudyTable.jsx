import { useState } from "react";

function StudyTable({ sessions }) {

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const filteredSessions = sessions.filter((item) => {

    const subjectMatch = item.subject
      .toLowerCase()
      .includes(search.toLowerCase());

    const statusMatch =
      status === "All"
        ? true
        : item.status === status;

    return subjectMatch && statusMatch;
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
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>

        </div>

      </div>

      <table>

        <thead>

          <tr>

            <th>Date</th>

            <th>Subject</th>

            <th>Hours</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {filteredSessions.map((item) => (

            <tr key={item.id}>

              <td>{item.date}</td>

              <td>{item.subject}</td>

              <td>{item.hours} hrs</td>

              <td>

                <span
                  className={
                    item.status === "Completed"
                      ? "completed-tag"
                      : "pending-tag"
                  }
                >
                  {item.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default StudyTable;