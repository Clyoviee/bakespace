import React from 'react';
import { motion } from 'motion/react';
import MainLayout from '../components/MainLayout';

import { Calendar, Users, TrendingUp, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminBookingData() {
  const { bookings, updateBookingStatus } = useApp();

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
    <MainLayout isAdmin activeTab="booking-data">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-coklat-tua mb-2 font-poppins">Manage Bookings 📋</h2>
          <p className="text-coklat-susu font-medium">Verify payments and update class attendance status.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-card overflow-hidden border border-white"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF8F3]">
                  <th className="px-8 py-6 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">ID</th>
                  <th className="px-8 py-6 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Customer</th>
                  <th className="px-8 py-6 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Course</th>
                  <th className="px-8 py-6 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Qty</th>
                  <th className="px-8 py-6 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Total</th>
                  <th className="px-8 py-6 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Payment</th>
                  <th className="px-8 py-6 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Status</th>
                  <th className="px-8 py-6 text-xs font-bold text-coklat-susu uppercase tracking-widest text-center font-poppins">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFF8F3]">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-[#FFF8F3]/30 transition-colors">
                      <td className="px-8 py-8 text-sm font-bold text-[#FFB7D5] font-poppins">{booking.id}</td>
                      <td className="px-8 py-8 text-sm font-bold text-coklat-tua">{booking.userName}</td>
                      <td className="px-8 py-8 text-sm font-medium text-coklat-tua">{booking.courseTitle}</td>
                      <td className="px-8 py-8 text-sm font-bold text-coklat-tua">{booking.participants}</td>
                      <td className="px-8 py-8 text-sm font-bold text-coklat-tua">{booking.totalPriceFormatted}</td>
                      <td className="px-8 py-8">
                        <p className="text-xs font-bold text-coklat-tua mb-1">{booking.paymentMethod}</p>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <span className={`inline-flex items-center px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center justify-center gap-3">
                          {booking.status === 'Pending' && (
                            <button 
                              onClick={() => updateBookingStatus(booking.id, 'Confirmed', 'Paid')}
                              className="bg-pink-pastel text-coklat-tua px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:brightness-105 transition-all"
                            >
                              Confirm
                            </button>
                          )}
                          {booking.status === 'Confirmed' && (
                            <button 
                              onClick={() => updateBookingStatus(booking.id, 'Completed')}
                              className="bg-lavender text-coklat-tua px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:brightness-105 transition-all"
                            >
                              Complete
                            </button>
                          )}
                            {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                              <button 
                                onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all border border-red-100"
                                title="Cancel Booking"
                              >
                                <X size={16} />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-8 py-12 text-center text-coklat-susu font-bold">No bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
