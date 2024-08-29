import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import { getToken, logout } from '../services/AuthService'; 
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      // Redirect to login if no token
      navigate('/login');
    } else {
      axios.get(`${backendUrl}/api/todos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setTodos(response.data);
        })
        .catch(error => {
          console.error('Error fetching todos:', error);
          // Handle unauthorized access by logging out and redirecting
          if (error.response && error.response.status === 401) {
            handleLogout();
          }
        });
    }
  }, [backendUrl, navigate]);

  const addTodo = () => {
    if (!task.trim()) {
      console.log('Task cannot be empty');
      return;
    }
    axios.post(`${backendUrl}/api/todos`, { task }, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then(response => {
        console.log('Todo added:', response.data); // Log added todo
        setTodos([...todos, response.data]);
        setTask('');
      })
      .catch(error => console.error('Error adding todo:', error));
  };

  const deleteTodo = (id) => {
    console.log('Deleting todo with ID:', id);
    if (!id) {
      console.error('Cannot delete todo: ID is missing');
      return;
    }
    axios.delete(`${backendUrl}/api/todos/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then(() => {
        console.log('Todo deleted:', id); // Log deleted todo ID
        setTodos(todos.filter(todo => todo._id !== id)); // Ensure correct ID field
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="text-center">To-Do List</h1>
        {isLoggedIn ? (
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        ) : (
          <>
            <Login />
            <Register />
          </>
        )}
      </div>

      {isLoggedIn && (
        <>
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
              <li key={todo._id} className="list-group-item d-flex justify-content-between align-items-center">
                {todo.task}
                <button className="btn btn-danger" onClick={() => deleteTodo(todo._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TodoList;
