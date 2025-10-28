// File: backend/routes/auth.js

import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT token - a single function for all token generation
const generateToken = (payload, expiresIn = '1d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// --- Route for User Registration ---
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('mobile').matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid 10-digit mobile number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { name, username, mobile, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username: username.toLowerCase() }, { mobile }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Username or mobile number already exists' });
    }

    const user = new User({ name, username: username.toLowerCase(), mobile, password });
    await user.save();
    res.status(201).json({ success: true, message: 'Registration successful! Please login.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
});

// --- Route for User Login ---
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username.toLowerCase(), isActive: true }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    user.lastLogin = new Date();
    await user.save();
    
    // Create payload for a regular user
    const payload = { userId: user._id, role: user.role };
    const token = generateToken(payload);

    res.json({
      success: true,
      message: 'Login successful',
      user: { _id: user._id, name: user.name, username: user.username, mobile: user.mobile, role: user.role },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

// --- Route for Admin Login (CORRECTED) ---
router.post('/admin-login', (req, res) => {
  const { passkey } = req.body;
  if (passkey && passkey === process.env.ADMIN_PASSKEY) {
      // THIS IS THE FIX: Create a payload that explicitly includes the 'admin' role.
      // We also add a dummy userId to keep the token structure consistent.
      const payload = {
        userId: 'ADMIN_USER', // A static ID for the admin user
        role: 'admin'
      };
      
      const token = generateToken(payload);
      res.json({ success: true, token });
  } else {
      res.status(401).json({ success: false, message: 'Invalid admin passkey' });
  }
});

export default router;