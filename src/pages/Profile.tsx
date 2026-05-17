import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import MainLayout from '../components/MainLayout';

import { useApp } from '../context/AppContext';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useApp();
  const [success, setSuccess] = React.useState(false);
  
  const [name, setName] = React.useState(currentUser?.name || '');
  const [email, setEmail] = React.useState(currentUser?.email || '');

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, email);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (!currentUser) return null;

  return (
    <MainLayout activeTab="profile">
      <div className="max-w-[600px] mx-auto px-6 py-12 min-h-[80vh] flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 rounded-[40px] text-center shadow-hover border border-white/40"
        >
          {/* Profile Avatar */}
          <div className="relative inline-block mb-6">
            <img 
              src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}&background=FFD6E0&color=8B6F5A&size=120`}
              alt="Avatar" 
              className="w-32 h-32 rounded-full border-4 border-white shadow-soft mx-auto object-cover"
            />
          </div>
          
          <h2 className="text-3xl font-bold text-coklat-tua mb-2 font-poppins">{currentUser.name}</h2>
          <div className="flex flex-col items-center gap-1 mb-8">
            <p className="text-sm text-coklat-susu font-medium">{currentUser.email}</p>
          </div>

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#C9F9E1] p-4 rounded-2xl text-[#2D8A5B] text-sm font-bold mb-8"
            >
              Profile updated successfully!
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 text-left">
            <div className="space-y-2">
              <label className="text-xs font-bold text-coklat-susu uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="w-full px-8 py-5 bg-white border-2 border-[#FFF8F3] focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-medium transition-all shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-coklat-susu uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full px-8 py-5 bg-white border-2 border-[#FFF8F3] focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-medium transition-all shadow-inner"
              />
            </div>
            <button 
              type="submit" 
              className="w-full h-16 rounded-2xl bg-pink-pastel text-coklat-tua font-bold text-sm uppercase tracking-widest shadow-card hover:brightness-105 transition-all"
            >
              Save Changes
            </button>
          </form>
          
          <div className="mt-10 pt-10 border-t border-[#FFF8F3]">
            <button 
              onClick={handleLogout}
              className="w-full py-5 rounded-2xl bg-red-50 text-red-500 font-bold text-xs tracking-widest uppercase hover:bg-red-100 transition-colors"
            >
              Log Out
            </button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
