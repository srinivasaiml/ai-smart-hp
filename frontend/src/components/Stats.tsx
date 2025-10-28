import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Users, Award, Clock, Heart } from 'lucide-react';

const Stats: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  const stats = [
    {
      icon: Users,
      number: 50000,
      suffix: '+',
      label: 'Happy Patients',
      description: 'Trusted by families across the region',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      number: 25,
      suffix: '+',
      label: 'Years Experience',
      description: 'Decades of medical excellence',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      number: 24,
      suffix: '/7',
      label: 'Emergency Care',
      description: 'Round-the-clock medical support',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Heart,
      number: 98,
      suffix: '%',
      label: 'Success Rate',
      description: 'Exceptional treatment outcomes',
      color: 'from-red-500 to-orange-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our Achievements
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="font-serif">Trusted by</span>{' '}
            <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Our commitment to excellence is reflected in the trust our patients place in us 
            and the outstanding outcomes we achieve together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 group-hover:scale-105">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`relative w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="text-white" size={32} />
                </div>
                
                {/* Number */}
                <div className="relative z-10 mb-4">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {inView && (
                      <CountUp
                        end={stat.number}
                        duration={2.5}
                        delay={index * 0.2}
                      />
                    )}
                    <span className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.suffix}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {stat.label}
                  </h3>
                  
                  <p className="text-white/70 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;