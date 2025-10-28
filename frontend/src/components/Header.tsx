import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { openChat } = useChat();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChatClick = () => {
    if (isAuthenticated) {
      openChat();
    } else {
      document.dispatchEvent(new CustomEvent('openAuthModal'));
    }
  };

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#services', label: 'Services' },
    { href: '#about', label: 'About' },
    { href: '#doctors', label: 'Doctors' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone size={14} />
              <span>Emergency: +91 123 456 7890</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={14} />
              <span>info@srinivasahospital.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-1 md:mt-0">
            <MapPin size={14} />
            <span>Rajamundry, Andhra Pradesh, India</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2 mt-0' : 'bg-transparent py-4 mt-10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div className={`font-bold text-xl ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                <span className="font-serif">Srinivasa</span>{' '}
                <span className="text-orange-500 font-sans">Hospital</span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-all duration-300 hover:text-orange-500 relative group ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              ))}
              
              <motion.button
                onClick={handleChatClick}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                }`}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={18} />
                <span className="font-medium">Booking Doctor</span>
              </motion.button>
              
              {isAuthenticated ? (
                <motion.div className="flex items-center space-x-4">
                  <span className={`text-sm font-medium ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}>
                    Welcome, {user?.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={logout}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Logout
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  onClick={() => document.dispatchEvent(new CustomEvent('openAuthModal'))}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              className="lg:hidden mt-4 pb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-col space-y-3 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  onClick={handleChatClick}
                  className="flex items-center justify-center space-x-2 px-3 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg font-medium"
                >
                  <MessageCircle size={18} />
                  <span>Book Doctor</span>
                </button>
                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      document.dispatchEvent(new CustomEvent('openAuthModal'));
                      setIsMenuOpen(false);
                    }}
                    className="px-3 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;