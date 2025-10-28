// File: frontend/src/components/AdminDashboard.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import { Appointment } from '../types';
import { LogOut, RefreshCw, Users, Calendar, Clock, AlertTriangle, ShieldCheck, Search, Filter, TrendingUp, User, Phone, Stethoscope, CheckCircle, XCircle, AlertCircle, Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AppointmentReceipt from './AppointmentReceipt';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 12 } },
};

const AdminDashboard: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [downloadingReceipt, setDownloadingReceipt] = useState<string | null>(null);
    const [receiptData, setReceiptData] = useState<any>(null);
    const receiptRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const fetchAppointments = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axiosInstance.get('/appointments/all');
            if (res.data.success) {
                setAppointments(res.data.appointments);
                setFilteredAppointments(res.data.appointments);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch appointments. Session may have expired.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAppointments(); }, []);

    useEffect(() => {
        let filtered = appointments;
        
        if (searchTerm) {
            filtered = filtered.filter(app => 
                app.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.doctorId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.doctorId?.specialty.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter);
        }
        
        setFilteredAppointments(filtered);
    }, [searchTerm, statusFilter, appointments]);

    const handleLogout = () => { 
        localStorage.removeItem('adminToken'); 
        navigate('/admin-login'); 
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (timeString: string) => {
        if (!timeString || !timeString.includes(':')) return 'Invalid Time';
        const [hour, minute] = timeString.split(':');
        const hourNum = parseInt(hour, 10);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum % 12 || 12;
        return `${displayHour}:${minute} ${ampm}`;
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'confirmed': return <CheckCircle size={16} className="text-green-500" />;
            case 'pending': return <AlertCircle size={16} className="text-yellow-500" />;
            case 'completed': return <CheckCircle size={16} className="text-blue-500" />;
            case 'cancelled': return <XCircle size={16} className="text-red-500" />;
            default: return <AlertCircle size={16} className="text-gray-500" />;
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch(status) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Download receipt for an appointment
    const handleDownloadReceipt = async (appointment: Appointment) => {
        if (!appointment.userId || !appointment.doctorId) {
            alert('Cannot generate receipt: Missing patient or doctor information');
            return;
        }

        setDownloadingReceipt(appointment._id);

        // Prepare receipt data
        const receiptInfo = {
            appointmentId: appointment._id,
            patientName: appointment.userId.name,
            doctor: {
                _id: appointment.doctorId._id,
                name: appointment.doctorId.name,
                specialty: appointment.doctorId.specialty,
                consultationFee: appointment.consultationFee || 0
            },
            date: new Date(appointment.appointmentDate).toISOString().split('T')[0],
            time: appointment.timeSlot,
            symptoms: appointment.symptoms || [] 
           // Admin downloads won't have symptoms context
        };

        setReceiptData(receiptInfo);

        // Wait for receipt to render
        setTimeout(async () => {
            try {
                if (!receiptRef.current) {
                    throw new Error('Receipt element not found');
                }

                const canvas = await html2canvas(receiptRef.current, { 
                    scale: 2,
                    logging: false,
                    useCORS: true
                });
                const imgData = canvas.toDataURL('image/png');
                
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`receipt-${appointment.userId.name.replace(/\s+/g, '-')}-${appointment._id.slice(-6)}.pdf`);
            } catch (error) {
                console.error('Error generating receipt:', error);
                alert('Failed to generate receipt. Please try again.');
            } finally {
                setDownloadingReceipt(null);
                setReceiptData(null);
            }
        }, 100);
    };

    const stats = [
        { label: 'Total Bookings', value: appointments.length, icon: Calendar, color: 'from-blue-500 to-blue-600' },
        { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, icon: CheckCircle, color: 'from-green-500 to-green-600' },
        { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, icon: Clock, color: 'from-yellow-500 to-yellow-600' },
        { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: TrendingUp, color: 'from-purple-500 to-purple-600' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Hidden receipt component for PDF generation */}
            {receiptData && (
                <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                    <AppointmentReceipt ref={receiptRef} {...receiptData} />
                </div>
            )}

            {/* Header */}
            <motion.header 
                className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <motion.div 
                                className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <ShieldCheck size={28} className="text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Admin Dashboard
                                </h1>
                                <p className="text-sm text-gray-500 mt-0.5">Srinivasa Hospital Management</p>
                            </div>
                        </div>
                        <motion.button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <LogOut size={18} />
                            <span className="font-medium hidden sm:inline">Logout</span>
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                            variants={itemVariants}
                            whileHover={{ y: -4 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                                </div>
                                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                                    <stat.icon size={24} className="text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Content Card */}
                <motion.div 
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Filters and Search */}
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <h2 className="text-2xl font-bold text-gray-800">Reception List</h2>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                    {filteredAppointments.length}
                                </span>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search patients, doctors..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-full sm:w-64"
                                    />
                                </div>

                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer transition-all"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <motion.button
                                    onClick={fetchAppointments}
                                    disabled={loading}
                                    className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        animate={{ rotate: loading ? 360 : 0 }}
                                        transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                                    >
                                        <RefreshCw size={16} />
                                    </motion.div>
                                    <span className="font-medium">Refresh</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                className="px-6 pt-4"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                                    <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
                                    <p className="text-red-700 font-medium">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Patient</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Doctor</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Specialty</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Appointment</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Fee</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <motion.tbody
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="divide-y divide-gray-200"
                            >
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <RefreshCw size={32} className="text-blue-500" />
                                                </motion.div>
                                                <p className="text-gray-500 font-medium">Loading appointments...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((app) => (
                                        <motion.tr 
                                            key={app._id}
                                            className="hover:bg-blue-50/50 transition-colors duration-200"
                                            variants={itemVariants}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {app.userId ? (
                                                        <>
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                                                                <User size={18} className="text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-800">{app.userId.name}</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center space-x-2 text-red-500">
                                                            <AlertTriangle size={18} />
                                                            <span className="font-medium">Deleted User</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2 text-gray-700">
                                                    <Phone size={14} className="text-gray-400" />
                                                    <span>{app.userId ? app.userId.mobile : 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {app.doctorId ? (
                                                    <div className="flex items-center space-x-2">
                                                        <Stethoscope size={16} className="text-indigo-500" />
                                                        <span className="font-semibold text-gray-800">{app.doctorId.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-red-500 font-medium">Deleted Doctor</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                                    {app.doctorId ? app.doctorId.specialty : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                                                        <Calendar size={14} className="text-green-500" />
                                                        <span className="font-medium">{formatDate(app.appointmentDate)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <Clock size={14} className="text-purple-500" />
                                                        <span>{formatTime(app.timeSlot)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-800">₹{app.consultationFee || 0}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border ${getStatusBadgeClass(app.status)}`}>
                                                    {getStatusIcon(app.status)}
                                                    <span className="text-xs font-semibold capitalize">{app.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <motion.button
                                                    onClick={() => handleDownloadReceipt(app)}
                                                    disabled={downloadingReceipt === app._id || !app.userId || !app.doctorId}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                                    whileHover={{ scale: downloadingReceipt === app._id ? 1 : 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {downloadingReceipt === app._id ? (
                                                        <>
                                                            <Loader2 size={16} className="animate-spin" />
                                                            <span className="text-sm font-medium">Generating...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Download size={16} />
                                                            <span className="text-sm font-medium">Receipt</span>
                                                        </>
                                                    )}
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Calendar size={32} className="text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 font-medium">
                                                    {searchTerm || statusFilter !== 'all' 
                                                        ? 'No appointments found matching your filters' 
                                                        : 'No appointments have been booked yet'}
                                                </p>
                                                {(searchTerm || statusFilter !== 'all') && (
                                                    <button
                                                        onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        Clear filters
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </motion.tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;