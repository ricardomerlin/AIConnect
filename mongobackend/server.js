import express from "express";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import friendRoutes from "./routes/friends.js";
import mongoose from "mongoose";


const app = express();
connectDB();

app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/friends", friendRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
