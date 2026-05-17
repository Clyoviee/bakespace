import React from 'react';
import { Users, Calendar, BookOpen, TrendingUp, ChevronLeft, ChevronRight, Cake, CakeSlice, Cookie, Coffee, Star } from 'lucide-react';
import { motion } from 'motion/react';
import MainLayout from '../components/MainLayout';

import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const { bookings, courses, users } = useApp();

  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'Paid' || b.status === 'Confirmed' || b.status === 'Completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const regularUsersCount = users.filter(u => u.role === 'user').length;

  const stats = [
    { label: 'Total Users', value: regularUsersCount.toString(), change: '+12%', color: 'bg-white' },
    { label: 'Total Bookings', value: bookings.length.toString(), change: '+18%', color: 'bg-white' },
    { label: 'Total Courses', value: courses.length.toString(), change: '+5%', color: 'bg-white' },
    { label: 'Revenue', value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, change: '+25%', color: 'bg-white', valueColor: 'text-[#FF7EB3]' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-lavender text-coklat-tua';
      case 'Confirmed': return 'bg-[#C9F9E1] text-[#2D8A5B]';
      case 'Pending': return 'bg-[#FFF2B2] text-[#8A6D2D]';
      case 'Cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const recentBookings = bookings.slice(0, 5);

  return (
    <MainLayout isAdmin activeTab="dashboard">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-coklat-tua mb-2 font-poppins">Overview Dashboard 📊</h2>
          <p className="text-coklat-susu font-medium">Welcome back, Admin Baker!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[40px] shadow-card border border-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-pastel/10 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150"></div>
              <div className="text-xs font-bold text-coklat-susu mb-4 uppercase tracking-widest font-poppins">{stat.label}</div>
              <div className={`text-3xl font-bold font-poppins mb-2 ${stat.valueColor || 'text-coklat-tua'}`}>{stat.value}</div>
              <div className="text-[10px] font-bold text-green-500">{stat.change} <span className="text-coklat-susu/60 text-[8px] uppercase">vs last month</span></div>
            </motion.div>
          ))}
        </div>

        {/* Recent Bookings Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[40px] shadow-card overflow-hidden border border-white"
        >
          <div className="p-10 border-b border-[#FFF8F3] flex justify-between items-center">
            <h3 className="text-xl font-bold text-coklat-tua font-poppins">Recent Bookings</h3>
            <button 
              onClick={() => window.location.href='/admin/bookings'}
              className="text-xs font-bold text-pink-pastel hover:underline"
            >
              View All Bookings
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF8F3]">
                  <th className="px-10 py-6 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">ID</th>
                  <th className="px-10 py-6 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Customer</th>
                  <th className="px-10 py-6 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Course</th>
                  <th className="px-10 py-6 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Date</th>
                  <th className="px-10 py-6 text-xs font-bold text-coklat-susu uppercase tracking-widest font-poppins">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFF8F3]">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-[#FFF8F3]/30 transition-colors">
                      <td className="px-10 py-8 text-sm font-bold text-[#FFB7D5] font-poppins">{booking.id}</td>
                      <td className="px-10 py-8 text-sm font-bold text-coklat-tua">{booking.userName}</td>
                      <td className="px-10 py-8 text-sm font-medium text-coklat-tua">{booking.courseTitle}</td>
                      <td className="px-10 py-8 text-sm text-coklat-susu font-bold">{booking.date}</td>
                      <td className="px-10 py-8">
                        <span className={`inline-flex items-center px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-10 py-12 text-center text-coklat-susu font-bold">No bookings yet.</td>
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
