import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import FinanceSummary from "../components/FinanceSummary";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import ExpenseChart from "../components/ExpenseChart";
import CategoryChart from "../components/CategoryChart";
import SavingsProgress from "../components/SavingsProgress";

import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "../services/financeService";

import "../styles/Finance.css";

function Finance() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);

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
    try {
      const payload = {
        type:             formData.type,
        amount:           Number(formData.amount),
        category:         formData.category,
        description:      formData.description || undefined,
        transaction_date: formData.date
          ? new Date(formData.date).toISOString()
          : undefined,
      };
      const newRecord = await createTransaction(payload);
      setTransactions((prev) => [newRecord, ...prev]);
      toast.success("Transaction added successfully.");
    } catch (err) {
      console.error("Failed to add transaction:", err);
      toast.error("Failed to add transaction. Please try again.");
      throw err; // Re-throw to allow TransactionForm to handle loading state if necessary
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const payload = {
        type:             formData.type,
        amount:           Number(formData.amount),
        category:         formData.category,
        description:      formData.description || undefined,
        transaction_date: formData.date
          ? new Date(formData.date).toISOString()
          : undefined,
      };
      const updatedRecord = await updateTransaction(id, payload);
      setTransactions((prev) => prev.map(t => t.id === id ? updatedRecord : t));
      toast.success("Transaction updated successfully.");
      setEditingRecord(null);
    } catch (err) {
      console.error("Failed to update transaction:", err);
      toast.error("Failed to update transaction. Please try again.");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter(t => t.id !== id));
      toast.success("Transaction deleted.");
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      toast.error("Failed to delete transaction.");
    }
  };

  const startEdit = (record) => {
    // Map record to formData shape
    const dateStr = record.transaction_date || record.date;
    const initialData = {
      id: record.id,
      date: dateStr ? dateStr.substring(0, 10) : "",
      type: record.type.toUpperCase(), // Income -> INCOME
      category: record.category.toUpperCase(),
      amount: record.amount,
      description: record.description || "",
    };
    setEditingRecord(initialData);
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

          <TransactionTable 
            transactions={transactions} 
            onEdit={startEdit} 
            onDelete={handleDelete} 
          />
        </>
      )}

      {editingRecord && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'var(--bg-color, #fff)', padding: '20px', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <TransactionForm 
              initialData={editingRecord} 
              onUpdate={handleUpdate} 
              onCancel={() => setEditingRecord(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Finance;