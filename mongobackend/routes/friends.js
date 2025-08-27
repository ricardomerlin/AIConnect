import express from "express";
import Friendship from "../models/Friendship.js";
import jwt from "jsonwebtoken";

const router = express.Router();

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

// Send friend request
router.post("/request/:id", auth, async (req, res) => {
  const friend = new Friendship({ requester: req.userId, recipient: req.params.id });
  await friend.save();
  res.json(friend);
});

// Accept friend request
router.post("/accept/:id", auth, async (req, res) => {
  const fr = await Friendship.findOne({ requester: req.params.id, recipient: req.userId });
  if (!fr) return res.status(404).json({ error: "Request not found" });
  fr.status = "accepted";
  await fr.save();
  res.json(fr);
});

export default router;