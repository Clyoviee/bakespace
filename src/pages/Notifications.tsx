import React from 'react';
import { motion } from 'motion/react';
import MainLayout from '../components/MainLayout';

import { useApp } from '../context/AppContext';

export default function Notifications() {
  const { notifications, currentUser } = useApp();
  
  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);

  const getIconBg = (type: string) => {
    switch (type) {
      case 'success': return 'bg-[#C9F9E1]';
      case 'payment': return 'bg-lavender';
      case 'reminder': return 'bg-[#FFF2B2]';
      default: return 'bg-peach';
    }
  };

  return (
    <MainLayout activeTab="notifications">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-coklat-tua mb-12 font-poppins">Notifications 🔔</h2>
        
        {userNotifications.length > 0 ? (
          <div className="space-y-8">
            {userNotifications.map((noti, idx) => (
              <motion.div 
                key={noti.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/60 backdrop-blur-md p-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-8 border border-white shadow-soft rounded-[40px] group hover:shadow-hover transition-all"
              >
                <div className={`w-20 h-20 shrink-0 rounded-full ${getIconBg(noti.type)} flex items-center justify-center text-3xl shadow-sm border-4 border-white transition-transform group-hover:scale-110`}>
                  {noti.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <h4 className="text-xl font-bold text-coklat-tua font-poppins">{noti.title}</h4>
                    <span className="text-[10px] text-coklat-susu font-bold uppercase tracking-widest">{noti.time}</span>
                  </div>
                  <p className="text-coklat-susu font-medium leading-relaxed font-poppins text-sm">{noti.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/40 rounded-[40px] border border-white border-dashed">
            <p className="text-xl font-bold text-coklat-susu">No new notifications.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
