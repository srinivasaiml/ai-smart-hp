import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { X, Send, Minimize2, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import axiosInstance from '../api/axiosInstance';
import { Doctor } from '../types';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AppointmentReceipt from './AppointmentReceipt';

const robotAnimation = { v:"5.5.7",meta:{g:"LottieFiles AE ",a:"",k:"",d:"",tc:""},fr:29.9700012207031,ip:0,op:90.0000036657751,w:500,h:500,nm:"Robot Hello",ddd:0,assets:[],layers:[{ddd:0,ind:1,ty:4,nm:"Robot",sr:1,ks:{o:{a:0,k:100,ix:11},r:{a:1,k:[{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},t:0,s:[0]},{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},t:30,s:[10]},{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},t:60,s:[-10]},{t:90,s:[0]}],ix:10},p:{a:0,k:[250,250,0],ix:2},a:{a:0,k:[0,0,0],ix:1},s:{a:1,k:[{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},t:0,s:[100,100,100]},{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},t:45,s:[110,110,100]},{t:90,s:[100,100,100]}],ix:6}},ao:0,shapes:[{ty:"gr",it:[{d:1,ty:"el",s:{a:0,k:[120,120],ix:2},p:{a:0,k:[0,0],ix:3},nm:"Head",mn:"ADBE Vector Shape - Ellipse",hd:false},{ty:"fl",c:{a:1,k:[{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},t:0,s:[0.2,0.7,0.9,1]},{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},t:30,s:[0.1,0.8,1,1]},{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},t:60,s:[0.3,0.6,0.8,1]},{t:90,s:[0.2,0.7,0.9,1]}],ix:4},o:{a:0,k:100,ix:5},r:1,bm:0,nm:"Fill 1",mn:"ADBE Vector Graphic - Fill",hd:false}],nm:"Robot Head",np:2,cix:2,bm:0,ix:1,mn:"ADBE Vector Group",hd:false},{ty:"gr",it:[{d:1,ty:"el",s:{a:0,k:[15,15],ix:2},p:{a:0,k:[-25,-10],ix:3},nm:"Left Eye",mn:"ADBE Vector Shape - Ellipse",hd:false},{ty:"fl",c:{a:0,k:[1,1,1,1],ix:4},o:{a:0,k:100,ix:5},r:1,bm:0,nm:"Fill 2",mn:"ADBE Vector Graphic - Fill",hd:false}],nm:"Left Eye",np:2,cix:2,bm:0,ix:2,mn:"ADBE Vector Group",hd:false},{ty:"gr",it:[{d:1,ty:"el",s:{a:0,k:[15,15],ix:2},p:{a:0,k:[25,-10],ix:3},nm:"Right Eye",mn:"ADBE Vector Shape - Ellipse",hd:false},{ty:"fl",c:{a:0,k:[1,1,1,1],ix:4},o:{a:0,k:100,ix:5},r:1,bm:0,nm:"Fill 3",mn:"ADBE Vector Graphic - Fill",hd:false}],nm:"Right Eye",np:2,cix:2,bm:0,ix:3,mn:"ADBE Vector Group",hd:false}],ip:0,op:90.0000036657751,st:0,bm:0}]};

// --- TYPE DEFINITIONS ---
interface MessageButton { text: string; action: string; param?: string; variant?: 'primary' | 'secondary' | 'danger'; disabled?: boolean; }
interface Message { id: string; text: string; sender: 'user' | 'bot'; timestamp: Date; buttons?: MessageButton[]; }
interface AppointmentState { active: boolean; step: string | null; doctor: Doctor | null; date: string | null; time: string | null; }

interface ConfirmedAppointmentDetails {
  appointmentId: string;
  patientName: string;
  doctor: Doctor;
  date: string;
  time: string;
  symptoms: string[];
}

// --- HELPER: Generate unique ID ---
let messageIdCounter = 0;
const generateUniqueId = (): string => {
  messageIdCounter++;
  return `msg-${Date.now()}-${messageIdCounter}`;
};

// --- HELPER: Convert "today"/"tomorrow" to actual date strings ---
const getActualDate = (dateString: string): string => {
  const date = new Date();
  if (dateString === 'tomorrow') {
    date.setDate(date.getDate() + 1);
  }
  return date.toISOString().split('T')[0];
};

// --- HELPER: Format date for display ---
const getDisplayDate = (dateString: string): string => {
  if (dateString === 'today') return 'Today';
  if (dateString === 'tomorrow') return 'Tomorrow';
  return dateString;
};

