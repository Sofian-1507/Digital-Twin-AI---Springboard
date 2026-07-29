import { useState } from "react";

function TransactionTable({ transactions }) {
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions.filter((item) =>
    item.category
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="table-card">
      <div className="table-header">
        <h3>Transaction History</h3>

        <input
          type="text"
          placeholder="Search category..."
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
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {filteredTransactions.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>

              <td>
                <span
                  className={
                    item.type === "Income"
                      ? "income-tag"
                      : "expense-tag"
                  }
                >
                  {item.type}
                </span>
              </td>

              <td>{item.category}</td>

              <td>${item.amount}</td>

              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;