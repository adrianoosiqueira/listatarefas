const express = require('express');
const db = require('./database');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Serve a pasta atual

app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ tasks: rows });
    });
});

app.post('/tasks', (req, res) => {
    const { name } = req.body;
    db.run('INSERT INTO tasks (name, completed) VALUES (?, ?)', [name, 0], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { name, completed } = req.body;
    db.run('UPDATE tasks SET name = ?, completed = ? WHERE id = ?', [name, completed, id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ updated: this.changes });
    });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
