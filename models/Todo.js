const mongoose = require('mongoose');

// Define a Todo schema with a reference to the User
const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
