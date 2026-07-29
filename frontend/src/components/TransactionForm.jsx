import { useState } from "react";
import { toast } from "react-toastify";

/**
 * TransactionForm — creates a new financial record.
 * Maps to POST /api/v1/finance (FinanceCreateRequest).
 *
 * Backend enum values (must be uppercase):
 *   type:     INCOME | EXPENSE | SAVINGS_DEPOSIT | INVESTMENT
 *   category: HOUSING | FOOD | UTILITIES | SALARY | ENTERTAINMENT |
 *             HEALTH | EDUCATION | INVESTMENT | TRANSPORT | SAVINGS | OTHER
 */
function TransactionForm({ addTransaction }) {
  const [formData, setFormData] = useState({
    date:        "",
    type:        "EXPENSE",
    category:    "OTHER",
    amount:      "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.amount) {
      toast.error("Please fill in Date and Amount.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      toast.error("Amount must be greater than 0.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addTransaction(formData);
      setFormData({
        date:        "",
        type:        "EXPENSE",
        category:    "OTHER",
        amount:      "",
        description: "",
      });
      toast.success("Transaction added successfully.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="transaction-form"
      onSubmit={submitHandler}
    >
      <h3>Add Transaction</h3>

      <div className="form-grid">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
          <option value="SAVINGS_DEPOSIT">Savings Deposit</option>
          <option value="INVESTMENT">Investment</option>
        </select>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="SALARY">Salary</option>
          <option value="FOOD">Food</option>
          <option value="HOUSING">Housing</option>
          <option value="UTILITIES">Utilities</option>
          <option value="ENTERTAINMENT">Entertainment</option>
          <option value="HEALTH">Health</option>
          <option value="EDUCATION">Education</option>
          <option value="INVESTMENT">Investment</option>
          <option value="TRANSPORT">Transport</option>
          <option value="SAVINGS">Savings</option>
          <option value="OTHER">Other</option>
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          min="0.01"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <button className="save-btn" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  );
}

export default TransactionForm;