import { useState, useEffect } from "react";
import { toast } from "react-toastify";

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

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const result = await getTransactions({ limit: 50 });
        setTransactions(result.data || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        toast.error("Could not load transactions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  /**
   * Submits a new transaction to the backend and prepends it to the local list.
   * TransactionForm now sends correctly-cased enum values (INCOME, EXPENSE, FOOD, etc.)
   * matching the FinancialRecord model.
   */
  const addTransaction = async (formData) => {
    const payload = {
      type:             formData.type,        // e.g. "INCOME" | "EXPENSE"
      amount:           Number(formData.amount),
      category:         formData.category,    // e.g. "SALARY" | "FOOD"
      description:      formData.description || undefined,
      transaction_date: formData.date
        ? new Date(formData.date).toISOString()
        : undefined,
    };
    const newRecord = await createTransaction(payload);
    setTransactions((prev) => [newRecord, ...prev]);
  };

  return (
    <div className="finance-page">
      <h2>Finance Dashboard</h2>

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