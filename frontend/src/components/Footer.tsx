import React from 'react';

import { MapPin, Mail, Phone, Instagram, Facebook, Twitter, ShieldCheck, Award, Heart, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About Us', href: '#about' },
    { name: 'Doctors', href: '#doctors' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="bg-white dark:bg-slate-950 pt-20 pb-10 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <span className="text-slate-900 dark:text-white font-black text-xl tracking-tighter uppercase">Srinivasa</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Advancing healthcare through technology and empathy. Our AI-driven platform ensures you get the best medical attention.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Facebook, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-500 hover:border-cyan-500/50 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6 italic">Navigation</h4>
            <ul className="space-y-4">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors text-sm font-medium flex items-center group">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6 italic">Connect</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="text-cyan-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">Hi-Tech City, Hyderabad, AP, India</p>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="text-cyan-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">+91 123 456 7890</p>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="text-cyan-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">info@srinivasahospital.ai</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6 italic">Trust</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex flex-col items-center">
                <ShieldCheck className="text-cyan-500 w-6 h-6 mb-2" />
                <span className="text-[10px] text-slate-500 font-bold uppercase">ISO 27001</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex flex-col items-center">
                <Award className="text-cyan-500 w-6 h-6 mb-2" />
                <span className="text-[10px] text-slate-500 font-bold uppercase">NABH</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            © 2024 Srinivasa Hospital. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-2">
            <Heart className="text-rose-500 w-4 h-4 animate-pulse" />
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Dedicated to Humanity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;