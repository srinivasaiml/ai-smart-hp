import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Heart, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';

const Hero: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { openChat } = useChat();

  const handleChatClick = () => {
    if (isAuthenticated) {
      openChat();
    } else {
      document.dispatchEvent(new CustomEvent('openAuthModal'));
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-700">
      {/* Refined Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px]" />
        
        {/* Animated Particles/Blobs */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-500/5 dark:bg-white/5"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating Cross Icons (Medical Symbols) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`cross-${i}`}
            className="absolute text-cyan-500/10 dark:text-white/5 select-none pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 40 + 20}px`,
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            +
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] mb-10 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Empowering Modern Healthcare
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black text-slate-900 dark:text-white mb-10 leading-[0.9] tracking-tighter transition-colors"
          >
            AI Smart  <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">Hospital.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium transition-colors"
          >
            Precision medicine augmented by AI. Compassionate care delivered with speed and accuracy for a healthier tomorrow.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button
              onClick={handleChatClick}
              className="w-full sm:w-auto px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Get Started
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
              Discover More
            </button>
          </motion.div>
        </div>

        {/* Floating Accents */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, label: 'Secure Diagnostics', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
            { icon: Heart, label: 'Human-Centric', color: 'text-rose-500', bg: 'bg-rose-500/10' },
            { icon: Activity, label: 'Real-time Monitoring', color: 'text-blue-500', bg: 'bg-blue-500/10' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 flex items-center space-x-6 hover:shadow-lg dark:hover:shadow-white/5 transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center`}>
                <item.icon className={`${item.color} w-7 h-7`} />
              </div>
              <div>
                <h4 className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-wide">{item.label}</h4>
                <div className="flex space-x-1 mt-2">
                  {[1, 2, 3].map(j => <div key={j} className="h-0.5 w-4 bg-slate-200 dark:bg-white/20 rounded-full" />)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modern Grid Overlay */}
      <div className="absolute inset-0 z-[-1] opacity-20 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
    </section>
  );
};

export default Hero;