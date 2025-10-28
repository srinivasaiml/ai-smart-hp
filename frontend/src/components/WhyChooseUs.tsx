import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MessageCircle, Heart, Shield, Users } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      icon: MessageCircle,
      title: 'AI Health Assistant',
      description: 'Use our intelligent Chat AI to get health tips, advice, and book appointments in real-time.'
    },
    {
      icon: Heart,
      title: '24/7 Emergency Support',
      description: 'Immediate assistance and round-the-clock emergency care for all critical situations.'
    },
    {
      icon: Shield,
      title: 'World-Class Facilities',
      description: 'Our state-of-the-art infrastructure is designed to ensure safety, comfort, and excellent care.'
    },
    {
      icon: Users,
      title: 'Expert Medical Team',
      description: 'Our highly qualified and experienced medical professionals are committed to your health.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNhbCUyMGNhcmV8ZW58MHx8MHx8fDA%3D&w=1000&q=80"
              alt="Medical Care"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl"></div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
              Why We're Different
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              At our healthcare facility, we go beyond the ordinary to provide exceptional care tailored to your unique needs. With a patient-centered approach, cutting-edge technology, and a compassionate team of experts, we strive to deliver not just treatment but a holistic healing experience.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ y: 30, opacity: 0 }}
                  animate={inView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;