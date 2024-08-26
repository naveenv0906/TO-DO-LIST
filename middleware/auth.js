const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Error: Email or password is missing.');
        return res.status(400).send('Email and password are required');
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Error: User already exists:', { email });
            return res.status(400).send('User already exists. Please use a different email.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const user = new User({ email, password: hashedPassword });
        await user.save();

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the token and email
        res.status(201).send({ token, email: user.email });
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).send('Error during registration: ' + err.message);
    }
};

// Login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Error: Email or password is missing.');
        return res.status(400).send('Email and password are required');
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Error: User not found:', { email });
            return res.status(400).send('Invalid email or password');
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Error: Passwords do not match for:', { email });
            return res.status(400).send('Invalid email or password');
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ token, email: user.email });
    } catch (err) {
        console.error('Error logging in user:', err.message);
        res.status(500).send('Error logging in user: ' + err.message);
    }
};

// Middleware to protect routes
exports.authenticate = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send('Access denied: No token provided');
    }

    // Extract token from Authorization header
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access denied: Invalid token');
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request object
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).send('User not found');
        }
        
        req.user = user; // Attach user to request object
        next();
    } catch (err) {
        console.error('Error authenticating user:', err.message);
        res.status(400).send('Invalid token');
    }
};
