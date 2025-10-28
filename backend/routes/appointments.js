// File: backend/routes/appointments.js
// ACTION: Replace the existing file content with this corrected version.

import express from 'express';
import { body, validationResult } from 'express-validator';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
// REMOVE: The local User model import and jwt, as they are handled in the middleware.
// import User from '../models/User.js'; 
// import jwt from 'jsonwebtoken';

// --- THIS IS THE FIX ---
// 1. IMPORT the robust authentication middlewares
import { userAuth } from '../middleware/authMiddleware.js'; // Use the centralized user auth
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// 2. REMOVE the old, simplified 'userAuth' middleware that was defined locally in this file.
// const userAuth = async (req, res, next) => { ... }; // This entire block is removed.


// --- NEW: Route to check available time slots for a specific doctor and date ---
// 3. APPLY the correct middleware
router.get('/check-availability', userAuth, async (req, res) => {
    try {
        const { doctorId, date } = req.query;

        if (!doctorId || !date) {
            return res.status(400).json({ 
                success: false, 
                message: 'Doctor ID and date are required' 
            });
        }

        // Get all appointments for this doctor on this date
        const appointmentDate = new Date(date);
        appointmentDate.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(appointmentDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const bookedAppointments = await Appointment.find({
            doctorId,
            appointmentDate: {
                $gte: appointmentDate,
                $lt: nextDay
            },
            status: { $in: ['confirmed', 'pending'] }
        }).select('timeSlot');

        const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);

        res.json({ 
            success: true, 
            bookedSlots,
            message: 'Availability checked successfully'
        });
    } catch (error) {
        console.error('CHECK AVAILABILITY ERROR:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to check availability' 
        });
    }
});


// --- Route for chatbot to book an appointment (for logged-in user) ---
// 4. APPLY the correct middleware here as well
router.post('/book', userAuth, [
  body('doctorId').isMongoId().withMessage('Valid Doctor ID is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

  try {
     const { doctorId, date, time, symptoms } = req.body;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    let appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);

    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const isDayAvailable = doctor.availability.days.some(day => day.toLowerCase() === dayName);
    if (!isDayAvailable) {
        return res.status(400).json({ 
            success: false, 
            message: `Doctor is not available on ${dayName}s. Available days: ${doctor.availability.days.join(', ')}` 
        });
    }

    const isTimeSlotAvailable = doctor.availability.timeSlots.includes(time);
    if (!isTimeSlotAvailable) {
        return res.status(400).json({ 
            success: false, 
            message: `Time slot ${time} is not available. Available slots: ${doctor.availability.timeSlots.join(', ')}` 
        });
    }

    const existingAppointment = await Appointment.findOne({
        doctorId,
        appointmentDate,
        timeSlot: time,
        status: { $in: ['confirmed', 'pending'] }
    });

    if (existingAppointment) {
        return res.status(409).json({ 
            success: false, 
            message: 'This time slot is already booked. Please choose another time.' 
        });
    }

    const newAppointment = new Appointment({
      userId: req.user._id, // req.user is correctly attached by the proper middleware
      doctorId,
      appointmentDate,
      timeSlot: time,
      consultationFee: doctor.consultationFee,
      status: 'confirmed',
      symptoms: symptoms || []
    });
    
    await newAppointment.save();
    
    res.status(201).json({ 
        success: true, 
        message: 'Appointment confirmed successfully!', 
        appointment: newAppointment 
    });
  } catch (error) {
    console.error('APPOINTMENT BOOKING FAILED:', error);
    res.status(500).json({ 
        success: false, 
        message: 'Failed to book appointment. Please try again.' 
    });
  }
});

// --- ADMIN ROUTE to get ALL appointments ---
router.get('/all', adminAuth, async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('userId', 'name mobile username')
            .populate('doctorId', 'name specialty')
            .sort({ createdAt: -1 });

        res.json({ success: true, appointments });
    } catch (err) {
        console.error('ADMIN FETCH APPOINTMENTS FAILED:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

export default router;