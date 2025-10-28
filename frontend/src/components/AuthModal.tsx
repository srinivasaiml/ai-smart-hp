import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', mobile: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  useEffect(() => {
    const handleOpenAuth = () => setIsOpen(true);
    document.addEventListener('openAuthModal', handleOpenAuth);
    return () => document.removeEventListener('openAuthModal', handleOpenAuth);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    setMessage({ text: '', type: '' });
    setFormData({ name: '', username: '', mobile: '', password: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      let result;
      if (isLogin) {
        result = await login(formData.username, formData.password);
      } else {
        result = await register(formData.name, formData.username, formData.mobile, formData.password);
      }
      setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
      if (result.success) {
        if (isLogin) {
          setTimeout(closeModal, 1000);
        } else {
          setTimeout(() => {
            setIsLogin(true);
            setFormData({ name: '', username: '', mobile: '', password: '' });
            setMessage({ text: 'Registration successful! Please login.', type: 'success' });
          }, 1500);
        }
      }
    } catch (error) {
      setMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setMessage({ text: '', type: '' });
    setFormData({ name: '', username: '', mobile: '', password: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
          <motion.div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-6 relative">
              <button onClick={closeModal} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"><X size={20} /></button>
              <h2 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-teal-100 mt-1">{isLogin ? 'Sign in to your account' : 'Join our healthcare community'}</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required={!isLogin} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Enter your full name" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input type="text" name="username" value={formData.username} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Enter your username" />
                </div>
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required={!isLogin} pattern="[6-9]{1}[0-9]{9}" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Enter 10-digit mobile number" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-12" placeholder="Enter your password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                  </div>
                </div>
                {message.text && (<div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>)}
                <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50">
                  {isLoading ? <div className="flex items-center justify-center space-x-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span></div> : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-gray-600">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={switchMode} className="ml-2 text-teal-600 font-semibold hover:text-teal-700">{isLogin ? 'Sign Up' : 'Sign In'}</button></p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;