import { useState, useEffect } from 'react';
import { useBudget } from '../context/BudgetContext';
import './TransactionForm.css';

export default function TransactionForm({ editingTransaction, onClose }) {
  const { categories, addTransaction, editTransaction } = useBudget();
  const isEditing = !!editingTransaction;

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category_id: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type,
        amount: editingTransaction.amount.toString(),
        category_id: editingTransaction.category_id.toString(),
        description: editingTransaction.description || '',
        date: editingTransaction.date,
      });
    }
  }, [editingTransaction]);

  const filteredCategories = categories.filter(c => c.type === formData.type);

  // Reset category when type changes (only when not editing)
  useEffect(() => {
    if (!isEditing) {
      setFormData(prev => ({ ...prev, category_id: '' }));
    }
  }, [formData.type, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Kérjük, adjon meg érvényes összeget!');
      return;
    }
    if (!formData.category_id) {
      setError('Kérjük, válasszon kategóriát!');
      return;
    }
    if (!formData.date) {
      setError('Kérjük, adjon meg dátumot!');
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
      };

      if (isEditing) {
        await editTransaction(editingTransaction.id, data);
      } else {
        await addTransaction(data);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? '✏️ Tranzakció Szerkesztése' : '➕ Új Tranzakció'}</h2>
          <button className="modal-close" onClick={onClose} id="close-modal-btn">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form" id="transaction-form">
          {error && <div className="form-error">{error}</div>}

          <div className="type-toggle">
            <button
              type="button"
              className={`type-btn ${formData.type === 'income' ? 'active income' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              id="type-income-btn"
            >
              📈 Bevétel
            </button>
            <button
              type="button"
              className={`type-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              id="type-expense-btn"
            >
              📉 Kiadás
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Összeg (Ft)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="pl. 50000"
              min="1"
              step="1"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Kategória</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Válasszon kategóriát...</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Dátum</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Leírás (opcionális)</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="pl. Heti nagybevásárlás"
            />
          </div>

          <button
            type="submit"
            className={`submit-btn ${formData.type}`}
            disabled={submitting}
            id="submit-transaction-btn"
          >
            {submitting ? 'Mentés...' : isEditing ? 'Mentés' : 'Hozzáadás'}
          </button>
        </form>
      </div>
    </div>
  );
}
