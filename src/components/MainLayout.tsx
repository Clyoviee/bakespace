import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Bell, Search, LayoutDashboard, BookOpen, ReceiptText, LogOut, Home, Calendar, User, UserSearch } from 'lucide-react';
import { motion } from 'motion/react';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  isAdmin?: boolean;
}

export default function MainLayout({ children, activeTab, isAdmin = false }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  if (isAdmin) {
    return (
      <div className="bg-[#FFF8F3] text-coklat-tua min-h-screen font-quicksand flex">
        {/* Admin Sidebar */}
        <aside className="w-[280px] h-screen sticky top-0 bg-white border-r border-cream py-10 px-6 flex flex-col">
          <div className="flex items-center gap-3 mb-12">
            <span className="text-2xl">🍰</span>
            <div>
              <h1 className="text-xl font-bold text-coklat-tua leading-none">BakeSpace</h1>
              <p className="text-sm font-bold text-coklat-susu">Admin</p>
            </div>
          </div>

          <nav className="space-y-2 flex-grow">
            {[
              { id: 'dashboard', label: 'Dashboard', path: '/admin' },
              { id: 'booking-data', label: 'Booking Data', path: '/admin/bookings' },
              { id: 'courses', label: 'Course Management', path: '/admin/courses' },
            ].map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.path 
                    ? 'bg-pink-pastel text-coklat-tua font-bold' 
                    : 'text-coklat-susu hover:bg-cream font-medium'
                }`}
              >
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          <button 
            onClick={() => navigate('/logout')}
            className="flex items-center gap-4 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl mt-auto transition-all"
          >
            <span className="text-sm">Logout</span>
          </button>
        </aside>

        <main className="flex-grow p-12 overflow-auto bg-dots">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F3] text-coklat-tua min-h-screen font-quicksand">
      {/* User Navbar */}
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 px-6 lg:px-20 h-20 flex justify-between items-center border-b border-[#FFF8F3] shadow-sm">
        <Link to="/home" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-pink-pastel rounded-xl flex items-center justify-center shadow-soft group-hover:rotate-12 transition-transform">
            <span className="text-xl">🍰</span>
          </div>
          <h1 className="text-2xl font-bold text-coklat-tua font-poppins">BakeSpace</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {[
            { label: 'Home', path: '/home' },
            { label: 'My Bookings', path: '/bookings' },
            { label: 'Notifications', path: '/notifications' },
            { label: 'Profile', path: '/profile' },
          ].map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`text-sm font-bold transition-all ${
                location.pathname === item.path ? 'text-pink-pastel' : 'text-coklat-susu hover:text-coklat-tua'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button 
            onClick={() => navigate('/logout')}
            className="bg-lavender text-coklat-tua px-6 py-2 rounded-full text-sm font-bold hover:brightness-105 transition-all ml-4"
          >
            Logout
          </button>
        </nav>

        {/* Mobile menu could be added here if needed, but keeping it simple for now as per screenshot */}
      </header>

      <main className="min-h-[calc(100vh-80px)] bg-dots">
        {children}
      </main>
    </div>
  );
}
