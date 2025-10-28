import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Award, Clock, IndianRupee } from 'lucide-react';

const Doctors: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
const doctors = [
    {
      name: 'Dr. John Smith',
      specialty: 'General Physician',
      qualification: 'MBBS, MD (General Medicine)',
      experience: 15,
      consultationFee: 500,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&w=400&q=80'
    },
    {
      name: 'Dr. Emily Carter',
      specialty: 'Dermatologist',
      qualification: 'MBBS, MD (Dermatology)',
      experience: 12,
      consultationFee: 600,
      image: 'https://plus.unsplash.com/premium_photo-1673953510160-6d722ad05912?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQxfHxkb2N0b3J8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600'
    },
    {
      name: 'Dr. Michael Lee',
      specialty: 'Cardiologist',
      qualification: 'MBBS, MD, DM (Cardiology)',
      experience: 20,
      consultationFee: 800,
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&w=400&q=80'
    },
    {
      name: 'Dr. Robert Lee',
      specialty: 'Pediatrician',
      qualification: 'MBBS, MD (Pediatrics)',
      experience: 18,
      consultationFee: 550,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&w=400&q=80'
    },
    {
      name: 'Dr. James Anderson',
      specialty: 'Neurosurgeon',
      qualification: 'MBBS, MS, M.Ch (Neuro Surgery)',
      experience: 22,
      consultationFee: 1000,
      image: 'https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600'
    },
    {
      name: 'Dr. Sarah James',
      specialty: 'General Surgeon',
      qualification: 'MBBS, MS (General Surgery)',
      experience: 16,
      consultationFee: 700,
      image: 'https://plus.unsplash.com/premium_photo-1681966531074-0957dc900a5f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTd8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600'
    },
    {
      name: 'Dr. Laura Carter',
      specialty: 'Oncologist',
      qualification: 'MBBS, MD, DM (Medical Oncology)',
      experience: 19,
      consultationFee: 950,
      image: 'https://plus.unsplash.com/premium_photo-1681967035389-84aabd80cb1e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjF8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600'
    },
    {
      name: 'Dr. David Wilson',
      specialty: 'Gastroenterologist',
      qualification: 'MBBS, MD (Gastroenterology)',
      experience: 17,
      consultationFee: 750,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&w=400&q=80'
    },
    {
      name: 'Dr. Jennifer Brown',
      specialty: 'Endocrinologist',
      qualification: 'MBBS, MD (Endocrinology)',
      experience: 14,
      consultationFee: 700,
      image: 'https://plus.unsplash.com/premium_photo-1681966907271-1e350ec3bb95?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600'
    },
    {
      name: 'Dr. Thomas Garcia',
      specialty: 'Pulmonologist',
      qualification: 'MBBS, MD (Pulmonology)',
      experience: 16,
      consultationFee: 720,
      image: 'https://images.unsplash.com/photo-1712215544003-af10130f8eb3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600'
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id="doctors" className="py-20 bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Expert Medical Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet our highly qualified specialists who bring years of experience and 
            dedication to providing exceptional healthcare services.
          </p>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {doctors.map((doctor, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                <div className="h-72 overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&w=400&q=80';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-teal-600 font-semibold text-lg mb-3">
                    {doctor.specialty}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span className="leading-tight">{doctor.qualification}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      <span className="font-semibold text-gray-700">₹{doctor.consultationFee} consultation</span>
                    </div>
                  </div>

                  <button className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>

          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => scroll('left')}
              className="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctors;