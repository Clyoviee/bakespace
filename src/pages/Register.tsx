import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, registerWithEmail, currentUser, logout } = useApp();
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const registeringRef = React.useRef(false);

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password.length < 8) {
      setError('Password harus minimal 8 karakter');
      return;
    }

    if (!/\d/.test(password)) {
      setError('Password harus mengandung minimal satu angka');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak sesuai');
      return;
    }

    setLoading(true);
    registeringRef.current = true;
    try {
      await registerWithEmail(name, email, password); 
      setSuccess('Pendaftaran berhasil! Mengalihkan ke halaman login...');
      
      // Delay to show the success message on register page
      setTimeout(async () => {
        try {
          await logout();
          navigate('/login', { 
            state: { message: 'Pendaftaran berhasil! Silakan login dengan akun baru Anda.' },
            replace: true 
          });
        } catch (logoutErr) {
          console.error("Logout after registration failed", logoutErr);
          navigate('/login', { replace: true });
        }
      }, 2000);
      
      return;
    } catch (err: any) {
      registeringRef.current = false;
      console.error("Registration failed", err);
      const errorCode = err.code || (err.message && err.message.includes('code') ? JSON.parse(err.message).error : '');
      
      if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan gunakan email lain atau login.');
      } else if (err.code === 'auth/operation-not-allowed') {
        if (err.message?.includes('region')) {
          setError('Wilayah SMS belum diaktifkan di Firebase Console. Buka Authentication > Settings > SMS Region Policy dan izinkan Indonesia (+62).');
        } else {
          setError('Fitur pendaftaran ini belum diaktifkan di Firebase Console.');
        }
      } else if (err.code === 'auth/weak-password') {
        setError('Password terlalu lemah.');
      } else if (err.message?.includes('permission-denied')) {
        setError('Gagal menyimpan data profil ke database. Silakan periksa aturan keamanan Firestore.');
      } else {
        setError(`Pendaftaran gagal: ${err.code || err.message || 'Unknown error'}. Pastikan koneksi internet stabil.`);
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
          <h1 className="text-4xl font-bold text-coklat-tua mb-2 font-poppins">Join BakeSpace ✨</h1>
          <p className="text-sm text-coklat-susu font-medium mb-8">Create an account to start booking classes</p>

          <div className="space-y-6 relative">
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-green-500 text-white p-4 rounded-2xl text-sm font-bold shadow-lg border border-green-400 absolute inset-x-0 -top-16 z-50 flex items-center justify-center gap-2"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                {success}
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

            <form onSubmit={handleManualRegister} className="space-y-4">
              <div className="text-left space-y-1">
                <label className="text-[10px] font-bold text-coklat-susu uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name" 
                  required
                  className="w-full px-6 py-4 bg-white border-2 border-[#FFF8F3] focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-medium transition-all shadow-sm"
                />
              </div>
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
              <div className="text-left space-y-1">
                <label className="text-[10px] font-bold text-coklat-susu uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password" 
                    required
                    className="w-full px-6 py-4 bg-white border-2 border-[#FFF8F3] focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-medium transition-all shadow-sm pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-coklat-susu hover:text-coklat-tua transition-colors p-2"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-sm mt-2"
              >
                {loading ? 'Creating Account...' : 'Register'}
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
              {loading ? 'Joining...' : 'Continue with Google'}
            </button>
          </div>
          
          <p className="mt-8 text-sm text-coklat-susu font-medium">
            Already have an account? 
            <Link to="/login" className="text-coklat-tua font-bold hover:underline ml-2">Login here</Link>
          </p>
        </motion.div>
        
        <p className="text-center mt-6 text-[10px] font-bold text-white/80 tracking-widest uppercase bg-black/10 backdrop-blur-sm py-2 px-4 rounded-full inline-block mx-auto">
          Premium Baking Community • Est. 2024
        </p>
      </div>
    </div>
  );
}
