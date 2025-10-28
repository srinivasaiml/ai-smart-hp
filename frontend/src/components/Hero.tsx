import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Award, Users, Clock, Sparkles, Zap } from 'lucide-react';
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

  const features = [
    { icon: Shield, text: '24/7 Emergency Care' },
    { icon: Award, text: 'Award-Winning Doctors' },
    { icon: Users, text: '50,000+ Happy Patients' },
    { icon: Clock, text: 'Quick AI Booking' }
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 via-blue-900/80 to-purple-900/70" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              AI-Powered Healthcare Platform
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="font-serif">Experience the</span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Future of Healthcare
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Book appointments instantly with our AI assistant. Get world-class medical care 
              with cutting-edge technology and compassionate doctors.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.button
                onClick={handleChatClick}
                className="group bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="w-5 h-5" />
                <span className="text-lg">Start AI Consultation</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </motion.button>
              
              <motion.button
                className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={20} />
                <span className="text-lg">Watch Demo</span>
              </motion.button>
            </motion.div>

            {/* Features */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="text-orange-400 mb-2" size={24} />
                  <span className="text-white/90 text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - AI Robot Illustration */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-3xl blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* AI Robot Container */}

              {/* Heart Rate Animation Container */}
              <motion.div
                className="relative z-10 w-full h-96 lg:h-[500px] bg-gradient-to-br from-slate-1000/40 to-slate-800/40 backdrop-blur-md rounded-3xl shadow-2xl border border-teal-400/30 flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(45, 212, 191, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(45, 212, 191, 0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                </div>

                {/* Glowing Corners */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-teal-400/50 rounded-tl-2xl" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-teal-400/50 rounded-tr-2xl" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-teal-400/50 rounded-bl-2xl" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-teal-400/50 rounded-br-2xl" />

                {/* Heart Rate Line Animation */}
                <div className="relative w-full h-full flex items-center justify-center p-8">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 502.98 108.61"
                    className="w-full h-auto max-w-4xl"
                    style={{ overflow: 'visible' }}
                  >
                    <defs>
                      <style>
                        {`
                          @keyframes dash {
                            0% { stroke-dashoffset: 1; }
                            80% { stroke-dashoffset: 0; }
                            100% { stroke-dashoffset: 0; }
                          }
                          @keyframes blink {
                            0% { opacity: 0; transform: scale(0); }
                            60% { opacity: 0; transform: scale(0); }
                            70% { opacity: 1; transform: scale(1.2); }
                            75% { opacity: 1; transform: scale(1.0); }
                            80% { opacity: 1; transform: scale(1.2); }
                            85% { opacity: 1; transform: scale(1.0); }
                            100% { opacity: 0; transform: scale(1.0); }
                          }
                          #heartbeat-line {
                            fill: none;
                            stroke: #22d3ee;
                            stroke-width: 2.5;
                            stroke-linecap: butt;
                            stroke-linejoin: round;
                            stroke-dasharray: 1;
                            stroke-dashoffset: 1;
                            animation: dash 4s linear infinite;
                            filter: drop-shadow(0 0 5px #22d3ee) drop-shadow(0 0 10px #22d3ee);
                          }
                          #heartbeat-heart {
                            transform-origin: 50% 50%;
                            animation: blink 4s linear infinite;
                            fill: #ec4899;
                            stroke: #ec4899;
                            stroke-width: 1.5;
                            filter: drop-shadow(0 0 8px #ec4899) drop-shadow(0 0 15px #ec4899);
                          }
                        `}
                      </style>
                    </defs>
                    <path 
                      id="heartbeat-heart" 
                      d="M213.35 29.43c19.41-15.19 33.68 10.86 37.73 18.82-.28-13.61 11.64-40.98 25.94-34.01 32.3 15.74-15.88 83.8-26.4 81.76-13.24-9-51.35-53.3-37.27-66.57Z"
                    />
                    <path  
                      pathLength="1" 
                      id="heartbeat-line" 
                      d="M5.32 78.13c.96-.01 5-8.5 5.54-8.54.58-.05 6.1 8.51 7.1 8.51 3.66 0 9.29.06 10.71.05 2.53-.01 4.82-72.88 4.82-72.88l4.76 97.28 3.97-24.45 20.45-.22C64 77.86 77.1 63.66 78.36 63.8c1.31.15 6.68 14.08 7.94 14.07 2.3-.03 33.32.04 35.76.02.96 0 5-8.5 5.53-8.53.59-.05 6.1 8.51 7.1 8.5 3.66 0 9.3.07 10.72.06 2.53-.02 4.81-72.89 4.81-72.89l4.77 97.28 3.97-24.44s83.34-3.33 74.69 7.67c-8.65 11-45.3-42.94-31.65-53.58 25.6-19.96 49.96 36.94 40.26 36.5-12.2-.53 1.8-62.32 23.41-51.7 32.24 15.86-17.56 84.92-26.4 81.77-5.73-2.05-.68-21.68 31.4-26.58 26.65-6.42 29.5 2.35 52.62 7.11 2.53-.02 4.82-72.89 4.82-72.89l4.76 97.28 3.97-24.44 20.45-.22c1.31-.02 14.41-14.22 15.68-14.07 1.32.15 6.7 14.08 7.95 14.07 2.29-.03 33.32.04 35.76.02.95 0 5-8.5 5.53-8.54.58-.04 6.1 8.52 7.1 8.52 3.66 0 9.3.06 10.72.05 2.53-.02 4.81-72.89 4.81-72.89l4.77 97.28 3.97-24.44 20.45-.23c1.31-.01 14.4-14.22 15.68-14.07 1.32.16 6.69 14.09 7.94 14.07" 
                    />
                  </svg>
                </div>

                {/* Health Stats Overlay */}
                <div className="absolute top-8 left-8">
                  <motion.div
                    className="bg-slate-900/80 backdrop-blur-sm border border-teal-400/30 rounded-2xl p-4"
                    animate={{
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <div className="text-teal-400 font-mono text-sm mb-1">HEART RATE</div>
                    <div className="text-white text-3xl font-bold">72</div>
                    <div className="text-teal-400 font-mono text-xs">BPM</div>
                  </motion.div>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-8 right-8">
                  <motion.div
                    className="bg-slate-900/80 backdrop-blur-sm border border-teal-400/30 rounded-2xl px-4 py-2 flex items-center space-x-2"
                    animate={{
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <motion.div
                      className="w-3 h-3 bg-green-500 rounded-full"
                      animate={{
                        boxShadow: ['0 0 5px #22c55e', '0 0 15px #22c55e', '0 0 5px #22c55e'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                    <span className="text-white font-mono text-sm">MONITORING</span>
                  </motion.div>
                </div>

                {/* Bottom Stats */}
                <div className="absolute bottom-8 left-8 right-8 flex justify-between">
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-teal-400/30 rounded-xl px-4 py-2">
                    <div className="text-teal-400 font-mono text-xs">O2 SAT</div>
                    <div className="text-white text-xl font-bold">98%</div>
                  </div>
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-teal-400/30 rounded-xl px-4 py-2">
                    <div className="text-teal-400 font-mono text-xs">PRESSURE</div>
                    <div className="text-white text-xl font-bold">120/80</div>
                  </div>
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-teal-400/30 rounded-xl px-4 py-2">
                    <div className="text-teal-400 font-mono text-xs">TEMP</div>
                    <div className="text-white text-xl font-bold">98.6°F</div>
                  </div>
                </div>
              </motion.div>
              
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;