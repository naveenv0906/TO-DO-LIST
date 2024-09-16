const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const { register, login, authenticate } = require('./middleware/auth');
const User = require('./models/User');
const Todo = require('./models/Todo');

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Configure session middleware with default memory store
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30 // 1 month
  }
}));

// Connect to MongoDB using environment variables
mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Connected to the MongoDB database.'))
    .catch(err => {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    });

app.get('/api/todos', authenticate, async (req, res) => {
    const userId = req.user._id.toString(); // Ensure we have a string representation of the user ID

    // Check if todos are in the session
    if (req.session.todos && req.session.todos[userId]) {
        console.log('Serving from session cache');
        return res.json(req.session.todos[userId]); // Return cached todos
    }

    try {
        const todos = await Todo.find({ user: req.user._id });
        req.session.todos = req.session.todos || {};
        req.session.todos[userId] = todos; // Cache the todos in session
        console.log('Serving from database');
        res.json(todos);
    } catch (err) {
        console.error('Error fetching todos:', err);
        res.status(500).send('Error fetching todos');
    }
});

app.post('/api/todos', authenticate, async (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).send('Task is required');
    }
    try {
        const newTodo = new Todo({
            task,
            user: req.user._id
        });
        const savedTodo = await newTodo.save();

        // Invalidate the session cache for this user
        const userId = req.user._id.toString();
        if (req.session.todos) {
            delete req.session.todos[userId];
        }

        res.status(201).send({ id: savedTodo._id, task });
    } catch (err) {
        console.error('Error inserting task:', err);
        res.status(500).send('Error inserting task');
    }
});

app.delete('/api/todos/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }

    try {
        const deletedTodo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });
        if (!deletedTodo) {
            return res.status(404).send('Todo not found');
        }

        // Invalidate the session cache for this user
        const userId = req.user._id.toString();
        if (req.session.todos) {
            delete req.session.todos[userId];
        }

        res.status(200).json({ message: 'Todo deleted successfully', id });
    } catch (err) {
        console.error('Error deleting todo:', err);
        res.status(500).send('Error deleting todo');
    }
});

app.post('/api/register', register);

app.post('/api/login', login);

app.use((req, res, next) => {
    res.status(404).send('Page Not Found');
});

app.use((err, req, res, next) => {
    console.error('Error occurred:', err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
