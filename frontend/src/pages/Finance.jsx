import { useState } from "react";

import FinanceSummary from "../components/FinanceSummary";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import ExpenseChart from "../components/ExpenseChart";
import CategoryChart from "../components/CategoryChart";
import SavingsProgress from "../components/SavingsProgress";

import { transactions as initialTransactions } from "../data/financeData";

import "../styles/Finance.css";

function Finance() {
  const [transactions, setTransactions] = useState(initialTransactions);

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
    };

    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <div className="finance-page">
      <h2>Finance Dashboard</h2>

      <FinanceSummary transactions={transactions} />

      <TransactionForm addTransaction={addTransaction} />

      <div className="chart-section">
        <ExpenseChart />
        <CategoryChart />
      </div>

      <SavingsProgress transactions={transactions} />

      <TransactionTable transactions={transactions} />
    </div>
  );
}

export default Finance;