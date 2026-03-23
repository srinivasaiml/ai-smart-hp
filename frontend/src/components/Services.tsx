import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Shield, Cpu, ArrowRight } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Neural Diagnostics',
      description: 'Advanced brain mapping and neuro-imaging powered by proprietary AI models.',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      delay: 0.1
    },
    {
      title: 'Precision Surgery',
      description: 'Robotic-assisted procedures with sub-millimeter accuracy for better outcomes.',
      icon: Cpu,
      color: 'from-purple-500 to-indigo-500',
      delay: 0.2
    },
    {
      title: 'Cardiac Care',
      description: 'Real-time heart monitoring and predictive analytics for preventative health.',
      icon: Activity,
      color: 'from-rose-500 to-pink-500',
      delay: 0.3
    },
    {
      title: 'Emergency Response',
      description: 'AI-prioritized emergency services ensuring zero-latency critical care.',
      icon: Shield,
      color: 'from-amber-500 to-orange-500',
      delay: 0.4
    }
  ];

  return (
    <section id="services" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h4 className="text-cyan-500 font-bold text-xs uppercase tracking-[0.3em] mb-4">Our Expertise</h4>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter">
              Future-Ready <span className="text-slate-400">Services.</span>
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm">
            Leveraging the latest in medical technology to provide a seamless healthcare experience from diagnosis to recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: service.delay }}
              viewport={{ once: true }}
              className="group p-8 rounded-[3rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-cyan-500/50 dark:hover:border-white/20 transition-all duration-500 hover:shadow-2xl dark:hover:shadow-white/5"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-8 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                <service.icon className="text-white w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 tracking-tight group-hover:text-cyan-500 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 font-medium italic">
                {service.description}
              </p>
              <button className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-cyan-500 transition-colors group/btn">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;