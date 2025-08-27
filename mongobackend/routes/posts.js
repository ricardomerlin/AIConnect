import express from "express";
import Post from "../models/Post.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to check token
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });
  try {
    const payload = jwt.verify(header.split(" ")[1], "secretkey");
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Create post
router.post("/", auth, async (req, res) => {
  const post = new Post({ authorId: req.userId, text: req.body.text });
  await post.save();
  res.json(post);
});

// Get feed
router.get("/", auth, async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).limit(20).populate("authorId");
  res.json(posts);
});

export default router;
