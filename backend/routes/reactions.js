const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all reactions for a post
router.get('/post/:postId', (req, res) => {
  const stmt = db.prepare(`
    SELECT * FROM reactions WHERE post_id = ?
  `);
  const reactions = stmt.all(req.params.postId);
  res.json(reactions);
});

// GET reaction count per type for a post
router.get('/post/:postId/counts', (req, res) => {
  const stmt = db.prepare(`
    SELECT type, COUNT(*) as count
    FROM reactions
    WHERE post_id = ?
    GROUP BY type
  `);
  const counts = stmt.all(req.params.postId);
  res.json(counts);
});

// POST a reaction
router.post('/', (req, res) => {
  const { user_id, post_id, type } = req.body;
  const stmt = db.prepare(`
    INSERT INTO reactions (user_id, post_id, type)
    VALUES (?, ?, ?)
  `);
  try {
    const info = stmt.run(user_id, post_id, type);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a reaction by ID
router.delete('/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM reactions WHERE id = ?');
  const info = stmt.run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Reaction not found' });
  res.json({ success: true });
});

module.exports = router;
