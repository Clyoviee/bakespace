import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithEmail, currentUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [successMessage] = useState(location.state?.message || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'admin' ? '/admin' : '/home');
    }
  }, [currentUser, navigate]);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      console.error("Login failed", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email atau password salah. Jika Anda belum mendaftar di lingkungan ini, silakan klik "Register here" di bawah.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan login. Silakan coba lagi nanti.');
      } else if (err.code === 'auth/operation-not-allowed') {
        if (err.message?.includes('region')) {
          setError('Wilayah SMS belum diaktifkan di Firebase Console. Buka Authentication > Settings > SMS Region Policy dan izinkan Indonesia (+62).');
        } else {
          setError('Fitur login ini belum diaktifkan di Firebase Console.');
        }
      } else {
        setError(`Login gagal: ${err.code || err.message || 'Unknown error'}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await login();
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-baker-fullscreen font-quicksand">
      <div className="login-wrapper">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 rounded-[40px] text-center shadow-hover border border-white/40 max-w-md w-full"
        >
          <h1 className="text-4xl font-bold text-coklat-tua mb-2 font-poppins">Welcome Back 🧁</h1>
          <p className="text-sm text-coklat-susu font-medium mb-8">Log in to continue your baking journey</p>
          
          <div className="space-y-6">
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 text-green-600 p-4 rounded-2xl text-xs font-bold border border-green-100"
              >
                {successMessage}
              </motion.div>
            )}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleManualLogin} className="space-y-4">
              <div className="text-left space-y-1">
                <label className="text-[10px] font-bold text-coklat-susu uppercase tracking-widest ml-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                  className="w-full px-6 py-4 bg-white border-2 border-[#FFF8F3] focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-medium transition-all shadow-sm"
                />
              </div>
              <div className="text-left space-y-1">
                <label className="text-[10px] font-bold text-coklat-susu uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
                    required
                    className="w-full px-6 py-4 bg-white border-2 border-[#FFF8F3] focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-medium transition-all shadow-sm pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-coklat-susu hover:text-coklat-tua transition-colors p-2"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-sm mt-2"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#FFF8F3]"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-coklat-susu uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-[#FFF8F3]"></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 bg-white border-2 border-[#FFF8F3] hover:bg-[#FFF8F3] text-coklat-tua py-4 rounded-2xl font-bold transition-all shadow-sm group"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>

          <p className="mt-8 text-sm text-coklat-susu font-medium">
            Don't have an account? 
            <Link to="/register" className="text-coklat-tua font-bold hover:underline ml-2">Register here</Link>
          </p>
        </motion.div>
        
        <p className="text-center mt-6 text-[10px] font-bold text-white/80 tracking-widest uppercase bg-black/10 backdrop-blur-sm py-2 px-4 rounded-full inline-block mx-auto">
          Premium Baking Community • Est. 2024
        </p>
      </div>
    </div>
  );
}
