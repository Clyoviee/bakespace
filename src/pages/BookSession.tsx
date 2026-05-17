import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mail, Calendar, BookOpen, Users, ArrowRight, Minus, Plus, CheckCircle, Clock, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import MainLayout from '../components/MainLayout';

export default function BookSession() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [participants, setParticipants] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/checkout');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <section className="mb-16 text-center lg:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-coklat-tua mb-4 font-poppins"
          >
            Pesan Kelas Anda 🎀
          </motion.h2>
          <p className="text-lg font-medium text-coklat-susu max-w-2xl">
            Ikuti kelas baking estetis kami. Dari bento cake Korea yang lucu hingga soft cookies yang lezat, temukan jiwa koki pastri dalam diri Anda di ruang kami yang nyaman.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 rounded-[40px] shadow-soft border border-white"
          >
            <h3 className="text-2xl font-bold text-coklat-tua mb-8 font-poppins">Pesan Kelas Anda 🎀</h3>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Nama Kursus</label>
                <input 
                  type="text" 
                  value="Minimalist Strawberry Shortcake" 
                  readOnly 
                  className="bg-cream/50 cursor-not-allowed"
                />
              </div>
              
              <div className="input-group">
                <label>Tanggal & Waktu</label>
                <input 
                  type="text" 
                  value="24 Oktober 2023, 10:00 WIB" 
                  readOnly 
                  className="bg-cream/50 cursor-not-allowed"
                />
              </div>
              
              <div className="input-group">
                <label>Jumlah Peserta</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    value={participants}
                    onChange={(e) => setParticipants(parseInt(e.target.value) || 1)}
                    min="1" 
                    max="10" 
                    required 
                  />
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setParticipants(Math.max(1, participants - 1))}
                      className="w-10 h-10 rounded-xl bg-lavender flex items-center justify-center text-coklat-tua hover:bg-pink-pastel transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setParticipants(Math.min(10, participants + 1))}
                      className="w-10 h-10 rounded-xl bg-lavender flex items-center justify-center text-coklat-tua hover:bg-pink-pastel transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <button 
                className="btn-primary w-full h-16 text-lg mt-4" 
                type="submit"
              >
                Lanjut ke Pembayaran
              </button>
            </form>
          </motion.div>

          {/* Summary Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-pink-pastel p-10 rounded-[40px] text-coklat-tua shadow-soft relative overflow-hidden h-full"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8 font-poppins">Ringkasan Pesanan</h3>
              
              <div className="w-full h-48 rounded-3xl overflow-hidden mb-8 shadow-sm">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwa-44lbyxFfuqigZbxfX5bSmLu3rW910fSS332kN7nBr4T1zBDBX8VQA3qxSY8sxauLw5MMNe653INkrMwUCENQtKlBC0k0emkx3KK10295ZZg2n9tObxEV-xG31-CcvUDcIh39nJWtOr1z9eHVOgZXVMPAc2I67BAXh02I2TB4AXCYe0UqjVlQ3Mzqy2UhwOp4Vbn-SCk878x9ybyIkskqd-oeIIc2clGMZyTDMxF_i2EFR9hO1Ij4vVPkBGfAewMqkwqrYBQN8" 
                  alt="Minimalist Strawberry Shortcake" 
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center font-bold">
                  <span>Harga per orang</span>
                  <span>Rp 185.000</span>
                </div>
                
                <div className="flex justify-between items-center font-bold">
                  <span>Peserta</span>
                  <span>{participants}</span>
                </div>

                <hr className="border-none border-t border-dashed border-coklat-tua/30 my-6" />
                
                <div className="flex justify-between items-center text-3xl font-bold">
                  <span className="font-poppins">Total</span>
                  <span className="font-poppins">Rp {(185000 * participants).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
