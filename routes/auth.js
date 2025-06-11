import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = express.Router();
// Register a new user
router.post('/register', async (req, res) => {
    console.log("Register route called");
    const { name, email, password } = req.body;
           
    try {
    // Validation
    if (!name || !email || !password) {
        console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password });
        return res.status(400).json({ error: 'Missing required fields. Name, email and password are required.' });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    
    // Password length validation
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
        // Check if user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'A user with this email already exists.' });
        }
        const passwordHash = bcrypt.hashSync(password, 10);
        const user = await User.create({ name, email, passwordHash });
        res.json({message: 'User registered successfully', user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: 'Failed to register user', details: error.message });
    }
});

// Login an existing user   
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if(!user || !bcrypt.compareSync(password, user.passwordHash)) {
            return res.status(401).json({error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

export default router;
