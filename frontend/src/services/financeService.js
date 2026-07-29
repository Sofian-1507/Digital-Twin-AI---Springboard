/**
 * src/services/financeService.js
 * Finance service layer — wraps /api/v1/finance/* endpoints.
 * All requests are authenticated via the Axios interceptor in api.js.
 */
import api from "./api";

/**
 * Fetch paginated transaction history.
 * GET /api/v1/finance/transactions
 * @param {{ page?, limit?, type?, category? }} params
 * @returns {Promise<{ data, total, page, limit, total_pages }>}
 */
export const getTransactions = async (params = {}) => {
  const response = await api.get("/finance/transactions", { params });
  return response.data;
};

/**
 * Create a new financial transaction.
 * POST /api/v1/finance/transactions
 * @param {{ type, amount, category, description?, is_recurring?, transaction_date? }} payload
 * @returns {Promise<FinanceRecordResponse>}
 */
export const createTransaction = async (payload) => {
  const response = await api.post("/finance/transactions", payload);
  return response.data;
};

/**
 * Fetch monthly cashflow aggregation for charts.
 * GET /api/v1/finance/analytics/cashflow
 * @param {number} [monthsBack=6]
 * @returns {Promise<MonthlyCashflowItem[]>}
 */
export const getCashflow = async (monthsBack = 6) => {
  const response = await api.get("/finance/analytics/cashflow", {
    params: { months_back: monthsBack },
  });
  return response.data;
};

/**
 * Fetch category spending breakdown (donut chart data).
 * GET /api/v1/finance/analytics/category
 * @param {number} [monthsBack=1]
 * @returns {Promise<CategoryBreakdownItem[]>}
 */
export const getCategoryBreakdown = async (monthsBack = 1) => {
  const response = await api.get("/finance/analytics/category", {
    params: { months_back: monthsBack },
  });
  return response.data;
};
