import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Stethoscope, Star, ArrowUpRight } from 'lucide-react';

const Doctors: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const doctors = [
    {
      name: 'Dr. John Smith',
      specialty: 'General Physician',
      experience: '12+ Years',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
      tag: 'Family Health'
    },
    {
      name: 'Dr. Emily Carter',
      specialty: 'Dermatologist',
      experience: '10+ Years',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
      tag: 'Skin Specialist'
    },
    {
      name: 'Dr. Michael Lee',
      specialty: 'Cardiologist',
      experience: '15+ Years',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      tag: 'Heart Surgeon'
    },
    {
      name: 'Dr. James Anderson',
      specialty: 'Neurosurgeon',
      experience: '18+ Years',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
      tag: 'Chief Surgeon'
    },
    {
      name: 'Dr. Robert Lee',
      specialty: 'Pediatrician',
      experience: '9+ Years',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f0871?auto=format&fit=crop&q=80&w=400',
      tag: 'Child Care'
    },
    {
      name: 'Dr. Sarah James',
      specialty: 'General Surgeon',
      experience: '14+ Years',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      tag: 'Advanced Surgery'
    },
    {
      name: 'Dr. Laura Carter',
      specialty: 'Oncologist',
      experience: '11+ Years',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400',
      tag: 'Cancer Specialist'
    },
    {
      name: 'Dr. David Wilson',
      specialty: 'Gastroenterologist',
      experience: '13+ Years',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1471864190281-ad5fe9ac5722?auto=format&fit=crop&q=80&w=400',
      tag: 'Digestive Health'
    },
    {
      name: 'Dr. Jennifer Brown',
      specialty: 'Endocrinologist',
      experience: '10+ Years',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
      tag: 'Hormone Specialist'
    },
    {
      name: 'Dr. Thomas Garcia',
      specialty: 'Pulmonologist',
      experience: '16+ Years',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1612531388260-6303b37a7f72?auto=format&fit=crop&q=80&w=400',
      tag: 'Lung Specialist'
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id="doctors" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <h4 className="text-cyan-500 font-bold text-xs uppercase tracking-[0.3em] mb-4">Elite Staff</h4>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter">
              World-Class <span className="text-slate-400">Experts.</span>
            </h2>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => scroll('left')}
              className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex space-x-8 overflow-x-auto pb-12 scrollbar-none snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {doctors.map((doctor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-[300px] md:w-[380px] snap-center group"
            >
              <div className="relative h-[480px] rounded-[3rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500">
                {/* Image */}
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay Detail */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
                    {doctor.tag}
                  </span>
                </div>

                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                    <Stethoscope size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{doctor.specialty}</span>
                  </div>
                  <h3 className="text-3xl font-black mb-4 tracking-tighter">{doctor.name}</h3>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="text-amber-400 fill-amber-400" size={12} />
                        <span className="text-xs font-bold">{doctor.rating}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-white/50">{doctor.experience}</span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 transition-all flex items-center justify-center">
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;