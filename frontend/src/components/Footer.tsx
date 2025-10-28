import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Instagram, Facebook, Twitter, Heart, Shield, Award } from 'lucide-react';

const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Doctors', href: '#doctors' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    { name: 'Emergency Care', href: '#' },
    { name: 'Cardiology', href: '#' },
    { name: 'Neurology', href: '#' },
    { name: 'Pediatrics', href: '#' },
    { name: 'Orthopedics', href: '#' }
  ];

  const certifications = [
    { icon: Shield, text: 'ISO 9001:2015 Certified' },
    { icon: Award, text: 'NABH Accredited' },
    { icon: Heart, text: 'Patient Safety Certified' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
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

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Hospital Info */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div className="font-bold text-2xl">
                  <span className="font-serif">Srinivasa</span>{' '}
                  <span className="text-orange-400 font-sans">Hospital</span>
                </div>
              </div>
              
              <p className="text-white/80 leading-relaxed mb-6 text-lg">
                We are honored to be a part of your healthcare journey and committed to delivering 
                compassionate, personalized, and top-notch care every step of the way. Experience 
                the future of healthcare with our AI-powered appointment system.
              </p>
              
              <p className="text-white/70 leading-relaxed mb-6">
                Trust us with your health, and let us work together to achieve the best possible 
                outcomes for you and your loved ones.
              </p>

              {/* Certifications */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white mb-3">Our Certifications</h4>
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 text-white/80"
                    whileHover={{ x: 5, color: '#ffffff' }}
                    transition={{ duration: 0.2 }}
                  >
                    <cert.icon size={18} className="text-teal-400" />
                    <span className="text-sm">{cert.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href={link.href}
                      className="text-white/70 hover:text-orange-400 transition-colors duration-300 flex items-center group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="w-2 h-2 bg-teal-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-6 text-white">Medical Services</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <motion.a
                      href={service.href}
                      className="text-white/70 hover:text-orange-400 transition-colors duration-300 flex items-center group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="w-2 h-2 bg-teal-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {service.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <motion.div
            className="border-t border-white/20 mt-12 pt-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-white">Visit Us</div>
                  <div className="text-white/70 text-sm">1-30, Rajamundry, Andhra Pradesh, India</div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-white">Call Us</div>
                  <div className="text-white/70 text-sm">+91 123 456 7890</div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Mail className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-white">Email Us</div>
                  <div className="text-white/70 text-sm">info@srinivasahospital.com</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <motion.p
                className="text-white/70 text-sm mb-4 md:mb-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Copyright © 2024 Srinivasa Hospital. All rights reserved. | Designed with ❤️ for better healthcare
              </motion.p>
              
              <div className="flex items-center space-x-6">
                <div className="flex space-x-4">
                  {[
                    { Icon: Instagram, href: '#', color: 'from-pink-500 to-purple-500' },
                    { Icon: Facebook, href: '#', color: 'from-blue-500 to-blue-600' },
                    { Icon: Twitter, href: '#', color: 'from-blue-400 to-blue-500' }
                  ].map(({ Icon, href, color }, index) => (
                    <motion.a
                      key={index}
                      href={href}
                      className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={18} />
                    </motion.a>
                  ))}
                </div>
                
                <div className="flex space-x-4 text-sm">
                  <motion.a
                    href="#"
                    className="text-white/70 hover:text-orange-400 transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    Privacy Policy
                  </motion.a>
                  <motion.a
                    href="#"
                    className="text-white/70 hover:text-orange-400 transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    Terms of Service
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;