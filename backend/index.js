// File: backend/index.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import doctorRoutes from './routes/doctors.js';
import mlRoutes from './routes/ml.js'; 
import contactRoutes from './routes/contact.js';


// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// --- Middleware ---
app.use(helmet());
app.use(limiter);

// --- THIS IS THE CORRECT CORS CONFIGURATION FOR DEPLOYMENT ---
// It allows multiple origins (your local machine and your live website)
const allowedOrigins = [
  process.env.CLIENT_URL_LOCAL, // e.g., 'http://localhost:5173'
  process.env.CLIENT_URL_LIVE,  // e.g., 'https://your-app.netlify.app'
];


const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
// --- END OF CORRECTED SECTION ---

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/contact', contactRoutes);

// --- Health check endpoint ---
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Srinivasa Hospital API is running',
    timestamp: new Date().toISOString()
  });
});

// --- Error Handling & 404 Middleware ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'An internal server error occurred.' });
});
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });