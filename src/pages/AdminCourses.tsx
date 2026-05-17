import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Filter, Edit, Trash2, X, Calendar, Users, TrendingUp } from 'lucide-react';
import MainLayout from '../components/MainLayout';

import { useApp } from '../context/AppContext';
import { Course, CourseLevel } from '../types';

export default function AdminCourses() {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');

  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (course: Course | null = null) => {
    setCurrentCourse(course);
    setImageUrl(course?.image || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCourse(null);
    setImageUrl('');
  };

  const openDeleteModal = (id: string) => {
    setCourseToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const handleDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete);
      closeDeleteModal();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const harga = Number(formData.get('harga'));
    
    const newSlots = Number(formData.get('slots'));
    const newAvailable = Number(formData.get('availableSlots'));

    const courseData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: harga,
      priceFormatted: `Rp ${harga.toLocaleString('id-ID')}`,
      schedule: formData.get('schedule') as string,
      slots: newSlots,
      availableSlots: newAvailable,
      level: formData.get('level') as CourseLevel,
      image: imageUrl || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    };

    if (currentCourse) {
      updateCourse(currentCourse.id, courseData);
    } else {
      addCourse(courseData);
    }
    closeModal();
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'All' || course.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <MainLayout isAdmin activeTab="courses">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-coklat-tua font-poppins mb-2">Course Management 🧁</h2>
            <p className="text-coklat-susu font-medium">Add, edit, or remove baking classes from the catalogue.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-pink-pastel text-coklat-tua px-10 py-5 rounded-full font-bold shadow-card hover:brightness-105 transition-all flex items-center gap-3"
          >
            <Plus size={20} />
            <span className="text-sm">Add New Class</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[40px] shadow-card border border-white mb-12 flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-coklat-susu" size={20} />
            <input 
              type="text" 
              placeholder="Search by class name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-[#FFF8F3] focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-medium transition-all shadow-inner"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <select 
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-8 py-5 bg-white border-2 border-[#FFF8F3] focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-bold text-coklat-tua appearance-none cursor-pointer min-w-[180px] shadow-sm"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredCourses.map((course) => (
              <motion.div 
                layout
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] overflow-hidden shadow-card border border-white relative group flex flex-col h-full"
              >
                {/* Level Badge */}
                <div className="absolute top-5 right-5 z-10">
                  <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-bold text-coklat-tua uppercase tracking-widest shadow-sm">
                    {course.level}
                  </span>
                </div>

                <div className="h-56 overflow-hidden relative">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-coklat-tua mb-3 font-poppins leading-tight h-14 line-clamp-2">{course.title}</h3>
                  <div className="flex items-center gap-2 text-coklat-susu text-sm font-bold mb-8">
                    <Calendar size={14} />
                    <span>{new Date(course.schedule).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>

                  <div className="flex justify-between items-center mb-8 border-t border-[#FFF8F3] pt-8">
                    <span className="text-[#FFB7D5] text-xl font-bold font-poppins">
                      {course.priceFormatted}
                    </span>
                    <div className="flex items-center gap-2 text-coklat-susu text-[10px] font-bold bg-[#FFF8F3] px-3 py-1.5 rounded-full uppercase tracking-wider">
                      <Users size={12} className="text-pink-pastel" />
                      <span>{course.availableSlots ?? course.slots} / {course.slots} Left</span>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-auto">
                    <button 
                      onClick={() => openModal(course)}
                      className="flex-1 bg-lavender/50 text-coklat-tua py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-lavender transition-all flex items-center justify-center gap-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal(course.id)}
                      className="flex-1 bg-red-50 text-red-500 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[40px] text-center shadow-soft border border-white">
            <h3 className="text-xl font-bold text-coklat-tua mb-2 font-poppins">No courses found 🍰</h3>
            <p className="text-coklat-susu font-medium">Try adding a new class to your catalog.</p>
          </div>
        )}

        {/* Modal App/Edit */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="absolute inset-0 bg-coklat-tua/20 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-lg rounded-[40px] shadow-hover border border-white relative z-10 max-h-[90vh] overflow-y-auto"
              >
                <div className="p-10">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-coklat-tua font-poppins">{currentCourse ? 'Edit Class' : 'Add New Class'}</h3>
                    <button onClick={closeModal} className="p-2 hover:bg-cream rounded-full transition-colors">
                      <X size={24} className="text-coklat-susu" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-coklat-susu uppercase tracking-widest ml-1">Course Image</label>
                        <div className="relative group/upload">
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="course-image-upload"
                          />
                          <label 
                            htmlFor="course-image-upload"
                            className="w-full flex flex-col items-center justify-center gap-3 px-6 py-10 bg-cream/20 border-2 border-dashed border-cream/50 rounded-3xl cursor-pointer hover:bg-cream/30 hover:border-pink-pastel/30 transition-all text-center"
                          >
                            {isUploading ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-pastel border-t-transparent" />
                            ) : (
                              <>
                                <TrendingUp className="text-pink-pastel" size={32} />
                                <div>
                                  <p className="text-sm font-bold text-coklat-tua">Click to upload image</p>
                                  <p className="text-[10px] font-medium text-coklat-susu uppercase tracking-widest mt-1">SVG, PNG, JPG or GIF</p>
                                </div>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                      
                      {imageUrl && (
                        <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-cream/50 bg-cream/10">
                          <img 
                            src={imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          <span className="absolute bottom-4 left-6 text-white text-[10px] font-bold uppercase tracking-widest">Image Preview</span>
                          <button 
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-red-500 transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-coklat-susu uppercase tracking-widest ml-1">Course Name</label>
                      <input 
                        required
                        name="title"
                        defaultValue={currentCourse?.title}
                        placeholder="e.g. Premium Tart Design"
                        className="w-full px-6 py-4 bg-cream/30 border-2 border-transparent focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-medium transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-coklat-susu uppercase tracking-widest ml-1">Description</label>
                      <textarea 
                        required
                        name="description"
                        defaultValue={currentCourse?.description}
                        rows={3}
                        placeholder="Describe the course..."
                        className="w-full px-6 py-4 bg-cream/30 border-2 border-transparent focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-medium transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-coklat-susu uppercase tracking-widest ml-1">Price (Rp)</label>
                      <input 
                        required
                        type="number"
                        name="harga"
                        defaultValue={currentCourse?.price}
                        className="w-full px-6 py-4 bg-cream/30 border-2 border-transparent focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-medium transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-coklat-susu uppercase tracking-widest ml-1">Total Slots</label>
                        <input 
                          required
                          type="number"
                          name="slots"
                          defaultValue={currentCourse?.slots || 10}
                          className="w-full px-6 py-4 bg-cream/30 border-2 border-transparent focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-medium transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-coklat-susu uppercase tracking-widest ml-1">Available Slots</label>
                        <input 
                          required
                          type="number"
                          name="availableSlots"
                          defaultValue={currentCourse?.availableSlots ?? currentCourse?.slots ?? 10}
                          className="w-full px-6 py-4 bg-cream/30 border-2 border-transparent focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-medium transition-all"
                        />
                        <p className="text-[10px] text-coklat-susu px-1">Sisa slot saat ini</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-coklat-susu uppercase tracking-widest ml-1">Schedule</label>
                        <input 
                          required
                          type="datetime-local"
                          name="schedule"
                          defaultValue={currentCourse?.schedule ? new Date(currentCourse.schedule).toISOString().slice(0, 16) : ''}
                          className="w-full px-6 py-4 bg-cream/30 border-2 border-transparent focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-medium transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-coklat-susu uppercase tracking-widest ml-1">Level</label>
                        <select 
                          required
                          name="level"
                          defaultValue={currentCourse?.level || 'Beginner'}
                          className="w-full px-6 py-4 bg-cream/30 border-2 border-transparent focus:border-pink-pastel/50 rounded-2xl outline-none text-sm font-bold text-coklat-tua appearance-none cursor-pointer"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        type="button"
                        onClick={closeModal}
                        className="flex-1 py-4 px-6 rounded-2xl bg-cream/30 text-coklat-tua font-bold text-xs uppercase tracking-widest hover:bg-cream/50 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-[1.5] py-4 px-6 rounded-2xl bg-pink-pastel text-coklat-tua font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-soft shadow-pink-pastel/20"
                      >
                        {currentCourse ? 'Update Class' : 'Save Class'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeDeleteModal}
                className="absolute inset-0 bg-coklat-tua/20 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-sm rounded-[40px] shadow-hover border border-white overflow-hidden relative z-10 text-center p-10"
              >
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-pink-50 rounded-full text-[#d32f2f]">
                  <Trash2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-coklat-tua font-poppins mb-2">Delete Course?</h3>
                <p className="text-coklat-susu text-sm font-medium mb-8 leading-relaxed">
                  Are you sure you want to delete this course? This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={closeDeleteModal}
                    className="flex-1 py-4 px-6 rounded-2xl bg-cream/30 text-coklat-tua font-bold text-xs uppercase tracking-widest hover:bg-cream/50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="flex-1 py-4 px-6 rounded-2xl bg-pink-50 text-[#d32f2f] font-bold text-xs uppercase tracking-widest hover:bg-pink-100 transition-all"
                  >
                    Yes, Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
