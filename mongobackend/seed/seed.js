import connectDB from "../config/db.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

await connectDB();

await User.deleteMany();
await Post.deleteMany();

const user1 = new User({ email: "alice@example.com" });
await user1.setPassword("password");
await user1.save();

const user2 = new User({ email: "bob@example.com" });
await user2.setPassword("password");
await user2.save();

await new Post({ authorId: user1._id, text: "Hello from Alice!" }).save();
await new Post({ authorId: user2._id, text: "Bob here 👋" }).save();

console.log("✅ Seeded users + posts");
process.exit();