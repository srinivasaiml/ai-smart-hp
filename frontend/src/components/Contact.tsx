import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Sparkles, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Appointment Inquiry',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await axiosInstance.post('/contact', formData);
      if (response.data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: 'Appointment Inquiry', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.response?.data?.error || 'Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
          
          {/* Left: Info */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-cyan-500 text-xs font-bold uppercase tracking-widest mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Get In Touch
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter mb-10">
               Let's Talk <br />
               <span className="text-slate-400 italic">About Health.</span>
            </h2>

            <div className="space-y-8">
              {[
                { icon: Mail, label: 'Email Us', value: 'info@srinivasahospital.ai', color: 'blue' },
                { icon: Phone, label: 'Call Us', value: '+91 123 456 7890', color: 'purple' },
                { icon: MapPin, label: 'Visit Us', value: 'Hi-Tech City, Hyderabad, AP', color: 'cyan' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center space-x-6 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-cyan-500/30 transition-all"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-500 shadow-sm`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                    <p className="text-slate-900 dark:text-white font-bold">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-12 rounded-[3.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 shadow-sm transition-all relative overflow-hidden"
          >
            <div className="flex items-center space-x-3 mb-10">
              <MessageSquare className="text-cyan-500" size={24} />
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Secure Message</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-8 py-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:border-cyan-500 outline-none transition-all font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-8 py-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:border-cyan-500 outline-none transition-all font-medium" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Subject</label>
                <div className="relative">
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-8 py-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:border-cyan-500 outline-none transition-all font-medium appearance-none"
                  >
                    <option>Appointment Inquiry</option>
                    <option>General Support</option>
                    <option>Emergency Assistant</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Your Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4} 
                  placeholder="How can we help you today?"
                  className="w-full px-8 py-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:border-cyan-500 outline-none transition-all font-medium resize-none" 
                />
              </div>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center space-x-3"
                  >
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-bold">Message Transmitted Successfully!</span>
                  </motion.div>
                ) : status === 'error' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center space-x-3"
                  >
                    <AlertCircle size={18} />
                    <span className="text-sm font-bold">{errorMessage}</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl transition-all disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <span>Transmit Message</span>
                    <Send size={16} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
