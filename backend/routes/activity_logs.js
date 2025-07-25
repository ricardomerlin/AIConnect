const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all activity logs
router.get('/', (req, res) => {
  const logs = db.prepare(`
    SELECT a.*, u.username
    FROM activity_log a
    JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
  `).all();
  res.json(logs);
});

// GET activity logs for a specific user
router.get('/user/:userId', (req, res) => {
  const stmt = db.prepare(`
    SELECT * FROM activity_log
    WHERE user_id = ?
    ORDER BY created_at DESC
  `);
  const logs = stmt.all(req.params.userId);
  res.json(logs);
});

// GET single activity log entry by ID
router.get('/:id', (req, res) => {
  const stmt = db.prepare('SELECT * FROM activity_log WHERE id = ?');
  const log = stmt.get(req.params.id);
  if (!log) return res.status(404).json({ error: 'Activity log not found' });
  res.json(log);
});

// POST create new activity log entry
router.post('/', (req, res) => {
  const { user_id, activity_type, description } = req.body;

  const stmt = db.prepare(`
    INSERT INTO activity_log (user_id, activity_type, description)
    VALUES (?, ?, ?)
  `);

  try {
    const info = stmt.run(user_id, activity_type, description);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE an activity log entry
router.delete('/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM activity_log WHERE id = ?');
  const info = stmt.run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Log not found' });
  res.json({ success: true });
});

module.exports = router;
