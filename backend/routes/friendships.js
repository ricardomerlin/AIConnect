const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all friendships
router.get('/', (req, res) => {
  const friendships = db.prepare(`
    SELECT f.id, 
           f.requester_id, 
           r.username AS requester_username, 
           f.receiver_id, 
           u.username AS receiver_username, 
           f.status, 
           f.created_at
    FROM friendships f
    JOIN users r ON f.requester_id = r.id
    JOIN users u ON f.receiver_id = u.id
  `).all();
  res.json(friendships);
});

// GET a single friendship by ID
router.get('/:id', (req, res) => {
  const stmt = db.prepare('SELECT * FROM friendships WHERE id = ?');
  const friendship = stmt.get(req.params.id);
  if (!friendship) return res.status(404).json({ error: 'Friendship not found' });
  res.json(friendship);
});

// POST create new friendship (i.e. send friend request)
router.post('/', (req, res) => {
  const { requester_id, receiver_id } = req.body;
  const stmt = db.prepare(`
    INSERT INTO friendships (requester_id, receiver_id, status)
    VALUES (?, ?, 'pending')
  `);
  try {
    const info = stmt.run(requester_id, receiver_id);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update friendship status (accept/reject/block)
router.put('/:id', (req, res) => {
  const { status } = req.body;
  const stmt = db.prepare(`
    UPDATE friendships SET status = ? WHERE id = ?
  `);
  const info = stmt.run(status, req.params.id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Friendship not found or no change made' });
  }
  res.json({ success: true });
});

// DELETE friendship (e.g. unfriend)
router.delete('/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM friendships WHERE id = ?');
  const info = stmt.run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Friendship not found' });
  res.json({ success: true });
});

module.exports = router;
