import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useApp();

  useEffect(() => {
    logout();
    setTimeout(() => {
      navigate('/login');
    }, 800);
  }, [navigate, logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-pink-pastel border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-coklat-tua font-bold font-poppins">Keluar dari BakeSpace...</p>
      </div>
    </div>
  );
}
