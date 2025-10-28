// File: frontend/src/types.ts

// For User Authentication Context
export interface User {
  _id: string;
  name: string;
  username: string;
  mobile: string;
  role?: string;
}

// For Doctor information with availability
export interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  qualification?: string;
  experience?: number;
  consultationFee: number;
  image?: string;
  availability: {
    days: string[]; // e.g., ['monday', 'tuesday', 'wednesday']
    timeSlots: string[]; // e.g., ['09:00', '10:30', '14:00']
  };
}

// For the Admin Dashboard appointment list
export interface Appointment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    mobile: string;
  };
  doctorId: {
    _id: string;
    name: string;
    specialty: string;
  };
  appointmentDate: string; // Comes as ISO string from backend
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  symptoms?: string[];
}