// File: frontend/src/components/AdminLogin.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import { LogIn, Shield } from 'lucide-react'; // Import icons
import axiosInstance from '../api/axiosInstance';

const AdminLogin: React.FC = () => {
    const [passkey, setPasskey] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await axiosInstance.post('/auth/admin-login', { passkey });
            if (res.data.token) {
                localStorage.setItem('adminToken', res.data.token);
                // A short delay for the user to see the success state (optional but nice UX)
                setTimeout(() => navigate('/admin'), 500);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid passkey. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
            <motion.div 
                className="w-full max-w-sm p-8 space-y-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.div 
                    className="text-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-4">
                        <Shield size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Access</h1>
                    <p className="text-gray-500 mt-2">Srinivasa Hospital Dashboard</p>
                </motion.div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Passkey</label>
                        <motion.input
                            type="password"
                            value={passkey}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasskey(e.target.value)}
                            placeholder="Enter your secret passkey"
                            className="w-full px-4 py-3 mt-2 bg-white border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500"
                            required
                            whileFocus={{ scale: 1.02 }}
                        />
                    </div>
                     {error && <p className="text-sm text-center text-red-600 font-medium">{error}</p>}
                    <div>
                        <motion.button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-3 font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            {isLoading ? (
                                <>
                                    <motion.div 
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} className="mr-2"/>
                                    <span>Login Securely</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;