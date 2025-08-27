import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  kind: { type: String, enum: ["like", "love", "haha"], default: "like" },
  createdAt: { type: Date, default: Date.now }
});

reactionSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model("Reaction", reactionSchema);
