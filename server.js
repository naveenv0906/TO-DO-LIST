const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Connect to the database and handle errors
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); 
    }
    console.log('Connected to the MySQL database.');
});

// Route to get all todos
app.get('/api/todos', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) {
            console.error('Error fetching todos:', err);
            res.status(500).send('Error fetching todos');
            return;
        }
        res.json(results);
    });
});

// Route to add a new todo
app.post('/api/todos', (req, res) => {
    const { task } = req.body;
    if (!task) {
        res.status(400).send('Task is required');
        return;
    }
    console.log('Received task:', task);
    db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, results) => {
        if (err) {
            console.error('Error inserting task:', err);
            res.status(500).send('Error inserting task');
            return;
        }
        console.log('Task inserted with ID:', results.insertId);
        res.status(201).send({ id: results.insertId, task });
    });
});

// Route to delete a todo by id
app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).send('ID is required');
        return;
    }
    db.query('DELETE FROM todos WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting task:', err);
            res.status(500).send('Error deleting task');
            return;
        }
        res.status(200).send({ id });
    });
});

// Middleware to handle 404 - Page Not Found
app.use((req, res, next) => {
    res.status(404).send('Page Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
