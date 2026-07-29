import { useState } from "react";

function TransactionForm({ addTransaction }) {
  const [formData, setFormData] = useState({
    date: "",
    type: "Expense",
    category: "",
    amount: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.category ||
      !formData.amount
    ) {
      alert("Please fill all required fields.");
      return;
    }

    addTransaction(formData);

    setFormData({
      date: "",
      type: "Expense",
      category: "",
      amount: "",
      description: "",
    });
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
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option>Income</option>
          <option>Expense</option>
        </select>

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <button className="save-btn">
        Add Transaction
      </button>
    </form>
  );
}

export default TransactionForm;