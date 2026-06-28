const express = require('express');
const router = express.Router();
const { db } = require('../database.cjs');

// GET /api/categories - List all categories
router.get('/', (req, res) => {
  try {
    const { type } = req.query;
    
    let query = 'SELECT * FROM categories';
    const params = [];

    if (type && (type === 'income' || type === 'expense')) {
      query += ' WHERE type = ?';
      params.push(type);
    }

    query += ' ORDER BY type, name';

    const categories = db.prepare(query).all(...params);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Hiba a kategóriák lekérésekor' });
  }
});

module.exports = router;
