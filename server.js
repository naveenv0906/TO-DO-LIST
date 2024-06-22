const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todo_list'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.get('/api/todos', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
});

app.post('/api/todos', (req, res) => {
    const { task } = req.body;
    console.log('Received task:', task);
    db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, results) => {
        if (err) {
            console.error('Error inserting task:', err); 
            res.status(500).send(err);
            return;
        }
        console.log('Task inserted with ID:', results.insertId); 
        res.status(201).send({ id: results.insertId, task });
    });
});

app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM todos WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send({ id });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
