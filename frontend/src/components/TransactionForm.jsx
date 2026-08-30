import { useState } from "react";
import { toast } from "react-toastify";
import { Input, Select } from "./ui/Field";
import Button from "./ui/Button";

/**
 * TransactionForm — creates or updates a financial record.
 * Maps to POST/PATCH /api/v1/finance/transactions.
 */
function TransactionForm({
  addTransaction,
  initialData = null,
  onUpdate = null,
  onCancel = null,
  goals = [],
}) {
  const [formData, setFormData] = useState(
    initialData || {
      date: "",
      type: "",
      category: "",
      amount: "",
      description: "",
      linked_goal_id: "",
    }
  );

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
      if (initialData && onUpdate) {
        await onUpdate(initialData.id, formData);
      } else {
        await addTransaction(formData);

        setFormData({
          date: "",
          type: "",
          category: "",
          amount: "",
          description: "",
          linked_goal_id: "",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-5">

        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <Select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Type
          </option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
          <option value="SAVINGS_DEPOSIT">Savings Deposit</option>
          <option value="INVESTMENT">Investment</option>
        </Select>

        <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Category
          </option>
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
        </Select>

        <Input
          type="number"
          name="amount"
          placeholder="Amount"
          min="1"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <Select
          name="linked_goal_id"
          value={formData.linked_goal_id || ""}
          onChange={handleChange}
        >
          <option value="">No Goal</option>

          {goals.map((goal) => (
            <option key={goal.goal_id} value={goal.goal_id}>
              {goal.title}
            </option>
          ))}
        </Select>

        <Input
          type="text"
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
        />

      </div>

      <div className="mt-5 flex gap-2.5">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Transaction"
            : "Add Transaction"}
        </Button>

        {initialData && onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default TransactionForm;