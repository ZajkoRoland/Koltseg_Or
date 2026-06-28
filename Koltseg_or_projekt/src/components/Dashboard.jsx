import { useBudget } from '../context/BudgetContext';
import './Dashboard.css';

function formatCurrency(amount) {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Dashboard() {
  const { summary, loading } = useBudget();

  return (
    <section className="dashboard" id="dashboard">
      <div className="dashboard-card balance-card">
        <div className="card-icon">💵</div>
        <div className="card-content">
          <span className="card-label">Egyenleg</span>
          <span className={`card-value ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
            {loading ? '...' : formatCurrency(summary.balance)}
          </span>
        </div>
        <div className="card-glow balance-glow"></div>
      </div>

      <div className="dashboard-card income-card">
        <div className="card-icon">📈</div>
        <div className="card-content">
          <span className="card-label">Összes Bevétel</span>
          <span className="card-value positive">
            {loading ? '...' : formatCurrency(summary.total_income)}
          </span>
        </div>
        <div className="card-glow income-glow"></div>
      </div>

      <div className="dashboard-card expense-card">
        <div className="card-icon">📉</div>
        <div className="card-content">
          <span className="card-label">Összes Kiadás</span>
          <span className="card-value negative">
            {loading ? '...' : formatCurrency(summary.total_expense)}
          </span>
        </div>
        <div className="card-glow expense-glow"></div>
      </div>

      <div className="dashboard-card count-card">
        <div className="card-icon">📋</div>
        <div className="card-content">
          <span className="card-label">Kiadások</span>
          <span className="card-value neutral">
            {loading ? '...' : summary.transaction_count} db
          </span>
        </div>
        <div className="card-glow count-glow"></div>
      </div>
    </section>
  );
}

export { formatCurrency };
