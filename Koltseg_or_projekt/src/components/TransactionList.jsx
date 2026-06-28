import { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatCurrency } from './Dashboard';
import './TransactionList.css';

export default function TransactionList({ onEdit }) {
  const { transactions, removeTransaction, loading } = useBudget();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Biztosan törölni szeretné ezt a tranzakciót?')) return;
    setDeletingId(id);
    try {
      await removeTransaction(id);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <section className="transaction-list-section" id="transaction-list">
        <h2 className="section-title">📋 Tranzakciók</h2>
        <div className="loading-state">Betöltés...</div>
      </section>
    );
  }

  return (
    <section className="transaction-list-section" id="transaction-list">
      <h2 className="section-title">📋 Tranzakciók</h2>
      {transactions.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>Nincs megjeleníthető tranzakció</p>
        </div>
      ) : (
        <div className="transaction-list">
          {transactions.map(tx => (
            <div key={tx.id} className={`transaction-item ${tx.type}`} id={`transaction-${tx.id}`}>
              <div className="tx-icon">{tx.category_icon}</div>
              <div className="tx-details">
                <span className="tx-category">{tx.category_name}</span>
                <span className="tx-description">{tx.description || '—'}</span>
                <span className="tx-date">{new Date(tx.date).toLocaleDateString('hu-HU')}</span>
              </div>
              <div className="tx-right">
                <span className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                <div className="tx-actions">
                  <button className="action-btn edit-btn" onClick={() => onEdit(tx)} title="Szerkesztés">✏️</button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(tx.id)}
                    disabled={deletingId === tx.id}
                    title="Törlés"
                  >
                    {deletingId === tx.id ? '⏳' : '🗑️'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
