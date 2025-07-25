const Database = require('better-sqlite3');
const db = new Database('db/database.sqlite');

// Enable foreign keys
db.pragma('foreign_keys = ON');

module.exports = db;