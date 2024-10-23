// setupDB.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tracker.db');

db.serialize(() => {
    // Create categories table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense'))
    )`);

    // Create transactions table
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        category INTEGER,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (category) REFERENCES categories(id)
    )`);
});

db.close();
