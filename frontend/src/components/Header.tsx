import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, LogOut, Sparkles, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark for premium look
  const { isAuthenticated, logout } = useAuth();
  const { openChat } = useChat();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Initial theme check - sync state with DOM
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleChatClick = () => {
    if (isAuthenticated) {
      openChat();
    } else {
      document.dispatchEvent(new CustomEvent('openAuthModal'));
    }
  };

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#services', label: 'Services' },
    { href: '#about', label: 'About' },
    { href: '#doctors', label: 'Doctors' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 pointer-events-none">
      <div className={`w-full transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <motion.nav 
            className={`pointer-events-auto relative px-6 py-4 rounded-3xl border transition-all duration-500 ${
              isScrolled 
                ? 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-slate-200 dark:border-white/10 shadow-xl' 
                : 'bg-transparent border-transparent'
            }`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-between items-center">
              {/* Logo */}
              <motion.a 
                href="#home"
                className="flex items-center space-x-3 group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-xl blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-full h-full bg-slate-950 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                    <span className="text-white font-black text-xl">S</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-white font-black text-xl leading-none tracking-tighter uppercase">Srinivasa</span>
                  <span className="text-cyan-500 dark:text-cyan-400 font-bold text-[10px] tracking-[0.3em]">HOSPITAL</span>
                </div>
              </motion.a>

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-5 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-white transition-colors relative group"
                  >
                    <span className="relative z-10">{link.label}</span>
                    <motion.div 
                      className="absolute bottom-0 left-5 right-5 h-[2px] bg-cyan-500 origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="hidden lg:flex items-center space-x-4">
                <motion.button
                  onClick={toggleTheme}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-white transition-all shadow-sm"
                  title="Toggle Theme"
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>
                
                <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10 mx-2" />

                <motion.button
                  onClick={handleChatClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white dark:text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg transition-all"
                >
                  <Sparkles size={16} />
                  <span>Book Now</span>
                </motion.button>

                {isAuthenticated ? (
                  <motion.button
                    onClick={logout}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-rose-500/20 text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 transition-all font-bold text-xs"
                  >
                    <LogOut size={16} />
                    <span>LOGOUT</span>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => document.dispatchEvent(new CustomEvent('openAuthModal'))}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                  >
                    <User size={16} />
                    <span>GET STARTED</span>
                  </motion.button>
                )}
              </div>

              {/* Mobile Toggle */}
              <div className="lg:hidden flex items-center space-x-4 pointer-events-auto">
                <button onClick={toggleTheme} className="text-slate-900 dark:text-white">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button 
                  className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </motion.nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-4 right-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-3xl mt-2 overflow-hidden pointer-events-auto shadow-2xl"
          >
            <div className="p-8 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-2xl font-black text-slate-900 dark:text-white hover:text-cyan-500 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-slate-200 dark:bg-white/10 w-full my-4" />
              <button
                onClick={handleChatClick}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black flex items-center justify-center space-x-3"
              >
                <Sparkles size={20} />
                <span>BOOK APPOINTMENT</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;