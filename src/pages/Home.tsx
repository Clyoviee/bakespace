import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import MainLayout from '../components/MainLayout';

import { useApp } from '../context/AppContext';
import { Course } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const { courses } = useApp();

  const handleBook = (course: Course) => {
    sessionStorage.setItem('selected_course', JSON.stringify(course));
    navigate('/checkout');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-16">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 mb-20 md:mb-32 relative">
          <div className="lg:w-1/2 space-y-6 md:space-y-10 z-10 text-center lg:text-left">
            <motion.h1 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-coklat-tua leading-tight font-poppins"
            >
              Learn Baking with Fun & Creativity
            </motion.h1>
            <motion.p 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-xl text-coklat-susu leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Join our aesthetic baking classes. From cute Korean bento cakes to delicious soft cookies, discover your inner pastry chef in our cozy space.
            </motion.p>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button 
                onClick={() => document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary text-base md:text-lg px-8 md:px-10 py-4 md:py-5 w-full sm:w-auto"
              >
                Book a Class Now
              </button>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="lg:w-1/2 relative w-full max-w-md lg:max-w-none"
          >
            <div className="absolute inset-0 bg-pink-pastel/20 rounded-[30px] md:rounded-[40px] blur-3xl transform translate-x-5 md:translate-x-10 translate-y-5 md:translate-y-10"></div>
            <img 
              className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-[30px] md:rounded-[40px] shadow-2xl md:rotate-3 hover:rotate-0 transition-all duration-500" 
              src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80" 
              alt="Delicious Cookie" 
            />
          </motion.div>
        </section>

        {/* Popular Classes Section */}
        <section id="classes" className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-coklat-tua font-poppins mb-4">Popular Classes</h2>
            <div className="h-1.5 w-24 bg-pink-pastel mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[40px] overflow-hidden shadow-card border border-white flex flex-col h-full group"
              >
                <div className="h-64 overflow-hidden">
                  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={item.image} alt={item.title} />
                </div>
                <div className="p-8 flex flex-col grow">
                  <h3 className="text-2xl font-bold text-coklat-tua mb-3 font-poppins">{item.title}</h3>
                  <p className="text-sm font-medium text-coklat-susu mb-6 line-clamp-2 h-10">{item.description}</p>
                  
                  <div className="mt-auto space-y-6">
                    <div className="flex items-center gap-2 text-coklat-susu font-bold">
                      <div className="w-8 h-8 rounded-lg bg-lavender/50 flex items-center justify-center text-primary">
                        <Calendar size={16} />
                      </div>
                      <span className="text-sm font-bold">
                        {new Date(item.schedule).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-[#FFF8F3]">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-[#FFB7D5] font-poppins">{item.priceFormatted}</span>
                        <span className="text-[10px] font-bold text-coklat-susu uppercase tracking-widest mt-1">
                          {item.availableSlots ?? item.slots} / {item.slots} Slots Left
                        </span>
                      </div>
                      <button 
                        onClick={() => handleBook(item)}
                        disabled={(item.availableSlots ?? item.slots) <= 0}
                        className={`px-8 py-3 rounded-full text-sm font-bold shadow-sm transition-all ${
                          (item.availableSlots ?? item.slots) > 0 
                          ? 'bg-lavender text-coklat-tua hover:brightness-105' 
                          : 'bg-cream text-coklat-susu cursor-not-allowed opacity-60'
                        }`}
                      >
                        {(item.availableSlots ?? item.slots) > 0 ? 'Book Now' : 'Full Booked'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
