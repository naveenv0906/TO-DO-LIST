import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState('');

    useEffect(() => {
        axios.get('https://to-do-list-0n35.onrender.com/api/todos')
            .then(response => setTodos(response.data))
            .catch(error => console.error('Error fetching todos:', error));
    }, []);

    const addTodo = () => {
        console.log('Adding task:', task); // Log task to be added
        axios.post('https://to-do-list-0n35.onrender.com/api/todos', { task })
            .then(response => {
                console.log('Task added:', response.data); // Log success response
                setTodos([...todos, response.data]);
            })
            .catch(error => console.error('Error adding todo:', error)); // Log error
        setTask('');
    };

    const deleteTodo = (id) => {
        axios.delete(`https://to-do-list-0n35.onrender.com/api/todos/${id}`)
            .then(() => setTodos(todos.filter(todo => todo.id !== id)))
            .catch(error => console.error('Error deleting todo:', error));
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">To-Do List</h1>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="New task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <button className="btn btn-primary" onClick={addTodo}>Add</button>
            </div>
            <ul className="list-group">
                {todos.map(todo => (
                    <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {todo.task}
                        <button className="btn btn-danger" onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
