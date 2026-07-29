import { useState } from "react";

function PredictionHistory({ history }) {

  const [search, setSearch] = useState("");

  const filteredHistory = history.filter((item) =>
    item.date.includes(search)
  );

  return (
    <div className="history-card">

      <div className="history-header">

        <h3>Prediction History</h3>

        <input
          type="text"
          placeholder="Search Date..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      <table>

        <thead>

          <tr>

            <th>Date</th>

            <th>Finance</th>

            <th>Study</th>

            <th>Health</th>

            <th>Overall</th>

          </tr>

        </thead>

        <tbody>

          {filteredHistory.map((item) => (

            <tr key={item.id}>

              <td>{item.date}</td>

              <td>{item.finance}%</td>

              <td>{item.study}%</td>

              <td>{item.health}%</td>

              <td>{item.overall}%</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default PredictionHistory;