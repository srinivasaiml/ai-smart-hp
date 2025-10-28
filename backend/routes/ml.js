// File: backend/routes/ml.js

import express from 'express';
import axios from 'axios';
import { userAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
// Use an environment variable for the ML service URL, with a local fallback
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

/**
 * @route   GET /api/ml/symptoms
 * @desc    Get the list of all symptoms from the ML service
 * @access  Private (requires user login)
 */
router.get('/symptoms', userAuth, async (req, res) => {
    try {
        console.log(`Forwarding /symptoms request to: ${ML_SERVICE_URL}/symptoms`);
        const response = await axios.get(`${ML_SERVICE_URL}/symptoms`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching symptoms:', error.message);
        res.status(500).json({ success: false, message: 'Could not fetch symptoms from ML service' });
    }
});

/**
 * @route   POST /api/ml/predict-disease
 * @desc    Get a disease prediction based on provided symptoms
 * @access  Private (requires user login)
 */
router.post('/predict-disease', userAuth, async (req, res) => {
    try {
        const { symptoms } = req.body;
        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return res.status(400).json({ success: false, message: 'Symptoms must be a non-empty array' });
        }
        
        console.log(`Forwarding /predict request to: ${ML_SERVICE_URL}/predict with symptoms:`, symptoms);
        const response = await axios.post(`${ML_SERVICE_URL}/predict`, { symptoms });
        
        res.json({ success: true, ...response.data });
    } catch (error)
        {
        console.error('Error in prediction proxy:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Prediction service failed' });
    }
});

export default router;