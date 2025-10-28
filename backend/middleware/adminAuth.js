// File: backend/middleware/adminAuth.js

import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if the decoded token has the 'admin' role
        if (decoded.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Not an admin.' });
        }
        
        req.admin = decoded; // Attach admin info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default adminAuth;