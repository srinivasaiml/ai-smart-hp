// File: backend/models/Appointment.js

import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User ID is required'] },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: [true, 'Doctor ID is required'] },
  appointmentDate: { type: Date, required: [true, 'Appointment date is required'] },
  timeSlot: { type: String, required: [true, 'Time slot is required'], match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'] },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  consultationFee: { type: Number, required: [true, 'Consultation fee is required'], min: [0, 'Fee cannot be negative'] },
  notes: { type: String, maxlength: [500, 'Notes cannot exceed 500 characters'] },
  symptoms:{ type: [String],default: []},
}, { timestamps: true });

// Compound index to prevent a doctor from being double-booked at the same time
appointmentSchema.index({ doctorId: 1, appointmentDate: 1, timeSlot: 1 }, { unique: true });

export default mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);