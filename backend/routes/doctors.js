// File: backend/routes/doctors.js

import express from 'express';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// --- Route to get all active doctors ---
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true })
      .select('name specialty qualification experience consultationFee image availability')
      .sort({ name: 1 });
    res.json({ success: true, doctors });
  } catch (error) {
    console.error('Fetch doctors error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch doctors' });
  }
});

export default router;
