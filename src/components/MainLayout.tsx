import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Bell, Search, LayoutDashboard, BookOpen, ReceiptText, LogOut, Home, Calendar, User, UserSearch, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  isAdmin?: boolean;
}

export default function MainLayout({ children, activeTab, isAdmin = false }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { id: 'booking-data', label: 'Booking Data', path: '/admin/bookings', icon: <ReceiptText size={20} /> },
    { id: 'courses', label: 'Course Management', path: '/admin/courses', icon: <BookOpen size={20} /> },
  ];

  const userMenuItems = [
    { label: 'Home', path: '/home', icon: <Home size={20} /> },
    { label: 'Orders', path: '/bookings', icon: <ReceiptText size={20} /> },
    { label: 'Alerts', path: '/notifications', icon: <Bell size={20} /> },
    { label: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  if (isAdmin) {
    return (
      <div className="bg-[#FFF8F3] text-coklat-tua min-h-screen font-quicksand flex flex-col md:flex-row">
        {/* Admin Mobile Header */}
        <header className="md:hidden bg-white border-b border-cream px-6 h-16 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍰</span>
            <span className="font-bold text-coklat-tua text-lg">Admin View</span>
          </div>
          <button 
            onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
            className="p-2 text-coklat-susu hover:bg-cream rounded-lg transition-colors"
          >
            {isAdminMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Admin Sidebar (Desktop & Mobile) */}
        <AnimatePresence>
          {(isAdminMenuOpen || true) && (
            <aside 
              className={`
                fixed md:sticky top-0 left-0 z-40
                w-[280px] h-screen bg-white border-r border-cream py-6 md:py-10 px-6 
                flex flex-col transition-transform duration-300
                ${isAdminMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
              `}
            >
              <div className="hidden md:flex items-center gap-3 mb-12">
                <span className="text-2xl">🍰</span>
                <div>
                  <h1 className="text-xl font-bold text-coklat-tua leading-none">BakeSpace</h1>
                  <p className="text-sm font-bold text-coklat-susu">Admin</p>
                </div>
              </div>

              <div className="md:hidden flex items-center gap-3 mb-6 pb-6 border-b border-cream">
                <span className="text-2xl font-bold text-coklat-tua">BakeSpace</span>
              </div>

              <nav className="space-y-1.5 flex-grow">
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsAdminMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                      location.pathname === item.path 
                        ? 'bg-pink-pastel text-coklat-tua font-bold shadow-soft' 
                        : 'text-coklat-susu hover:bg-cream font-medium'
                    }`}
                  >
                    <span className="text-coklat-tua opacity-60">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button 
                onClick={() => {
                  setIsAdminMenuOpen(false);
                  navigate('/logout');
                }}
                className="flex items-center gap-4 px-4 py-3.5 text-red-500 font-bold hover:bg-red-50 rounded-xl mt-auto transition-all"
              >
                <LogOut size={20} />
                <span className="text-sm">Logout</span>
              </button>
            </aside>
          )}
        </AnimatePresence>

        {/* Overlay for Mobile Admin Sidebar */}
        <AnimatePresence>
          {isAdminMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminMenuOpen(false)}
              className="fixed inset-0 bg-coklat-tua/20 backdrop-blur-sm z-30 md:hidden"
            />
          )}
        </AnimatePresence>

        <main className="flex-grow p-6 md:p-12 overflow-auto bg-dots">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F3] text-coklat-tua min-h-screen font-quicksand pb-20 md:pb-0">
      {/* User Navbar */}
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 px-6 lg:px-20 h-16 md:h-20 flex justify-between items-center border-b border-[#FFF8F3] shadow-sm">
        <Link to="/home" className="flex items-center gap-2 md:gap-3 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-pink-pastel rounded-lg md:rounded-xl flex items-center justify-center shadow-soft group-hover:rotate-12 transition-transform">
            <span className="text-lg md:text-xl">🍰</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-coklat-tua font-poppins">BakeSpace</h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {userMenuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`text-sm font-bold transition-all relative py-1 ${
                location.pathname === item.path ? 'text-pink-pastel' : 'text-coklat-susu hover:text-coklat-tua'
              }`}
            >
              {item.label}
              {location.pathname === item.path && (
                <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-pastel rounded-full" />
              )}
            </Link>
          ))}
          <button 
            onClick={() => navigate('/logout')}
            className="bg-cream text-coklat-tua px-6 py-2 rounded-full text-sm font-bold border-2 border-pink-pastel hover:bg-pink-pastel transition-all ml-4"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Header Logout */}
        <button 
          onClick={() => navigate('/logout')}
          className="md:hidden p-2 text-coklat-susu hover:bg-cream rounded-lg"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* User Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-cream flex justify-around items-center px-4 h-16 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        {userMenuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center gap-1 min-w-[64px] transition-all ${
              location.pathname === item.path ? 'text-pink-pastel' : 'text-coklat-susu opacity-60'
            }`}
          >
            <div className={`p-1 rounded-lg transition-all ${location.pathname === item.path ? 'bg-pink-pastel/20' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </Link>
        ))}
      </nav>

      <main className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] bg-dots">
        {children}
      </main>
    </div>
  );
}
