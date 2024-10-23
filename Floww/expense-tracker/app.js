// app.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./tracker.db');

app.use(express.json());

// POST /transactions: Adds a new transaction
app.post('/transactions', (req, res) => {
    const { type, category, amount, date, description } = req.body;
    const query = `INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [type, category, amount, date, description], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

// GET /transactions: Retrieves all transactions
app.get('/transactions', (req, res) => {
    db.all(`SELECT * FROM transactions`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET /transactions/:id: Retrieves a transaction by ID
app.get('/transactions/:id', (req, res) => {
    const query = `SELECT * FROM transactions WHERE id = ?`;
    db.get(query, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Transaction not found" });
        res.json(row);
    });
});

// PUT /transactions/:id: Updates a transaction by ID
app.put('/transactions/:id', (req, res) => {
    const { type, category, amount, date, description } = req.body;
    const query = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`;
    db.run(query, [type, category, amount, date, description, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Transaction not found" });
        res.status(200).json({ message: "Transaction updated" });
    });
});

// DELETE /transactions/:id: Deletes a transaction by ID
app.delete('/transactions/:id', (req, res) => {
    const query = `DELETE FROM transactions WHERE id = ?`;
    db.run(query, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Transaction not found" });
        res.status(204).send();
    });
});

// GET /summary: Retrieves a summary of transactions
app.get('/summary', (req, res) => {
    const summaryQuery = `
        SELECT 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpenses
        FROM transactions`;
    
    db.get(summaryQuery, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        const balance = (row.totalIncome || 0) - (row.totalExpenses || 0);
        res.json({ totalIncome: row.totalIncome || 0, totalExpenses: row.totalExpenses || 0, balance });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server };