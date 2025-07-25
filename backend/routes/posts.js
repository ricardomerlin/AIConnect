const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all posts
router.get('/', (req, res) => {
  const posts = db.prepare(`
    SELECT posts.*, users.username 
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY created_at DESC
  `).all();
  res.json(posts);
});

// GET post by ID
router.get('/:id', (req, res) => {
  const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
  const post = stmt.get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// POST new post
router.post('/', (req, res) => {
  const { user_id, content, image_url } = req.body;
  const stmt = db.prepare(`
    INSERT INTO posts (user_id, content, image_url)
    VALUES (?, ?, ?)
  `);
  try {
    const info = stmt.run(user_id, content, image_url);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE post
router.delete('/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
  const info = stmt.run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Post not found' });
  res.json({ success: true });
});

module.exports = router;
