const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all comments
router.get('/', (req, res) => {
  const comments = db.prepare(`
    SELECT c.*, u.username
    FROM comments c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.created_at DESC
  `).all();
  res.json(comments);
});

// GET comments for a specific post
router.get('/post/:postId', (req, res) => {
  const stmt = db.prepare(`
    SELECT c.*, u.username
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `);
  const comments = stmt.all(req.params.postId);
  res.json(comments);
});

// GET a single comment by ID
router.get('/:id', (req, res) => {
  const stmt = db.prepare('SELECT * FROM comments WHERE id = ?');
  const comment = stmt.get(req.params.id);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  res.json(comment);
});

// POST create a new comment
router.post('/', (req, res) => {
  const { post_id, user_id, content, parent_comment_id } = req.body;

  const stmt = db.prepare(`
    INSERT INTO comments (post_id, user_id, content, parent_comment_id)
    VALUES (?, ?, ?, ?)
  `);

  try {
    const info = stmt.run(post_id, user_id, content, parent_comment_id || null);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a comment
router.delete('/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
  const info = stmt.run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Comment not found' });
  res.json({ success: true });
});

module.exports = router;
