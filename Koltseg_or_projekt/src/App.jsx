import { useState } from 'react';
import { BudgetProvider } from './context/BudgetContext';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import Filters from './components/Filters';
import './App.css';

function AppContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleAddNew = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="app">
      <header className="app-header" id="app-header">
        <div className="header-left">
          <h1 className="app-title">
            <span className="title-icon">💵</span>
            KöltségŐr
          </h1>
          <p className="app-subtitle">Költségvetés Követő</p>
        </div>
        <button className="add-btn" onClick={handleAddNew} id="add-transaction-btn">
          <span className="add-icon">+</span>
          Új Tranzakció
        </button>
      </header>

      <main className="app-main">
        <Dashboard />
        <Filters />
        <Charts />
        <TransactionList onEdit={handleEdit} />
      </main>

      <footer className="app-footer">
        <p>KöltségŐr © 2026 — Költségvetés Követő Rendszer</p>
      </footer>

      {showForm && (
        <TransactionForm
          editingTransaction={editingTransaction}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BudgetProvider>
      <AppContent />
    </BudgetProvider>
  );
}
