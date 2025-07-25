const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Route imports
app.use('/users', require('./routes/users'));
app.use('/friendships', require('./routes/friendships'));
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));
app.use('/reactions', require('./routes/reactions'));
app.use('/messages', require('./routes/messages'));
app.use('/notifications', require('./routes/notifications'));
app.use('/media', require('./routes/media'));
app.use('/activity_logs', require('./routes/activity_logs'));

// Root endpoint
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is listening on http://localhost:${PORT}`);
});