// --- HELPER: Get day name from date ---
const getDayName = (dateString: string): string => {
  const date = dateString === 'today' ? new Date() : 
               dateString === 'tomorrow' ? new Date(Date.now() + 86400000) : 
               new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
};

const Chatbot: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { isChatOpen, closeChat, openChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isDoctorsLoading, setIsDoctorsLoading] = useState<boolean>(true);
  const [appointment, setAppointment] = useState<AppointmentState>({ active: false, step: null, doctor: null, date: null, time: null });

  const [confirmedAppointment, setConfirmedAppointment] = useState<ConfirmedAppointmentDetails | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- HOOKS ---
  useEffect(() => {
    if (isChatOpen && isAuthenticated) {
        messageIdCounter = 0; // Reset counter on open
        setIsDoctorsLoading(true);
        fetchDoctors();
    } else {
        setMessages([]);
        resetAppointmentState();
        localStorage.removeItem('preSelectedDoctor');
        localStorage.removeItem('symptomContext');
        messageIdCounter = 0; // Reset counter on close
    }
  }, [isChatOpen, isAuthenticated]);

  useEffect(() => {
    if (!isDoctorsLoading && isChatOpen && doctors.length > 0 && messages.length === 0) {
        const preSelectedDoctorData = localStorage.getItem('preSelectedDoctor');
        if (preSelectedDoctorData) {
            try {
                const doctorInfo = JSON.parse(preSelectedDoctorData);
                localStorage.removeItem('preSelectedDoctor');
                const matchingDoctor = doctors.find(d => d.name === doctorInfo.name && d.specialty === doctorInfo.specialty);
                if (matchingDoctor) {
                    const welcomeMsg: Message = {
                        id: generateUniqueId(),
                        text: `Hello ${user?.name.split(' ')[0]}! 👋\n\nBased on your symptoms, I recommend:\n\n**${matchingDoctor.name}**\n*${matchingDoctor.specialty}*\n\nWould you like to book an appointment?`,
                        sender: 'bot', timestamp: new Date(),
                        buttons: [
                            { text: '✅ Yes, Book with This Doctor', action: 'selectDoctor', param: matchingDoctor._id, variant: 'primary' },
                            { text: '👨‍⚕️ See All Doctors', action: 'startBooking', variant: 'secondary' }
                        ]
                    };
                    setMessages([welcomeMsg]);
                    return;
                }
            } catch (e) { console.error('Error handling pre-selected doctor:', e); }
        }
        initializeChat();
    }
  }, [isDoctorsLoading, doctors, isChatOpen, messages.length, user]);

  useEffect(() => { scrollToBottom(); }, [messages, isGeneratingReceipt]);

  useEffect(() => {
    const handleOpenChatbot = () => { openChat(); };
    window.addEventListener('openChatbot', handleOpenChatbot);
    return () => { window.removeEventListener('openChatbot', handleOpenChatbot); };
  }, [openChat]);

  // --- DATA FETCHING ---
  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get('/doctors');
      if (response.data.success) setDoctors(response.data.doctors);
    } catch (error) { 
      console.error('Error fetching doctors:', error); 
      addMessage("Sorry, I couldn't load the doctors list. Please try again later.", 'bot');
    } 
    finally { setIsDoctorsLoading(false); }
  };

  // --- MESSAGE & UI HELPERS ---
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  
  const addMessage = (text: string, sender: 'user' | 'bot', buttons?: Message['buttons']) => 
    setMessages(prev => [...prev, { id: generateUniqueId(), text, sender, timestamp: new Date(), buttons }]);
  
  const simulateTyping = async (duration = 1000) => { 
    setIsTyping(true); 
    await new Promise(resolve => setTimeout(resolve, duration)); 
    setIsTyping(false); 
  };
  
  const resetAppointmentState = () => {
    setAppointment({ active: false, step: null, doctor: null, date: null, time: null });
    setConfirmedAppointment(null);
  };

  const formatTime = (time: string) => { 
    const [h, m] = time.split(':'); 
    const hour = parseInt(h, 10); 
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`; 
  };

  // --- CHAT INITIALIZATION ---
  const initializeChat = useCallback(() => {
    const welcomeMessage: Message = {
      id: generateUniqueId(),
      text: `Hello ${user?.name.split(' ')[0]}! 👋 I'm your AI Health Assistant. How can I assist you today?`,
      sender: 'bot', timestamp: new Date(),
      buttons: [
        { text: isDoctorsLoading ? 'Loading Doctors...' : '📅 Book Appointment', action: 'startBooking', variant: 'primary', disabled: isDoctorsLoading },
        { text: '🔍 Check Availability', action: 'checkAvailability', variant: 'secondary' },
        { text: '❌ Cancel Appointment', action: 'cancelAppointment', variant: 'danger' }
      ]
    };
    setMessages([welcomeMessage]);
  }, [user, isDoctorsLoading]);

  // --- MAIN HANDLERS ---
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    addMessage(inputValue, 'user');
    setInputValue('');
    await simulateTyping();
    addMessage("Please use the buttons for main actions like booking appointments.", 'bot');
  };
  
  const handleDownloadReceipt = async () => {
    const receiptElement = receiptRef.current;
    if (!receiptElement || !confirmedAppointment) {
        addMessage("Sorry, there was an error generating the receipt.", 'bot');
        return;
    }
    
    setMessages(prev => prev.map(msg => ({ ...msg, buttons: [] })));
    setIsGeneratingReceipt(true);

    try {
        await new Promise(resolve => setTimeout(resolve, 50));
        const canvas = await html2canvas(receiptElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`receipt-${confirmedAppointment.appointmentId.slice(-6)}.pdf`);
        
        addMessage("✅ Receipt downloaded successfully!", 'bot');
    } catch (error) {
        console.error("Error generating PDF:", error);
        addMessage("Something went wrong while creating the PDF. Please try again.", 'bot');
    } finally {
        setIsGeneratingReceipt(false);
        resetAppointmentState();
        showMainOptions();
    }
  };

  const handleButtonClick = async (action: string, param?: string) => {
    if (action !== 'downloadReceipt') {
        setMessages(prev => prev.map((msg, index) => index === prev.length - 1 ? { ...msg, buttons: [] } : msg));
    }
    if (action !== 'downloadReceipt') {
        await simulateTyping(200);
    }

    switch (action) {
      case 'startBooking':
        resetAppointmentState();
        startBookingProcess(); 
        break;
      case 'selectDoctor': handleDoctorSelection(param!); break;
      case 'selectDate': handleDateSelection(param!); break;
      case 'selectTime': handleTimeSelection(param!); break;
      case 'confirmBooking': await handleBookingConfirmation(param === 'true'); break;
      case 'downloadReceipt': await handleDownloadReceipt(); break;
      case 'checkAvailability': handleCheckAvailability(); break;
      case 'cancelAppointment': handleCancelAppointment(); break;
      default: addMessage("I'm not sure how to handle that, sorry!", 'bot');
    }
  };

  // --- APPOINTMENT FLOW LOGIC ---
  const startBookingProcess = () => {
    if (doctors.length === 0) {
      addMessage("I'm sorry, I can't fetch our doctors right now. Please try again later.", 'bot');
      showMainOptions();
      return;
    }
    resetAppointmentState();
    setAppointment(prev => ({ ...prev, active: true, step: 'selectDoctor' }));
    const doctorButtons = doctors.map(doc => ({
      text: `👨‍⚕️ ${doc.name} - ${doc.specialty}`,
      action: 'selectDoctor', param: doc._id, variant: 'secondary' as const
    }));
    addMessage('Great! Please select your preferred doctor:', 'bot', doctorButtons);
  };

  const handleDoctorSelection = (doctorId: string) => {
    const selectedDoctor = doctors.find(d => d._id === doctorId);
    if (!selectedDoctor) {
        addMessage("Sorry, I couldn't find that doctor. Let's try again.", 'bot');
        startBookingProcess();
        return;
    }
    addMessage(`Selected: ${selectedDoctor.name}`, 'user');
    setAppointment({ ...appointment, active: true, doctor: selectedDoctor, step: 'selectDate' });
    addMessage('Excellent choice! When would you like your appointment?', 'bot', [
        { text: '📅 Today', action: 'selectDate', param: 'today', variant: 'secondary' },
        { text: '📅 Tomorrow', action: 'selectDate', param: 'tomorrow', variant: 'secondary' }
    ]);
  };

  const handleDateSelection = async (dateParam: string) => {
    const displayDate = getDisplayDate(dateParam);
    addMessage(`Selected: ${displayDate}`, 'user');
    setAppointment(prev => ({ ...prev, date: dateParam, step: 'selectTime' }));
    await simulateTyping(1200);
    
    // Get the day name for checking availability
    const dayName = getDayName(dateParam);
    const selectedDoctor = appointment.doctor;
    
    if (!selectedDoctor || !selectedDoctor.availability) {
        addMessage("Sorry, I couldn't fetch available time slots. Please try again.", 'bot');
        return;
    }
    
    // Check if doctor is available on this day
    const isDoctorAvailable = selectedDoctor.availability.days.some(
        day => day.toLowerCase() === dayName
    );
    
    if (!isDoctorAvailable) {
        addMessage(
            `⚠️ ${selectedDoctor.name} is not available on ${displayDate}.\n\nAvailable days: ${selectedDoctor.availability.days.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}\n\nPlease select another date.`,
            'bot',
            [
                { text: '📅 Today', action: 'selectDate', param: 'today', variant: 'secondary' },
                { text: '📅 Tomorrow', action: 'selectDate', param: 'tomorrow', variant: 'secondary' },
                { text: '🔙 Choose Another Doctor', action: 'startBooking', variant: 'primary' }
            ]
        );
        return;
    }
    
    // Fetch booked slots for this doctor on this date
    const actualDate = getActualDate(dateParam);
    let bookedSlots: string[] = [];
    
    try {
        const response = await axiosInstance.get(`/appointments/check-availability`, {
            params: { doctorId: selectedDoctor._id, date: actualDate }
        });
        
        if (response.data.success) {
            bookedSlots = response.data.bookedSlots || [];
        }
    } catch (error) {
        console.error('Error checking availability:', error);
    }
    
    // Filter available slots
    const availableSlots = selectedDoctor.availability.timeSlots.filter(
        slot => !bookedSlots.includes(slot)
    );
    
    if (availableSlots.length === 0) {
        addMessage(
            `⚠️ All slots are fully booked for ${displayDate}. Please choose another date.`,
            'bot',
            [
                { text: '📅 Today', action: 'selectDate', param: 'today', variant: 'secondary' },
                { text: '📅 Tomorrow', action: 'selectDate', param: 'tomorrow', variant: 'secondary' },
                { text: '🔙 Choose Another Doctor', action: 'startBooking', variant: 'primary' }
            ]
        );
        return;
    }
    
    const timeButtons = availableSlots.map(time => ({ 
      text: `🕐 ${formatTime(time)}`, 
      action: 'selectTime', 
      param: time, 
      variant: 'secondary' as const 
    }));
    
    addMessage(`Here are the available slots for ${displayDate}:`, 'bot', timeButtons);
  };

  const handleTimeSelection = (time: string) => {
    addMessage(`Selected: ${formatTime(time)}`, 'user');
    setAppointment(prev => ({ ...prev, time, step: 'confirm' }));
    const { doctor, date } = appointment;
    const displayDate = getDisplayDate(date || '');
    addMessage(
        `Please confirm your appointment:\n\n**Doctor:** ${doctor?.name}\n**Date:** ${displayDate}\n**Time:** ${formatTime(time)}\n**Fee:** ₹${doctor?.consultationFee}`, 
        'bot', 
        [
            { text: '✅ Confirm Booking', action: 'confirmBooking', param: 'true', variant: 'primary' },
            { text: '❌ Start Over', action: 'startBooking', variant: 'danger' }
        ]
    );
  };

