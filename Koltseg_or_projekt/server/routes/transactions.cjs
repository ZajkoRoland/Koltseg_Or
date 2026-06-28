const express = require('express');
const router = express.Router();
const { db } = require('../database.cjs');

// GET /api/transactions - List all transactions with optional filters
router.get('/', (req, res) => {
  try {
    const { category_id, type, date_from, date_to } = req.query;
    
    let query = `
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category_id) {
      query += ' AND t.category_id = ?';
      params.push(category_id);
    }
    if (type && (type === 'income' || type === 'expense')) {
      query += ' AND t.type = ?';
      params.push(type);
    }
    if (date_from) {
      query += ' AND t.date >= ?';
      params.push(date_from);
    }
    if (date_to) {
      query += ' AND t.date <= ?';
      params.push(date_to);
    }

    query += ' ORDER BY t.date DESC, t.created_at DESC';

    const transactions = db.prepare(query).all(...params);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Hiba a tranzakciók lekérésekor' });
  }
});

// GET /api/transactions/:id - Get single transaction
router.get('/:id', (req, res) => {
  try {
    const transaction = db.prepare(`
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: 'Tranzakció nem található' });
    }
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Hiba a tranzakció lekérésekor' });
  }
});

// POST /api/transactions - Create new transaction
router.post('/', (req, res) => {
  try {
    const { type, amount, category_id, description, date } = req.body;

    // Validation
    if (!type || !['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Érvénytelen típus (income/expense)' });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Az összegnek pozitívnak kell lennie' });
    }
    if (!category_id) {
      return res.status(400).json({ error: 'Kategória megadása kötelező' });
    }
    if (!date) {
      return res.status(400).json({ error: 'Dátum megadása kötelező' });
    }

    const result = db.prepare(
      'INSERT INTO transactions (type, amount, category_id, description, date) VALUES (?, ?, ?, ?, ?)'
    ).run(type, amount, category_id, description || '', date);

    const newTransaction = db.prepare(`
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Hiba a tranzakció létrehozásakor' });
  }
});

// PUT /api/transactions/:id - Update transaction
router.put('/:id', (req, res) => {
  try {
    const { type, amount, category_id, description, date } = req.body;
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Tranzakció nem található' });
    }

    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Érvénytelen típus' });
    }
    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({ error: 'Az összegnek pozitívnak kell lennie' });
    }

    db.prepare(`
      UPDATE transactions 
      SET type = COALESCE(?, type),
          amount = COALESCE(?, amount),
          category_id = COALESCE(?, category_id),
          description = COALESCE(?, description),
          date = COALESCE(?, date)
      WHERE id = ?
    `).run(type || null, amount || null, category_id || null, description ?? null, date || null, id);

    const updated = db.prepare(`
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(id);

    res.json(updated);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Hiba a tranzakció módosításakor' });
  }
});

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Tranzakció nem található' });
    }

    db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id);
    res.json({ message: 'Tranzakció sikeresen törölve', id: Number(req.params.id) });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Hiba a tranzakció törlésekor' });
  }
});

module.exports = router;
