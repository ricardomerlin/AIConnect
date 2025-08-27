import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["requested", "accepted"], default: "requested" },
  createdAt: { type: Date, default: Date.now }
});

friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default mongoose.model("Friendship", friendshipSchema);