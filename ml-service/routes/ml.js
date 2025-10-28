// File: backend/routes/ml.js (Corrected and in the right location)

import express from 'express';
import axios from 'axios';
import { userAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get the ML service URL from Node.js environment variables
// This will be set in Render's settings for the backend service.
const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

// This route acts as a proxy to get the list of symptoms from the ML service
router.get('/symptoms', userAuth, async (req, res) => {
    if (!ML_SERVICE_URL) {
        return res.status(500).json({ success: false, message: 'ML service is not configured.' });
    }
    try {
        const response = await axios.get(`${ML_SERVICE_URL}/symptoms`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching symptoms:', error.message);
        res.status(500).json({ success: false, message: 'Could not fetch symptoms from ML service.' });
    }
});

// This route acts as a proxy to get a disease prediction
router.post('/predict-disease', userAuth, async (req, res) => {
    if (!ML_SERVICE_URL) {
        return res.status(500).json({ success: false, message: 'ML service is not configured.' });
    }
    try {
        const { symptoms } = req.body;
        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return res.status(400).json({ success: false, message: 'A non-empty array of symptoms is required.' });
        }
        
        // Forward the request to the Python ML service
        const response = await axios.post(`${ML_SERVICE_URL}/predict`, { symptoms });
        
        // Return the prediction data to the original caller (the frontend)
        res.json({ success: true, ...response.data });
    } catch (error) {
        console.error('Error in prediction proxy:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Prediction service failed.' });
    }
});

export default router;