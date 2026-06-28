import { useBudget } from '../context/BudgetContext';
import './Filters.css';

export default function Filters() {
  const { categories, filters, updateFilters, clearFilters } = useBudget();

  const hasActiveFilters = filters.type || filters.category_id || filters.date_from || filters.date_to;

  const filteredCategories = filters.type
    ? categories.filter(c => c.type === filters.type)
    : categories;

  return (
    <section className="filters-section" id="filters">
      <div className="filters-header">
        <h2 className="section-title">🔍 Szűrők</h2>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters} id="clear-filters-btn">
            ✕ Törlés
          </button>
        )}
      </div>
      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="filter-type">Típus</label>
          <select
            id="filter-type"
            value={filters.type}
            onChange={e => updateFilters({ type: e.target.value, category_id: '' })}
          >
            <option value="">Mind</option>
            <option value="income">📈 Bevétel</option>
            <option value="expense">📉 Kiadás</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-category">Kategória</label>
          <select
            id="filter-category"
            value={filters.category_id}
            onChange={e => updateFilters({ category_id: e.target.value })}
          >
            <option value="">Összes</option>
            {filteredCategories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-date-from">Dátum tól</label>
          <input
            type="date"
            id="filter-date-from"
            value={filters.date_from}
            onChange={e => updateFilters({ date_from: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-date-to">Dátum ig</label>
          <input
            type="date"
            id="filter-date-to"
            value={filters.date_to}
            onChange={e => updateFilters({ date_to: e.target.value })}
          />
        </div>
      </div>
    </section>
  );
}
