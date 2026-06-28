const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./database.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();
console.log('✅ Adatbázis inicializálva');

// API Routes
app.use('/api/transactions', require('./routes/transactions.cjs'));
app.use('/api/categories', require('./routes/categories.cjs'));
app.use('/api/stats', require('./routes/stats.cjs'));

// Serve static files in production
if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  // Fallback all GET requests to index.html for React Router / SPA
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 KöltségŐr API fut: http://localhost:${PORT}`);
  console.log(`📊 API végpontok:`);
  console.log(`   GET  /api/transactions`);
  console.log(`   POST /api/transactions`);
  console.log(`   PUT  /api/transactions/:id`);
  console.log(`   DEL  /api/transactions/:id`);
  console.log(`   GET  /api/categories`);
  console.log(`   GET  /api/stats/summary`);
  console.log(`   GET  /api/stats/by-category`);
  console.log(`   GET  /api/stats/monthly`);
});
