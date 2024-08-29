import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TodoList from './components/TodoList'; 
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/todos" element={<TodoList />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
