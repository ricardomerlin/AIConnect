const Database = require('better-sqlite3');
const db = new Database('db/database.sqlite');

db.pragma('foreign_keys = ON');

db.exec(`
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS reactions;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS activity_logs;
`);

// USERS
db.exec(`
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  bio TEXT,
  profile_picture_url TEXT,
  cover_photo_url TEXT,
  gender TEXT,
  birthday TEXT,
  location TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// FRIENDSHIPS
db.exec(`
CREATE TABLE friendships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  status TEXT CHECK(status IN ('pending', 'accepted', 'rejected', 'blocked')) NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);
`);

// POSTS
db.exec(`
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content TEXT,
  media_url TEXT,
  visibility TEXT CHECK(visibility IN ('public', 'friends', 'private')) NOT NULL DEFAULT 'public',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

// COMMENTS
db.exec(`
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_comment_id) REFERENCES comments(id)
);
`);

// REACTIONS
db.exec(`
CREATE TABLE reactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  target_type TEXT CHECK(target_type IN ('post', 'comment')) NOT NULL,
  target_id INTEGER NOT NULL,
  reaction_type TEXT CHECK(reaction_type IN ('like', 'love', 'haha', 'wow', 'sad', 'angry')) NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);


// MESSAGES
db.exec(`
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);
`);

// NOTIFICATIONS
db.exec(`
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

// MEDIA
db.exec(`
CREATE TABLE media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  media_type TEXT CHECK(media_type IN ('image', 'video')) NOT NULL,
  caption TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

// ACTIVITY LOGS
db.exec(`
CREATE TABLE activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

console.log('✅ All tables created');
