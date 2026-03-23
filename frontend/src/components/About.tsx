import { motion } from 'framer-motion';
import { Award, Users, Heart, Zap, Sparkles, Brain, Shield, Activity, Bot } from 'lucide-react';

const About: React.FC = () => {
  const achievements = [
    {
      icon: Award,
      title: 'Excellence Awards',
      description: 'Recognized for outstanding patient care',
      color: 'from-amber-400 to-orange-500'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: '200+ certified medical professionals',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      icon: Heart,
      title: 'Patient-Centered',
      description: 'Compassionate care at every step',
      color: 'from-rose-400 to-pink-500'
    },
    {
      icon: Zap,
      title: 'AI Innovation',
      description: 'Cutting-edge technology integration',
      color: 'from-purple-400 to-indigo-500'
    }
  ];

  return (
    <section id="about" className="py-24 bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-500">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-cyan-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Our Legacy of Innovation
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-tight tracking-tighter">
              Technology Guided by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Empathy.</span>
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 font-medium">
              At Srinivasa Hospital, we combine clinical precision with AI innovation to deliver 
              healthcare that is both advanced and deeply human.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {achievements.map((item, index) => (
                <div key={index} className="p-6 rounded-3xl bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                    <item.icon className="text-white w-6 h-6" />
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold mb-2">{item.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Hero Image */}
          {/* Right Content - Neural Healthcare Hub Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative flex justify-center items-center h-[500px]"
          >
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute inset-0 bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-700" />

            <div className="relative w-full h-full flex items-center justify-center">
              {/* Rotating Orbits */}
              <motion.div 
                className="absolute w-[400px] h-[400px] border border-cyan-500/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 glass-card flex items-center justify-center">
                    <Brain className="text-cyan-500 w-6 h-6" />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 glass-card flex items-center justify-center">
                    <Shield className="text-purple-500 w-6 h-6" />
                </div>
              </motion.div>

              <motion.div 
                className="absolute w-[280px] h-[280px] border border-blue-500/20 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 glass-card flex items-center justify-center">
                    <Activity className="text-rose-500 w-5 h-5" />
                </div>
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-10 h-10 glass-card flex items-center justify-center">
                    <Zap className="text-amber-500 w-5 h-5" />
                </div>
              </motion.div>

              {/* Central Core */}
              <motion.div
                className="relative z-10 w-48 h-48 glass-card flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
                <Bot className="w-24 h-24 text-cyan-500 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
                
                {/* Scanning Effect */}
                <motion.div 
                  className="absolute inset-0 border-2 border-cyan-500/50 rounded-[2.5rem]"
                  animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Floating Data Points */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                  animate={{
                    x: [0, (i % 2 === 0 ? 1 : -1) * 200, 0],
                    y: [0, (i % 3 === 0 ? 1 : -1) * 200, 0],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.5, 0]
                  }}
                  transition={{ 
                    duration: 4 + i, 
                    repeat: Infinity, 
                    delay: i * 0.5,
                    ease: "easeInOut" 
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;