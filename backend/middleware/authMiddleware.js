// File: backend/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

/**
 * Middleware to protect routes that require ANY logged-in user (regular or admin).
 * It verifies the JWT. If it's a regular user, it attaches the user object.
 * If it's an admin, it confirms the role and proceeds.
 */
export const userAuth = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // --- THIS IS THE FIX ---
    // Check if the userId is a valid MongoDB ObjectId.
    // The "ADMIN_USER" ID will fail this check, directing it to the admin logic.
    if (mongoose.Types.ObjectId.isValid(decoded.userId)) {
        // This is a REGULAR USER
        req.user = await User.findById(decoded.userId).select('-password');
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found, authorization denied' });
        }
    } else if (decoded.role === 'admin') {
        // This is an ADMIN USER
        // We create a mock user object so the rest of the app doesn't break
        req.user = { _id: decoded.userId, role: decoded.role, name: 'Admin' };
    } else {
        // The token is invalid or doesn't fit either role
        throw new Error('Invalid token payload');
    }
    // --- END OF FIX ---

    next(); // Proceed to the next function

  } catch (error) {
    console.error('Authentication Error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};