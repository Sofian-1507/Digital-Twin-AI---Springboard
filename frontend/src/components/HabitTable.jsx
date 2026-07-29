import { useState } from "react";

function HabitTable({ habits }) {

  const [searchMood, setSearchMood] = useState("");

  const filteredHabits = habits.filter((item) =>
    item.mood
      .toLowerCase()
      .includes(searchMood.toLowerCase())
  );

  return (
    <div className="habit-table-card">

      <div className="table-header">

        <h3>Habit History</h3>

        <input
          type="text"
          placeholder="Search Mood..."
          value={searchMood}
          onChange={(e) =>
            setSearchMood(e.target.value)
          }
        />

      </div>

      <table>

        <thead>

          <tr>

            <th>Date</th>

            <th>Water (L)</th>

            <th>Sleep</th>

            <th>Exercise</th>

            <th>Mood</th>

          </tr>

        </thead>

        <tbody>

          {filteredHabits.map((habit) => (

            <tr key={habit.id}>

              <td>{habit.date}</td>

              <td>{habit.water} L</td>

              <td>{habit.sleep} hrs</td>

              <td>{habit.exercise} min</td>

              <td>

                <span className="mood-tag">
                  {habit.mood}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default HabitTable;