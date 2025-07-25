const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all users
router.get('/', (req, res) => {
  const users = db.prepare('SELECT id, username, email, first_name, last_name, profile_picture_url FROM users').all();
  res.json(users);
});

// GET single user by id
router.get('/:id', (req, res) => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const user = stmt.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST create new user
router.post('/', (req, res) => {
  const { email, username, password_hash, first_name, last_name } = req.body;
  const stmt = db.prepare(`
    INSERT INTO users (email, username, password_hash, first_name, last_name)
    VALUES (?, ?, ?, ?, ?)
  `);
  try {
    const info = stmt.run(email, username, password_hash, first_name, last_name);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const info = stmt.run(req.params.id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ success: true });
});

module.exports = router;
