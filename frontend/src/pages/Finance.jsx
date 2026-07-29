import { useState, useEffect } from "react";

import FinanceSummary from "../components/FinanceSummary";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import ExpenseChart from "../components/ExpenseChart";
import CategoryChart from "../components/CategoryChart";
import SavingsProgress from "../components/SavingsProgress";

import { getTransactions, createTransaction } from "../services/financeService";

import "../styles/Finance.css";

function Finance() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState("");

  // Fetch transactions on mount
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const result = await getTransactions({ limit: 50 });
        setTransactions(result.data || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError("Could not load transactions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  /**
   * Submits a new transaction to the backend and prepends it to the local list.
   * TransactionForm passes { date, type, category, amount, description }.
   * We map these to the backend's FinanceCreateRequest schema.
   */
  const addTransaction = async (formData) => {
    try {
      const payload = {
        type: formData.type,           // "Income" | "Expense"
        amount: Number(formData.amount),
        category: formData.category,
        description: formData.description || undefined,
        transaction_date: formData.date
          ? new Date(formData.date).toISOString()
          : undefined,
      };
      const newRecord = await createTransaction(payload);
      setTransactions((prev) => [newRecord, ...prev]);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to add transaction.";
      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  return (
    <div className="finance-page">
      <h2>Finance Dashboard</h2>

      {error && (
        <p style={{ color: "#e53e3e", marginBottom: "1rem" }}>{error}</p>
      )}

      {isLoading ? (
        <p>Loading transactions…</p>
      ) : (
        <>
          <FinanceSummary transactions={transactions} />

          <TransactionForm addTransaction={addTransaction} />

          <div className="chart-section">
            <ExpenseChart />
            <CategoryChart />
          </div>

          <SavingsProgress transactions={transactions} />

          <TransactionTable transactions={transactions} />
        </>
      )}
    </div>
  );
}

export default Finance;