import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../utils/api';

const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0, transaction_count: 0 });
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    category_id: '',
    date_from: '',
    date_to: '',
  });

  // Load categories once
  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Load data whenever filters change
  const refreshData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const [txs, sum, catStats, monthly] = await Promise.all([
        api.getTransactions(filters),
        api.getSummary(filters),
        api.getCategoryStats(filters),
        api.getMonthlyStats(filters),
      ]);
      setTransactions(txs);
      setSummary(sum);
      setCategoryStats(catStats);
      setMonthlyStats(monthly);
    } catch (err) {
      setError(err.message);
      console.error('Data refresh error:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // CRUD operations
  const addTransaction = async (data) => {
    await api.createTransaction(data);
    await refreshData(false);
  };

  const editTransaction = async (id, data) => {
    await api.updateTransaction(id, data);
    await refreshData(false);
  };

  const removeTransaction = async (id) => {
    await api.deleteTransaction(id);
    await refreshData(false);
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({ type: '', category_id: '', date_from: '', date_to: '' });
  };

  return (
    <BudgetContext.Provider value={{
      transactions,
      categories,
      summary,
      categoryStats,
      monthlyStats,
      loading,
      error,
      filters,
      addTransaction,
      editTransaction,
      removeTransaction,
      updateFilters,
      clearFilters,
      refreshData,
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
