import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../context/useAuth";

import FinanceSummary from "../components/FinanceSummary";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import ExpenseChart from "../components/ExpenseChart";
import CategoryChart from "../components/CategoryChart";
import SavingsProgress from "../components/SavingsProgress";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";
import IncomeProjectionCard from "../components/IncomeProjectionCard";
import { Select } from "../components/ui/Field";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Drawer from "../components/ui/Drawer";
import { SkeletonStatGrid, SkeletonChart, SkeletonTable } from "../components/ui/Skeleton";

import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getCategoryBreakdown } from "../services/financeService";
import { getExpenseProjection, getIncomeProjection } from "../services/forecastService";

const TRANSACTION_TYPES = ["INCOME", "EXPENSE", "SAVINGS_DEPOSIT", "INVESTMENT"];
const FINANCIAL_CATEGORIES = [
  "HOUSING", "FOOD", "UTILITIES", "SALARY", "ENTERTAINMENT",
  "HEALTH", "EDUCATION", "INVESTMENT", "TRANSPORT", "SAVINGS", "OTHER",
];

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
  const { user } = useAuth();
  // First FINANCE-category goal the user has set — used as the real savings
  // target instead of a hardcoded placeholder. null if they haven't set one.
  const savingsGoal = user?.active_goals?.find((g) => g.category === "FINANCE") ?? null;

  const [transactions, setTransactions] = useState([]);
  const [expenseChartData, setExpenseChartData] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [incomeProjection, setIncomeProjection] = useState(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  // Filtered + paginated transaction table state (independent of the
  // dashboard summary/charts above, which always reflect recent activity).
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [result, forecast, categoryBreakdown, income] = await Promise.all([
          getTransactions({ limit: 50 }),
          getExpenseProjection(3),
          getCategoryBreakdown(1),
          getIncomeProjection(3),
        ]);
        const txns = result.data || [];
        setTransactions(txns);
        setTotalPages(result.total_pages || 1);
        setExpenseChartData(buildExpenseChartData(txns, forecast));
        setCategoryChartData(
          categoryBreakdown.map((c) => ({ name: c.category, value: Number(c.total_amount) }))
        );
        setIncomeProjection(income);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        toast.error("Could not load transactions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  // Re-fetch the table page whenever filters or page change (skips the
  // very first render, which is covered by the dashboard fetch above).
  useEffect(() => {
    if (isLoading) return;
    // Guards against an older in-flight request resolving after a newer one (e.g. rapid
    // page-clicks or a filter change fired mid-fetch) and overwriting fresher data.
    let cancelled = false;
    async function fetchTablePage() {
      setIsTableLoading(true);
      try {
        const result = await getTransactions({
          page,
          limit: 20,
          ...(typeFilter ? { type: typeFilter } : {}),
          ...(categoryFilter ? { category: categoryFilter } : {}),
        });
        if (cancelled) return;
        setTransactions(result.data || []);
        setTotalPages(result.total_pages || 1);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch transactions:", err);
        toast.error("Could not load transactions. Please try again later.");
      } finally {
        if (!cancelled) setIsTableLoading(false);
      }
    }
    fetchTablePage();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, typeFilter, categoryFilter]);

  function handleTypeFilterChange(e) {
    setTypeFilter(e.target.value);
    setPage(1);
  }

  function handleCategoryFilterChange(e) {
    setCategoryFilter(e.target.value);
    setPage(1);
  }

  function clearFilters() {
    setTypeFilter("");
    setCategoryFilter("");
    setPage(1);
  }

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
      setAddDrawerOpen(false);
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
      type: (record.type || "EXPENSE").toUpperCase(), // Income -> INCOME
      category: (record.category || "OTHER").toUpperCase(),
      amount: record.amount,
      description: record.description || "",
    };
    setEditingRecord(initialData);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Finance Dashboard</h2>
        <Button onClick={() => setAddDrawerOpen(true)}>+ Add Transaction</Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-5">
          <SkeletonStatGrid count={3} />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
            <SkeletonChart />
            <SkeletonChart />
          </div>
          <SkeletonTable rows={6} cols={5} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <FinanceSummary transactions={transactions} />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
            <ExpenseChart data={expenseChartData} />
            <CategoryChart data={categoryChartData} />
          </div>

          <IncomeProjectionCard projection={incomeProjection} />

          <SavingsProgress transactions={transactions} goal={savingsGoal} />

          <div className="flex flex-wrap items-center gap-3">
            <Select value={typeFilter} onChange={handleTypeFilterChange} aria-label="Filter by type" className="w-auto">
              <option value="">All types</option>
              {TRANSACTION_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace("_", " ")}</option>
              ))}
            </Select>

            <Select value={categoryFilter} onChange={handleCategoryFilterChange} aria-label="Filter by category" className="w-auto">
              <option value="">All categories</option>
              {FINANCIAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>

            {(typeFilter || categoryFilter) && (
              <Button type="button" variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>

          {isTableLoading ? (
            <SkeletonTable rows={6} cols={5} />
          ) : (
            <TransactionTable
              transactions={transactions}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} disabled={isTableLoading} />
        </div>
      )}

      <Drawer open={addDrawerOpen} onClose={() => setAddDrawerOpen(false)} title="Add Transaction">
        <TransactionForm addTransaction={addTransaction} />
      </Drawer>

      <Modal open={!!editingRecord} onClose={() => setEditingRecord(null)} title="Edit Transaction" maxWidth="max-w-xl">
        <TransactionForm
          initialData={editingRecord}
          onUpdate={handleUpdate}
          onCancel={() => setEditingRecord(null)}
        />
      </Modal>

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
