import React, { useState } from 'react';
import { Timer, CheckCircle, Heart, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

import { useApp } from '../context/AppContext';

export default function BookingHistory() {
  const { bookings, currentUser } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');

  const userBookings = bookings.filter(b => b.userId === currentUser?.id);
  
  const filteredBookings = filterStatus === 'All' 
    ? userBookings 
    : userBookings.filter(b => b.status === filterStatus);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-lavender text-coklat-tua';
      case 'Confirmed': return 'bg-[#C9F9E1] text-[#2D8A5B]';
      case 'Pending': return 'bg-[#FFF2B2] text-[#8A6D2D]';
      case 'Cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <MainLayout activeTab="bookings">
      <section className="max-w-7xl mx-auto px-6 lg:px-20 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-coklat-tua mb-3 font-poppins">My Bookings 🧾</h1>
          <p className="text-lg font-medium text-coklat-susu">Track your upcoming and past baking achievements.</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white/60 backdrop-blur-md mb-10 p-8 rounded-[40px] flex items-center gap-6 border border-white shadow-soft">
          <label className="text-sm font-bold text-coklat-tua font-poppins shrink-0">Filter Status:</label>
          <div className="flex flex-wrap gap-4">
            {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                  filterStatus === status 
                    ? 'bg-pink-pastel text-coklat-tua shadow-md' 
                    : 'bg-white text-coklat-susu hover:bg-cream border border-cream shadow-sm'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Booking List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-card overflow-hidden border border-white"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF8F3]">
                  <th className="px-10 py-8 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Course Name</th>
                  <th className="px-10 py-8 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Booking Date</th>
                  <th className="px-10 py-8 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Total</th>
                  <th className="px-10 py-8 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Status</th>
                  <th className="px-10 py-8 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFF8F3]">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="bg-white hover:bg-[#FFF8F3]/30 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                            <img src={booking.courseImage} className="w-full h-full object-cover" alt={booking.courseTitle} />
                          </div>
                          <p className="text-base font-bold text-coklat-tua font-poppins leading-tight">{booking.courseTitle}</p>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-sm font-bold text-coklat-tua font-poppins">{booking.date}</td>
                      <td className="px-10 py-8 text-sm font-bold text-coklat-tua font-poppins">{booking.totalPriceFormatted}</td>
                      <td className="px-10 py-8">
                        <span className={`inline-flex items-center px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`text-xs font-bold uppercase tracking-widest ${
                          booking.paymentStatus === 'Paid' ? 'text-[#2D8A5B]' : 'text-pink-pastel'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-10 py-12 text-center text-coklat-susu font-bold">No bookings found for this filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
}
