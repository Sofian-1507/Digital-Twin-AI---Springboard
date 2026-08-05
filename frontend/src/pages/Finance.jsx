import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import FinanceSummary from "../components/FinanceSummary";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import ExpenseChart from "../components/ExpenseChart";
import CategoryChart from "../components/CategoryChart";
import SavingsProgress from "../components/SavingsProgress";
import ConfirmDialog from "../components/ConfirmDialog";

import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getCategoryBreakdown } from "../services/financeService";
import { getExpenseProjection } from "../services/forecastService";

import "../styles/Finance.css";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function monthLabel(year, month) {
  return `${MONTH_NAMES[month - 1]} ${String(year).slice(-2)}`;
}

/**
 * Builds ExpenseChart's [{ month, expense }] series: last 6 months of actual
 * expenses (derived from already-loaded transactions) followed by the
 * Financial Forecasting Service's projected future months.
 */
function buildExpenseChartData(transactions, forecast) {
  const historicalMap = {};
  for (const t of transactions) {
    if (String(t.type).toUpperCase() !== "EXPENSE") continue;
    const d = new Date(t.transaction_date || t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    historicalMap[key] = (historicalMap[key] || 0) + Number(t.amount || 0);
  }
  const historical = Object.entries(historicalMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, expense]) => {
      const [year, month] = key.split("-").map(Number);
      return { month: monthLabel(year, month), expense: Math.round(expense) };
    });

  const projected = (forecast?.projections || []).map((p) => ({
    month: monthLabel(p.year, p.month),
    expense: Math.round(Number(p.projected_amount)),
  }));

  return [...historical, ...projected];
}

function Finance() {
  const [transactions, setTransactions] = useState([]);
  const [expenseChartData, setExpenseChartData] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const [result, forecast, categoryBreakdown] = await Promise.all([
          getTransactions({ limit: 50 }),
          getExpenseProjection(3),
          getCategoryBreakdown(1),
        ]);
        const txns = result.data || [];
        setTransactions(txns);
        setExpenseChartData(buildExpenseChartData(txns, forecast));
        setCategoryChartData(
          categoryBreakdown.map((c) => ({ name: c.category, value: Number(c.total_amount) }))
        );
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

  const handleDelete = (id) => setConfirmDeleteId(id);

  const confirmDelete = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
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
            <ExpenseChart data={expenseChartData} />
            <CategoryChart data={categoryChartData} />
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

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

export default Finance;