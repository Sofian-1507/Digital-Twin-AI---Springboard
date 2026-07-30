import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

function TransactionTable({ transactions, onEdit, onDelete }) {
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
            <th>Actions</th>
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

export default TransactionTable;