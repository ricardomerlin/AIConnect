const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all messages (optional: paginate or filter by user)
router.get('/', (req, res) => {
  const messages = db.prepare(`
    SELECT * FROM messages
    ORDER BY created_at DESC
  `).all();
  res.json(messages);
});

// GET messages between two users
router.get('/between/:user1/:user2', (req, res) => {
  const { user1, user2 } = req.params;
  const stmt = db.prepare(`
    SELECT * FROM messages
    WHERE (sender_id = ? AND receiver_id = ?)
       OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `);
  const conversation = stmt.all(user1, user2, user2, user1);
  res.json(conversation);
});

// POST new message
router.post('/', (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  const stmt = db.prepare(`
    INSERT INTO messages (sender_id, receiver_id, content)
    VALUES (?, ?, ?)
  `);
  try {
    const info = stmt.run(sender_id, receiver_id, content);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE message by ID
router.delete('/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM messages WHERE id = ?');
  const info = stmt.run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Message not found' });
  res.json({ success: true });
});

module.exports = router;
