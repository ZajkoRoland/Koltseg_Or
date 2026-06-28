const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'budget.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      icon TEXT,
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      amount REAL NOT NULL CHECK(amount > 0),
      category_id INTEGER NOT NULL,
      description TEXT DEFAULT '',
      date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
    CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
  `);

  // Seed categories if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM categories').get();
  if (count.c === 0) {
    const insert = db.prepare('INSERT INTO categories (name, type, icon, color) VALUES (?, ?, ?, ?)');
    const seedCategories = db.transaction((categories) => {
      for (const cat of categories) {
        insert.run(cat.name, cat.type, cat.icon, cat.color);
      }
    });

    seedCategories([
      // Income categories
      { name: 'Fizetés', type: 'income', icon: '💰', color: '#00d4aa' },
      { name: 'Freelance', type: 'income', icon: '💼', color: '#00b4d8' },
      { name: 'Befektetés', type: 'income', icon: '📈', color: '#7209b7' },
      { name: 'Ajándék', type: 'income', icon: '🎁', color: '#f72585' },
      { name: 'Egyéb bevétel', type: 'income', icon: '📦', color: '#4cc9f0' },
      // Expense categories
      { name: 'Élelmiszer', type: 'expense', icon: '🛒', color: '#ef476f' },
      { name: 'Lakhatás', type: 'expense', icon: '🏠', color: '#ffd166' },
      { name: 'Közlekedés', type: 'expense', icon: '🚗', color: '#06d6a0' },
      { name: 'Egészségügy', type: 'expense', icon: '💊', color: '#118ab2' },
      { name: 'Szórakozás', type: 'expense', icon: '🎬', color: '#e63946' },
      { name: 'Ruházat', type: 'expense', icon: '👕', color: '#a8dadc' },
      { name: 'Oktatás', type: 'expense', icon: '📚', color: '#457b9d' },
      { name: 'Rezsi', type: 'expense', icon: '💡', color: '#f4a261' },
      { name: 'Egyéb kiadás', type: 'expense', icon: '📦', color: '#e76f51' },
    ]);

    // Seed some demo transactions
    const insertTx = db.prepare(
      'INSERT INTO transactions (type, amount, category_id, description, date) VALUES (?, ?, ?, ?, ?)'
    );
    const seedTransactions = db.transaction((txs) => {
      for (const tx of txs) {
        insertTx.run(tx.type, tx.amount, tx.category_id, tx.description, tx.date);
      }
    });

    seedTransactions([
      { type: 'income', amount: 450000, category_id: 1, description: 'Havi fizetés - Január', date: '2026-01-05' },
      { type: 'income', amount: 450000, category_id: 1, description: 'Havi fizetés - Február', date: '2026-02-05' },
      { type: 'income', amount: 450000, category_id: 1, description: 'Havi fizetés - Március', date: '2026-03-05' },
      { type: 'income', amount: 450000, category_id: 1, description: 'Havi fizetés - Április', date: '2026-04-05' },
      { type: 'income', amount: 450000, category_id: 1, description: 'Havi fizetés - Május', date: '2026-05-05' },
      { type: 'income', amount: 120000, category_id: 2, description: 'Weboldal fejlesztés', date: '2026-01-15' },
      { type: 'income', amount: 85000, category_id: 2, description: 'Logo dizájn', date: '2026-03-20' },
      { type: 'income', amount: 50000, category_id: 4, description: 'Születésnapi ajándék', date: '2026-02-14' },
      { type: 'expense', amount: 45000, category_id: 6, description: 'Heti nagybevásárlás', date: '2026-01-07' },
      { type: 'expense', amount: 38000, category_id: 6, description: 'Heti nagybevásárlás', date: '2026-01-14' },
      { type: 'expense', amount: 42000, category_id: 6, description: 'Heti nagybevásárlás', date: '2026-02-08' },
      { type: 'expense', amount: 35000, category_id: 6, description: 'Heti nagybevásárlás', date: '2026-03-10' },
      { type: 'expense', amount: 40000, category_id: 6, description: 'Heti nagybevásárlás', date: '2026-04-12' },
      { type: 'expense', amount: 150000, category_id: 7, description: 'Albérlet', date: '2026-01-01' },
      { type: 'expense', amount: 150000, category_id: 7, description: 'Albérlet', date: '2026-02-01' },
      { type: 'expense', amount: 150000, category_id: 7, description: 'Albérlet', date: '2026-03-01' },
      { type: 'expense', amount: 150000, category_id: 7, description: 'Albérlet', date: '2026-04-01' },
      { type: 'expense', amount: 150000, category_id: 7, description: 'Albérlet', date: '2026-05-01' },
      { type: 'expense', amount: 15000, category_id: 8, description: 'Benzin', date: '2026-01-10' },
      { type: 'expense', amount: 18000, category_id: 8, description: 'Benzin + autómosás', date: '2026-02-15' },
      { type: 'expense', amount: 12000, category_id: 8, description: 'BKK bérlet', date: '2026-03-01' },
      { type: 'expense', amount: 8500, category_id: 10, description: 'Mozi + vacsora', date: '2026-01-20' },
      { type: 'expense', amount: 12000, category_id: 10, description: 'Koncertjegy', date: '2026-02-28' },
      { type: 'expense', amount: 25000, category_id: 13, description: 'Villany + gáz', date: '2026-01-15' },
      { type: 'expense', amount: 22000, category_id: 13, description: 'Villany + gáz', date: '2026-02-15' },
      { type: 'expense', amount: 28000, category_id: 13, description: 'Villany + víz + gáz', date: '2026-03-15' },
      { type: 'expense', amount: 35000, category_id: 11, description: 'Tavaszi ruha', date: '2026-03-25' },
      { type: 'expense', amount: 15000, category_id: 9, description: 'Fogorvos', date: '2026-04-10' },
    ]);
  }
}

module.exports = { db, initializeDatabase };
