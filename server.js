const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
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

// Connect to MongoDB using environment variables
mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Connected to the MongoDB database.'))
    .catch(err => {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    });

app.get('/api/todos', authenticate, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user._id });
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
