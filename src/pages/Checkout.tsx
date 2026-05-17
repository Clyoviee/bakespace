import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import MainLayout from '../components/MainLayout';

import { useApp } from '../context/AppContext';
import { Course } from '../types';
import { useEffect } from 'react';

export default function Checkout() {
  const navigate = useNavigate();
  const { addBooking, currentUser } = useApp();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [participants, setParticipants] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('OVO');
  const [error, setError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('selected_course');
    if (saved) {
      setSelectedCourse(JSON.parse(saved));
    } else {
      navigate('/home');
    }
  }, [navigate]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse && participants > (selectedCourse.availableSlots ?? selectedCourse.slots)) {
      setError(`Sorry, only ${selectedCourse.availableSlots ?? selectedCourse.slots} slots are available.`);
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !currentUser) return;

    setIsBooking(true);
    setError(null);
    try {
      await addBooking({
        userId: currentUser.id,
        userName: currentUser.name,
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        courseImage: selectedCourse.image,
        date: new Date(selectedCourse.schedule).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        totalPrice: selectedCourse.price * participants,
        totalPriceFormatted: `Rp ${(selectedCourse.price * participants).toLocaleString('id-ID')}`,
        status: 'Pending',
        paymentStatus: 'Checking',
        paymentMethod,
        participants
      });

      setIsSuccess(true);
      sessionStorage.removeItem('selected_course');
    } catch (err: any) {
      console.error(err);
      setError('Gagal membuat pesanan. Mungkin sisa slot sudah habis.');
      setStep(1);
    } finally {
      setIsBooking(false);
    }
  };

  if (!selectedCourse) return null;

  if (isSuccess) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-6 py-20 flex justify-center items-center min-h-[70vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 rounded-[40px] text-center max-w-md w-full"
          >
            <h2 className="text-3xl font-bold text-coklat-tua mb-4 font-poppins">Success! 🍰</h2>
            <p className="text-sm text-coklat-susu font-medium mb-8">Booking received! Admin is checking your payment.</p>
            
            <div className="bg-[#d1f2e1] p-6 rounded-3xl text-[#288c57] font-medium leading-relaxed mb-6">
              Confirmed for {selectedCourse.title}
              <br />
              <Link to="/bookings" className="underline font-bold mt-2 block">Go to Booking History</Link>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  const totalPrice = selectedCourse.price * participants;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-20">
        {step === 1 ? (
          <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
            {/* Form Part */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="glass-card p-10 rounded-[40px] w-full lg:w-[600px] shadow-card border border-white"
            >
              <h2 className="text-3xl font-bold text-coklat-tua mb-10 font-poppins">Book Your Class 🎀</h2>
              
              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold mb-6 border border-red-100 flex items-center justify-center">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleNext} className="space-y-8">
                <div className="input-group">
                  <label>Course Name</label>
                  <input
                type="text"
                value={selectedCourse.title}
                disabled
                className="bg-gray-100/50"
              />
                </div>
                <div className="input-group">
                  <label>Date & Time</label>
                  <input
                  type="text"
                  value={selectedCourse.schedule}
                  disabled
                  className="bg-gray-100/50"
                />
                </div>
                <div className="input-group">
                  <label>Number of Participants</label>
                  <input
                  type="number"
                  value={participants}
                  min={1}
                  onChange={(e) => setParticipants(Number(e.target.value))}
                />
                </div>
                
                <button type="submit" className="btn-primary w-full py-5 text-lg">
                  Proceed to Payment
                </button>
              </form>
            </motion.div>

            {/* Summary Part */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-[#FFD6E0]/50 backdrop-blur-sm p-10 rounded-[40px] w-full lg:w-[400px] border border-[#FFD6E0]"
            >
              <h3 className="text-2xl font-bold text-coklat-tua mb-8 font-poppins">Booking Summary</h3>
              <div className="rounded-3xl overflow-hidden mb-8 h-48">
                <img
                className="w-full h-full object-cover"
                src={selectedCourse.image}
                alt={selectedCourse.title}
              />
              </div>
              
              <div className="space-y-4 font-medium text-coklat-tua">
                <div className="flex justify-between">
                  <span className="text-coklat-susu">Price per person</span>
                 <span>
                  Rp {selectedCourse.price.toLocaleString('id-ID')}
                </span>
                </div>
                <div className="flex justify-between pb-4 border-b border-coklat-susu/20 border-dashed">
                  <span className="text-coklat-susu">Available Slots</span>
                  <span>{selectedCourse.availableSlots ?? selectedCourse.slots}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-coklat-susu/20 border-dashed">
                  <span className="text-coklat-susu">Participants</span>
                  <span>{participants}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4">
                  <span>Total</span>
                  <span>
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 rounded-[40px] text-center w-full max-w-2xl shadow-card"
            >
              <h2 className="text-4xl font-bold text-coklat-tua mb-4 font-poppins">Payment Details 💳</h2>
              <p className="text-lg text-coklat-susu font-medium mb-12">Complete your payment to secure your spot</p>

              <div className="bg-white p-12 rounded-[40px] shadow-inner mb-12 border border-cream">
                <p className="text-lg font-bold text-coklat-susu mb-4">Total Amount</p>
                <div className="text-6xl font-bold text-[#FFD6E0] font-poppins tracking-tight">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </div>
              </div>

              <form onSubmit={handleConfirm} className="space-y-8 text-left">
                <div className="input-group">
                  <label>Payment Method</label>
                  <select
                    required
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="bg-white border-2 border-pink-pastel/30"
                  >
                    <option value="OVO">OVO</option>
                    <option value="Gopay">Gopay</option>
                    <option value="ShopeePay">ShopeePay</option>
                    <option value="QRIS">QRIS</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Upload Payment Proof (Dummy)</label>
                  <div className="w-full px-5 py-8 bg-white border-2 border-pink-pastel/30 rounded-2xl flex flex-col items-center justify-center text-center">
                    <input type="file" className="text-sm text-coklat-susu file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink- pastel file:text-coklat-tua hover:file:bg-pink-pastel/80" />
                  </div>
                  <p className="text-xs text-coklat-susu text-center mt-2 font-medium opacity-60">*For demo purposes, any upload will be mocked</p>
                </div>

                <button 
                  type="submit" 
                  disabled={isBooking}
                  className="bg-[#E9D7FF] text-coklat-tua w-full py-5 rounded-full text-xl font-bold hover:brightness-105 transition-all shadow-md mt-4 flex items-center justify-center"
                >
                  {isBooking ? (
                    <div className="w-6 h-6 border-4 border-coklat-tua border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Confirm Payment'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