// File: frontend/src/components/Chatbot.tsx
// ACTION: Replace the existing handleBookingConfirmation function with this one.

  // File: frontend/src/components/Chatbot.tsx
// ACTION: Replace the existing handleBookingConfirmation function with this corrected one.

 // File: frontend/src/components/Chatbot.tsx
// ACTION: Replace your entire handleBookingConfirmation function with this.

const handleBookingConfirmation = async (confirmed: boolean) => {
    if (confirmed && appointment.doctor && appointment.date && appointment.time) {
        addMessage("Confirming your booking...", 'user');
        await simulateTyping(1500);
        try {
            const actualDate = getActualDate(appointment.date);
            
            // --- THIS IS THE FIX (Part 4) ---
            // 1. Get the symptoms from localStorage BEFORE making the API call.
            // This is the logic you already have, but moved to the top.
            const symptomsDataString = localStorage.getItem('symptomContext');
            let finalSymptoms: string[] = [];
            if (symptomsDataString) {
                const symptomsContext = JSON.parse(symptomsDataString);
                if (symptomsContext && Array.isArray(symptomsContext.symptoms)) {
                    finalSymptoms = symptomsContext.symptoms;
                }
            }
            // --- END OF PART 4 ---

            // --- THIS IS THE FIX (Part 5) ---
            // 2. Send the `finalSymptoms` array in the body of the POST request.
            const response = await axiosInstance.post('/appointments/book', {
                doctorId: appointment.doctor._id,
                date: actualDate,
                time: appointment.time,
                symptoms: finalSymptoms // This line is added
            });
            // --- END OF PART 5 ---

            if (response.data.success && response.data.appointment) {
                // This logic remains the same.
                localStorage.removeItem('symptomContext');
                
                const appointmentDetails: ConfirmedAppointmentDetails = {
                    appointmentId: response.data.appointment._id,
                    patientName: user?.name || 'Valued Patient',
                    doctor: appointment.doctor,
                    date: actualDate,
                    time: appointment.time,
                    symptoms: finalSymptoms // Continue to use finalSymptoms for the immediate receipt
                };

                setConfirmedAppointment(appointmentDetails);
                addMessage(
                    '🎉 Excellent! Your appointment is confirmed. Please download your receipt.',
                    'bot',
                    [{ text: `🧾 Download Receipt`, action: 'downloadReceipt', variant: 'primary' }]
                );
            } else {
                throw new Error(response.data.message || "Booking failed.");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "an unexpected issue occurred";
            addMessage(`I'm sorry, I couldn't book that appointment. ${errorMessage}`, 'bot');
            resetAppointmentState();
            showMainOptions();
        }
    } else if (!confirmed) {
        addMessage('Okay, the booking was cancelled.', 'bot');
        resetAppointmentState();
        showMainOptions();
    }
};

  const showMainOptions = () => {
    addMessage('How else can I help you today?', 'bot', [
        { text: '📅 Book Another Appointment', action: 'startBooking', variant: 'primary' },
        { text: '🔍 Check Availability', action: 'checkAvailability', variant: 'secondary' }
    ]);
  };

  const handleCheckAvailability = () => addMessage("Currently, you can check availability by starting the booking process.", 'bot', [ { text: '📅 Start Booking', action: 'startBooking', variant: 'primary' }]);
  const handleCancelAppointment = () => addMessage("To cancel an appointment, please call our front desk for assistance.", 'bot');

  if (!isAuthenticated) return null;

  return (
    <>
      {confirmedAppointment && (
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <AppointmentReceipt ref={receiptRef} {...confirmedAppointment} />
        </div>
      )}

      <AnimatePresence>
        {!isChatOpen && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="fixed bottom-6 right-6 z-50">
            <button onClick={openChat} className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-l-5 5v-5z" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className={`w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                isMinimized ? 'h-16' : 'h-[600px] max-h-[calc(100dvh-2rem)]'
              }`}
            >
              <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Lottie animationData={robotAnimation} className="w-6 h-6" loop={true} /></div>
                  <div>
                    <h3 className="font-semibold">AI Health Assistant</h3>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span className="text-xs opacity-90">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><Minimize2 size={18} /></button>
                  <button onClick={closeChat} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><X size={18} /></button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
                    {messages.map((message) => (
                      <div key={message.id}>
                        <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-4 rounded-2xl ${message.sender === 'user' ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-br-md shadow-lg' : 'bg-white text-gray-800 rounded-bl-md shadow-lg border border-gray-100'}`}>
                            <p className="whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}></p>
                          </div>
                        </div>
                        {message.buttons && (
                          <div className="flex flex-wrap gap-2 mt-3 ml-2">
                            {message.buttons.map((button, index) => (
                              <button key={`${message.id}-btn-${index}`} onClick={() => !button.disabled && handleButtonClick(button.action, button.param)} disabled={button.disabled} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${button.variant === 'primary' ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg hover:shadow-xl' : button.variant === 'danger' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-md'} ${button.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {button.text}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-bl-md shadow-lg border border-gray-100"><div className="flex space-x-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div></div></div>
                      </div>
                    )}
                    {isGeneratingReceipt && (
                        <div className="flex justify-start">
                          <div className="bg-white p-4 rounded-2xl rounded-bl-md shadow-lg border border-gray-100 flex items-center space-x-3">
                              <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
                              <span className="text-sm text-gray-600">Generating Receipt...</span>
                          </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-4 border-t bg-white flex-shrink-0">
                    <div className="flex space-x-3">
                      <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type your message..." className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      <button onClick={handleSendMessage} disabled={!inputValue.trim()} className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-2xl flex items-center justify-center disabled:opacity-50"><Send size={18} /></button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;