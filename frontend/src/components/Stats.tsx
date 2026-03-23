import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Users, Award, Calendar, Heart } from 'lucide-react';

const Stats: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const stats = [
    {
      label: 'Patients Healed',
      value: 50000,
      suffix: '+',
      icon: Users,
      color: 'text-cyan-500'
    },
    {
      label: 'Specialist Doctors',
      value: 200,
      suffix: '+',
      icon: Award,
      color: 'text-purple-500'
    },
    {
      label: 'Appointments',
      value: 12000,
      suffix: '+',
      icon: Calendar,
      color: 'text-blue-500'
    },
    {
      label: 'Patient Satisfaction',
      value: 99.8,
      suffix: '%',
      icon: Heart,
      color: 'text-rose-500',
      decimals: 1
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-slate-50 dark:bg-slate-950/50 border-y border-slate-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className={`${stat.color} mb-6 flex justify-center transform group-hover:scale-110 transition-transform`}>
                <stat.icon size={32} strokeWidth={1.5} />
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
                {inView ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                  />
                ) : '0'}
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;