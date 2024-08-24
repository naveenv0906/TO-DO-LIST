const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using environment variables
mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log('Connected to the MongoDB database.');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    });

// Define a Todo schema and model
const todoSchema = new mongoose.Schema({
    task: { type: String, required: true }
});

const Todo = mongoose.model('Todo', todoSchema);

// Route to get all todos
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        console.error('Error fetching todos:', err);
        res.status(500).send('Error fetching todos');
    }
});

// Route to add a new todo
app.post('/api/todos', async (req, res) => {
    const { task } = req.body;
    if (!task) {
        res.status(400).send('Task is required');
        return;
    }
    try {
        const newTodo = new Todo({ task });
        const savedTodo = await newTodo.save();
        res.status(201).send({ id: savedTodo._id, task });
    } catch (err) {
        console.error('Error inserting task:', err);
        res.status(500).send('Error inserting task');
    }
});

// Route to delete a todo by id
app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).send('ID is required');
        return;
    }
    try {
        await Todo.findByIdAndDelete(id);
        res.status(200).send({ id });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).send('Error deleting task');
    }
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
