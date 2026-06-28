import { useBudget } from '../context/BudgetContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line, Area, AreaChart,
  ResponsiveContainer
} from 'recharts';
import './Charts.css';

const MONTH_NAMES = {
  '01': 'Jan', '02': 'Feb', '03': 'Már', '04': 'Ápr',
  '05': 'Máj', '06': 'Jún', '07': 'Júl', '08': 'Aug',
  '09': 'Sze', '10': 'Okt', '11': 'Nov', '12': 'Dec'
};

function formatAmount(val) {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}e`;
  return val.toString();
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {new Intl.NumberFormat('hu-HU').format(entry.value)} Ft
        </p>
      ))}
    </div>
  );
};

export default function Charts() {
  const { monthlyStats, categoryStats, loading } = useBudget();

  if (loading) return <div className="charts-loading">Grafikonok betöltése...</div>;

  const barData = monthlyStats.map(m => ({
    name: MONTH_NAMES[m.month.split('-')[1]] + ' ' + m.month.split('-')[0].slice(2),
    Bevétel: m.income,
    Kiadás: m.expense,
  }));

  const expenseStats = categoryStats.filter(c => c.category_type === 'expense' && c.total > 0);
  const pieData = expenseStats.map(c => ({
    name: `${c.category_icon} ${c.category_name}`,
    value: c.total,
    color: c.category_color,
  }));

  const lineData = monthlyStats.map(m => ({
    name: MONTH_NAMES[m.month.split('-')[1]] + ' ' + m.month.split('-')[0].slice(2),
    Egyenleg: m.balance,
  }));

  return (
    <section className="charts-section" id="charts">
      <h2 className="section-title">📊 Grafikonok</h2>
      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-card">
          <h3>Havi Bevétel vs Kiadás</h3>
          {barData.length === 0 ? (
            <div className="chart-empty">Nincs elegendő adat</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickFormatter={formatAmount} />
                <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }} />
                <Bar dataKey="Bevétel" fill="#00d4aa" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Kiadás" fill="#ef476f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <h3>Kiadások Megoszlása</h3>
          {pieData.length === 0 ? (
            <div className="chart-empty">Nincs elegendő adat</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="40%" cy="50%"
                  innerRadius={55} outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Area/Line Chart */}
        <div className="chart-card chart-wide">
          <h3>Egyenleg Alakulása</h3>
          {lineData.length === 0 ? (
            <div className="chart-empty">Nincs elegendő adat</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickFormatter={formatAmount} />
                <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                <Area type="monotone" dataKey="Egyenleg" stroke="#a78bfa" strokeWidth={2.5}
                  fill="url(#balanceGrad)" dot={{ fill: '#a78bfa', r: 4 }}
                  activeDot={{ r: 6, fill: '#7c3aed' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}
