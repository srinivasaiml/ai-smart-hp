// File: backend/models/Doctor.js

import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Doctor name is required'], trim: true },
  specialty: { type: String, required: [true, 'Specialty is required'], trim: true },
  qualification: { type: String, trim: true },
  experience: { type: Number, min: [0, 'Experience cannot be negative'] },
  consultationFee: { type: Number, required: [true, 'Consultation fee is required'], min: [0, 'Fee cannot be negative'], default: 500 },
  image: { type: String, default: '' },
  availability: {
    days: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
    timeSlots: [{ type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'] }]
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

doctorSchema.index({ specialty: 1, isActive: 1 });

export default mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);