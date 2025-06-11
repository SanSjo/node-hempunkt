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
        const passwordHash = bcrypt.hashSync(password, 10);
        const user = await User.create({ name, email, passwordHash });
        res.json({message: 'User registered successfully', user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: 'Failed to register user' });
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
