// File: backend/seeders/doctors.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path'; // Import the 'path' module
import { fileURLToPath } from 'url'; // Import helper for ES modules
import Doctor from '../models/Doctor.js';

// --- THIS IS THE FIX ---
// Create a reliable path to the .env file in the 'backend' root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// --- END OF FIX ---

const doctors = [
  // --- Existing Doctors ---
  {
    name: 'Dr. John Smith',
    specialty: 'General Physician',
    qualification: 'MBBS, MD (General Medicine)',
    experience: 15,
    consultationFee: 500,
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      timeSlots: ['09:00', '10:30', '11:00', '14:00', '15:30']
    }
  },
  {
    name: 'Dr. Emily Carter',
    specialty: 'Dermatologist',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 12,
    consultationFee: 600,
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'saturday'],
      timeSlots: ['09:00', '10:30', '14:00', '15:30', '16:00']
    }
  },
  {
    name: 'Dr. Michael Lee',
    specialty: 'Cardiologist',
    qualification: 'MBBS, MD, DM (Cardiology)',
    experience: 20,
    consultationFee: 800,
    availability: {
      days: ['tuesday', 'wednesday', 'thursday', 'friday'],
      timeSlots: ['10:30', '11:00', '14:00', '16:00']
    }
  },
  {
    name: 'Dr. Robert Lee',
    specialty: 'Pediatrician',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 18,
    consultationFee: 550,
    availability: {
      days: ['monday', 'wednesday', 'friday', 'saturday'],
      timeSlots: ['09:00', '10:30', '11:00', '15:30', '17:00']
    }
  },

  // --- Newly Added Doctors ---
  {
    name: 'Dr. James Anderson',
    specialty: 'Neurosurgeon',
    qualification: 'MBBS, MS, M.Ch (Neuro Surgery)',
    experience: 22,
    consultationFee: 1000,
    availability: {
      days: ['monday', 'wednesday', 'friday'],
      timeSlots: ['10:00', '11:30', '14:30', '16:00']
    }
  },
  {
    name: 'Dr. Sarah James',
    specialty: 'General Surgeon',
    qualification: 'MBBS, MS (General Surgery)',
    experience: 16,
    consultationFee: 700,
    availability: {
      days: ['tuesday', 'thursday', 'saturday'],
      timeSlots: ['09:30', '11:00', '13:00', '15:00']
    }
  },
  {
    name: 'Dr. Laura Carter',
    specialty: 'Oncologist',
    qualification: 'MBBS, MD, DM (Medical Oncology)',
    experience: 19,
    consultationFee: 950,
    availability: {
      days: ['monday', 'tuesday', 'thursday'],
      timeSlots: ['09:00', '10:00', '12:00', '14:00']
    }
  },

  // --- Remaining Doctors from availableDoctors ---
  {
    name: 'Dr. David Wilson',
    specialty: 'Gastroenterologist',
    qualification: 'MBBS, MD (Gastroenterology)',
    experience: 17,
    consultationFee: 750,
    availability: {
      days: ['monday', 'wednesday', 'friday'],
      timeSlots: ['09:00', '10:30', '12:00', '14:30']
    }
  },
  {
    name: 'Dr. Jennifer Brown',
    specialty: 'Endocrinologist',
    qualification: 'MBBS, MD (Endocrinology)',
    experience: 14,
    consultationFee: 700,
    availability: {
      days: ['tuesday', 'thursday', 'saturday'],
      timeSlots: ['09:00', '10:30', '13:00', '15:30']
    }
  },
  {
    name: 'Dr. Thomas Garcia',
    specialty: 'Pulmonologist',
    qualification: 'MBBS, MD (Pulmonology)',
    experience: 16,
    consultationFee: 720,
    availability: {
      days: ['monday', 'wednesday', 'friday'],
      timeSlots: ['09:00', '11:00', '14:00', '16:00']
    }
  }
];


// This function will seed the database

const seedDoctors = async () => {
  try {
    // Check if the MONGODB_URI was loaded correctly
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined. Make sure your .env file is correct.');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');
    
    await Doctor.deleteMany({});
    console.log('🧹 Existing doctors cleared.');

    await Doctor.insertMany(doctors);
    console.log('✅ Doctors seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔗 MongoDB connection closed.');
    process.exit();
  }
};

seedDoctors();