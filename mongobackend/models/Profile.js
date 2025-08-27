import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  handle: { type: String, unique: true, required: true },
  name: String,
  bio: String,
  avatarUrl: String,
  visibility: { type: String, enum: ["public", "friends", "private"], default: "friends" }
});

export default mongoose.model("Profile", profileSchema);