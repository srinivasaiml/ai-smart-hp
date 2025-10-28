// File: frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';

// Import Pages and Components
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Doctors from './components/Doctors';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AuthModal from './components/AuthModal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import SymptomChecker from './components/SymptomChecker';
import Testimonials from './components/Testimonials';

// Main website layout component
function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SymptomChecker />
        <Services />
        <About />
        <Doctors />
        <Testimonials />
      </main>
      <Footer />
      <Chatbot />
      <AuthModal />
      
    </>
  );
}

// Protected Route for Admin Dashboard
const AdminProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        return <Navigate to="/admin-login" replace />;
    }
    return children;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;