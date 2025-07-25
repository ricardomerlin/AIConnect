const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all media
router.get('/', (req, res) => {
  const mediaItems = db.prepare(`
    SELECT m.*, u.username
    FROM media m
    JOIN users u ON m.user_id = u.id
    ORDER BY m.created_at DESC
  `).all();
  res.json(mediaItems);
});

// GET media by ID
router.get('/:id', (req, res) => {
  const stmt = db.prepare('SELECT * FROM media WHERE id = ?');
  const media = stmt.get(req.params.id);
  if (!media) return res.status(404).json({ error: 'Media not found' });
  res.json(media);
});

// GET all media for a specific user
router.get('/user/:userId', (req, res) => {
  const stmt = db.prepare('SELECT * FROM media WHERE user_id = ? ORDER BY created_at DESC');
  const userMedia = stmt.all(req.params.userId);
  res.json(userMedia);
});

// POST new media
router.post('/', (req, res) => {
  const { user_id, media_url, media_type, caption } = req.body;

  const stmt = db.prepare(`
    INSERT INTO media (user_id, media_url, media_type, caption)
    VALUES (?, ?, ?, ?)
  `);

  try {
    const info = stmt.run(user_id, media_url, media_type, caption);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE media
router.delete('/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM media WHERE id = ?');
  const info = stmt.run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Media not found' });
  res.json({ success: true });
});

module.exports = router;
