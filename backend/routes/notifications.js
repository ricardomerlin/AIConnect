const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all notifications for a user
router.get('/user/:userId', (req, res) => {
  const stmt = db.prepare(`
    SELECT * FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `);
  const notifications = stmt.all(req.params.userId);
  res.json(notifications);
});

// POST a new notification
router.post('/', (req, res) => {
  const { user_id, type, message } = req.body;
  const stmt = db.prepare(`
    INSERT INTO notifications (user_id, type, message)
    VALUES (?, ?, ?)
  `);
  try {
    const info = stmt.run(user_id, type, message);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT mark notification as read
router.put('/:id/read', (req, res) => {
  const stmt = db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?');
  const info = stmt.run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Notification not found' });
  res.json({ success: true });
});

// DELETE a notification
router.delete('/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM notifications WHERE id = ?');
  const info = stmt.run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Notification not found' });
  res.json({ success: true });
});

module.exports = router;
