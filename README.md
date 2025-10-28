# Srinivasa Hospital - AI-Powered Healthcare Platform

A modern healthcare platform featuring AI-powered appointment booking, comprehensive medical services, and exceptional patient care.

## Features

- 🤖 **AI Health Assistant** - Intelligent chatbot for appointment booking and health queries
- 📅 **Smart Appointment System** - Real-time booking with availability checking
- 👨‍⚕️ **Expert Medical Team** - Specialized doctors across multiple departments
- 🏥 **Comprehensive Services** - Full range of medical services and treatments
- 📱 **Responsive Design** - Optimized for all devices
- 🔐 **Secure Authentication** - User registration and login system
- 💳 **Payment Integration** - Secure payment processing for appointments

## Project Structure

```
srinivasa-hospital/
├── frontend/                     # React frontend application
│   ├── src/                      # Source code
│   │   ├── components/           # React components
│   │   ├── contexts/             # React contexts (Auth, Chat)
│   │   ├── App.tsx               # Main App component
│   │   └── main.tsx              # Entry point
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend dependencies
│   └── vite.config.ts            # Vite configuration
├── backend/                      # Node.js backend application
│   ├── models/                   # MongoDB models
│   ├── routes/                   # API routes
│   ├── seeders/                  # Database seeders
│   ├── index.js                  # Server entry point
│   └── package.json              # Backend dependencies
├── package.json                  # Root package.json with workspace config
└── README.md                     # This file
```

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, Lottie React
- **Icons**: Lucide React
- **Build Tool**: Vite
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd srinivasa-hospital
```

2. **Install all dependencies:**
```bash
npm run install:all
```

3. **Set up environment variables:**

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/srinivasa_hospital
JWT_SECRET=hospital-ai-chat-jwt-secret-key-2024-super-secure
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

4. **Start MongoDB:**
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, update MONGODB_URI in backend/.env
```

5. **Seed the database with sample doctors:**
```bash
npm run seed
```

6. **Start the development servers:**
```bash
npm run dev
```

This will start both the frontend (http://localhost:5173) and backend (http://localhost:5000) servers concurrently.

## Development Scripts

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Start both frontend and backend in development mode
npm run dev

# Start only frontend
npm run frontend:dev

# Start only backend
npm run backend:dev

# Build frontend for production
npm run frontend:build

# Seed database with sample data

node seeders/doctors.js 

or
npm run seed

python app.py

python train_model.py



## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID

### Appointments
- `GET /api/appointments/slots` - Get available time slots
- `POST /api/appointments/book` - Book an appointment
- `GET /api/appointments/my` - Get user's appointments
- `POST /api/appointments/cancel` - Cancel an appointment
- `POST /api/appointments/confirm-payment` - Confirm payment

## Database Models

### User Model
```javascript
{
  name: String,
  username: String (unique),
  mobile: String (unique),
  password: String (hashed),
  role: String (default: 'patient'),
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

### Doctor Model
```javascript
{
  name: String,
  specialty: String,
  qualification: String,
  experience: Number,
  consultationFee: Number,
  image: String,
  availability: {
    days: [String],
    timeSlots: [String]
  },
  isActive: Boolean,
  timestamps: true
}
```

### Appointment Model
```javascript
{
  userId: ObjectId (ref: User),
  userName: String,
  userMobile: String,
  doctorId: ObjectId (ref: Doctor),
  doctorName: String,
  appointmentDate: Date,
  timeSlot: String,
  status: String (pending/confirmed/cancelled/completed),
  paymentStatus: String (pending/paid/failed/refunded),
  consultationFee: Number,
  notes: String,
  timestamps: true
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email info@srinivasahospital.com or contact our helpline at +91 123 456 7890.