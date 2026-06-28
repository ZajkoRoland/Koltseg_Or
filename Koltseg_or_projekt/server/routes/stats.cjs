const express = require('express');
const router = express.Router();
const { db } = require('../database.cjs');

// GET /api/stats/summary - Overall summary
router.get('/summary', (req, res) => {
  try {
    const { date_from, date_to } = req.query;
    
    let whereClause = '';
    const params = [];
    
    if (date_from) {
      whereClause += ' AND date >= ?';
      params.push(date_from);
    }
    if (date_to) {
      whereClause += ' AND date <= ?';
      params.push(date_to);
    }

    const income = db.prepare(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income'${whereClause}`
    ).get(...params);

    const expense = db.prepare(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense'${whereClause}`
    ).get(...params);

    const transactionCount = db.prepare(
      `SELECT COUNT(*) as count FROM transactions WHERE 1=1${whereClause}`
    ).get(...params);

    res.json({
      total_income: income.total,
      total_expense: expense.total,
      balance: income.total - expense.total,
      transaction_count: transactionCount.count,
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Hiba az összesítés lekérésekor' });
  }
});

// GET /api/stats/by-category - Breakdown by category
router.get('/by-category', (req, res) => {
  try {
    const { type, date_from, date_to } = req.query;

    let whereClause = '';
    const params = [];

    if (type) {
      whereClause += ' AND t.type = ?';
      params.push(type);
    }
    if (date_from) {
      whereClause += ' AND t.date >= ?';
      params.push(date_from);
    }
    if (date_to) {
      whereClause += ' AND t.date <= ?';
      params.push(date_to);
    }

    const stats = db.prepare(`
      SELECT 
        c.id as category_id,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        c.type as category_type,
        COALESCE(SUM(t.amount), 0) as total,
        COUNT(t.id) as count
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id ${whereClause ? 'AND 1=1' + whereClause : ''}
      GROUP BY c.id
      HAVING total > 0
      ORDER BY total DESC
    `).all(...params);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ error: 'Hiba a kategória statisztikák lekérésekor' });
  }
});

// GET /api/stats/monthly - Monthly breakdown
router.get('/monthly', (req, res) => {
  try {
    const { date_from, date_to } = req.query;

    let whereClause = '';
    const params = [];

    if (date_from) {
      whereClause += ' AND date >= ?';
      params.push(date_from);
    }
    if (date_to) {
      whereClause += ' AND date <= ?';
      params.push(date_to);
    }

    const monthly = db.prepare(`
      SELECT 
        strftime('%Y-%m', date) as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense,
        SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net
      FROM transactions
      WHERE 1=1${whereClause}
      GROUP BY strftime('%Y-%m', date)
      ORDER BY month ASC
    `).all(...params);

    // Calculate running balance
    let runningBalance = 0;
    const monthlyWithBalance = monthly.map(m => {
      runningBalance += m.net;
      return { ...m, balance: runningBalance };
    });

    res.json(monthlyWithBalance);
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    res.status(500).json({ error: 'Hiba a havi statisztikák lekérésekor' });
  }
});

module.exports = router;
