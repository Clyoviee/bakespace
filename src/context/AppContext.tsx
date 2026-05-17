import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Course, Booking, Notification } from '../types';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  getDoc,
  addDoc,
  getDocFromServer,
  runTransaction
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AppContextType {
  currentUser: User | null;
  courses: Course[];
  bookings: Booking[];
  notifications: Notification[];
  users: User[];
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status'], p_status?: Booking['paymentStatus']) => Promise<void>;
  addNotification: (userId: string, noti: Omit<Notification, 'id' | 'userId' | 'time'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [initialLoading, setInitialLoading] = useState(true);

  // Connection test
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Sync Courses
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'courses'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Course));
      setCourses(data);
      
    // Auto-seed if empty (Admin only)
      if (data.length === 0 && currentUser?.role === 'admin') {
        const initialCourses = [
          {
            title: 'Classic Pufflova',
            description: 'Advanced baking class focused on crispy puff pastry, smooth cream filling, and elegant toppings.',
            price: 290000,
            priceFormatted: 'Rp 290.000',
            schedule: '2026-05-31T10:00:00',
            level: 'Advanced',
            slots: 10,
            availableSlots: 10,
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80'
          },
          {
            title: 'Korean Bento Cake',
            description: 'Learn how to make aesthetic mini bento cakes with cute decorations.',
            price: 180000,
            priceFormatted: 'Rp 180.000',
            schedule: '2026-06-10T10:00:00',
            level: 'Beginner',
            slots: 10,
            availableSlots: 10,
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'
          },
          {
            title: 'Dessert Box Class',
            description: 'Make a delicious and creamy dessert box from scratch.',
            price: 150000,
            priceFormatted: 'Rp 150.000',
            schedule: '2026-06-15T13:00:00',
            level: 'Beginner',
            slots: 15,
            availableSlots: 15,
            image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80'
          }
        ];
        initialCourses.forEach(c => {
          addDoc(collection(db, 'courses'), c).then(docRef => {
             updateDoc(docRef, { id: docRef.id });
          });
        });
      }
    }, (error) => {
      // Don't throw for courses if it's just a cold start or permission snag
      console.warn('Courses sync snag:', error);
    });
    return () => unsub();
  }, [currentUser]);

  // Sync User Data (Current User, Bookings, Notifications)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setCurrentUser(userSnap.data() as User);
          } else {
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: firebaseUser.email?.includes('admin') ? 'admin' : 'user',
              avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName}&background=FFD6E0&color=8B6F5A&size=150`
            };
            await setDoc(userRef, newUser);
            setCurrentUser(newUser);
          }
        } catch (error) {
          console.error("Error fetching user profile", error);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
      setInitialLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // We only start listeners if we have both states confirmed
    if (!currentUser || !auth.currentUser || loading) {
      if (!loading && !currentUser) {
        setBookings([]);
        setNotifications([]);
      }
      return;
    }

    const uid = auth.currentUser.uid;
    console.log('Starting sync for UID:', uid);

    const bookingsQuery = currentUser.role === 'admin' 
      ? query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'bookings'), where('userId', '==', uid), orderBy('createdAt', 'desc'));

    const unsubBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Booking));
      setBookings(data);
    }, (error) => {
      // Only handle if auth is still active
      if (auth.currentUser) {
        handleFirestoreError(error, OperationType.GET, 'bookings');
      }
    });

    const notificationsQuery = query(
      collection(db, 'notifications'), 
      where('userId', '==', uid), 
      orderBy('time', 'desc')
    );

    const unsubNotifs = onSnapshot(notificationsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Notification));
      setNotifications(data);
    }, (error) => {
      if (auth.currentUser) {
        handleFirestoreError(error, OperationType.GET, 'notifications');
      }
    });

    let unsubUsers = () => {};
    if (currentUser.role === 'admin') {
      unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
        setUsers(data);
      }, (error) => {
        if (auth.currentUser) {
          handleFirestoreError(error, OperationType.GET, 'users');
        }
      });
    }

    return () => {
      unsubBookings();
      unsubNotifs();
      unsubUsers();
    };
  }, [currentUser, loading]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bake_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bake_user');
    }
  }, [currentUser]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      const userId = firebaseUser.uid;
      const userRef = doc(db, 'users', userId);
      
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const newUser: User = {
          id: userId,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          role: firebaseUser.email?.includes('admin') ? 'admin' : 'user',
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName}&background=FFD6E0&color=8B6F5A&size=150`
        };
        await setDoc(userRef, newUser);
        setCurrentUser(newUser);
      } else {
        setCurrentUser(userSnap.data() as User);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setCurrentUser(userSnap.data() as User);
      }
    } catch (error: any) {
      if (error.code?.startsWith('auth/')) {
        throw error;
      }
      handleFirestoreError(error, OperationType.GET, 'users');
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      await updateFirebaseProfile(result.user, { displayName: name });
      
      const userId = result.user.uid;
      const newUser: User = {
        id: userId,
        name,
        email,
        role: email.includes('admin') ? 'admin' : 'user',
        avatar: `https://ui-avatars.com/api/?name=${name}&background=FFD6E0&color=8B6F5A&size=150`
      };
      
      await setDoc(doc(db, 'users', userId), newUser);
      
      // We don't sign out immediately here anymore, let the UI handle it
      // so the UI can show success state before it unmounts
    } catch (error: any) {
      if (error.code?.startsWith('auth/')) {
        throw error;
      }
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const updateProfile = async (name: string, email: string) => {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.id);
      try {
        await updateDoc(userRef, { name, email });
        setCurrentUser({ ...currentUser, name, email });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.id}`);
      }
    }
  };

  const addCourse = async (course: Omit<Course, 'id'>) => {
    try {
      const courseWithSlots = {
        ...course,
        availableSlots: course.availableSlots ?? course.slots
      };
      const docRef = await addDoc(collection(db, 'courses'), courseWithSlots);
      await updateDoc(docRef, { id: docRef.id });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'courses');
    }
  };

  const updateCourse = async (id: string, updated: Partial<Course>) => {
    try {
      await updateDoc(doc(db, 'courses', id), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `courses/${id}`);
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'courses', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `courses/${id}`);
    }
  };

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    try {
      await runTransaction(db, async (transaction) => {
        const courseRef = doc(db, 'courses', bookingData.courseId);
        const courseSnap = await transaction.get(courseRef);
        
        if (!courseSnap.exists()) {
          throw new Error('Course not found');
        }
        
        const course = courseSnap.data() as Course;
        const currentAvailableSlots = course.availableSlots ?? course.slots;
        
        if (currentAvailableSlots < bookingData.participants) {
          throw new Error(`Insufficient slots. Only ${currentAvailableSlots} slots left.`);
        }
        
        // Create booking
        const newBookingRef = doc(collection(db, 'bookings'));
        const bookingId = newBookingRef.id;
        const newBooking = {
          ...bookingData,
          id: bookingId,
          createdAt: new Date().toISOString()
        };
        
        transaction.set(newBookingRef, newBooking);
        
        // Update course slots
        transaction.update(courseRef, {
          availableSlots: currentAvailableSlots - bookingData.participants
        });
      });
      
      // Add notification (after transaction succeeds)
      await addNotification(bookingData.userId, {
        title: 'Booking Successful! 🎉',
        description: `Your booking for ${bookingData.courseTitle} has been received.`,
        icon: '🍰',
        type: 'success'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status'], p_status?: Booking['paymentStatus']) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      const bookingSnap = await getDoc(bookingRef);
      
      if (!bookingSnap.exists()) return;
      const b = bookingSnap.data() as Booking;
      const oldStatus = b.status;

      await runTransaction(db, async (transaction) => {
        // 1. All Reads First
        const bSnap = await transaction.get(bookingRef);
        if (!bSnap.exists()) return;
        const bData = bSnap.data() as Booking;
        
        const courseRef = doc(db, 'courses', bData.courseId);
        const cSnap = await transaction.get(courseRef);
        
        // 2. All Writes Second
        const updates: any = { status };
        if (p_status) updates.paymentStatus = p_status;
        
        transaction.update(bookingRef, updates);

        // Handle slots restoration/deduction
        const freeStatuses = ['Cancelled', 'Completed'];
        const isOldFree = freeStatuses.includes(oldStatus);
        const isNewFree = freeStatuses.includes(status);

        if (isNewFree && !isOldFree) {
          // Restore slots
          if (cSnap.exists()) {
            const course = cSnap.data() as Course;
            transaction.update(courseRef, {
              availableSlots: (course.availableSlots ?? course.slots) + bData.participants
            });
          }
        } else if (!isNewFree && isOldFree) {
          // Deduct slots
          if (cSnap.exists()) {
            const course = cSnap.data() as Course;
            const currentAvailable = course.availableSlots ?? course.slots;
            if (currentAvailable < bData.participants) {
              throw new Error('Cannot change status: Insufficient slots available.');
            }
            transaction.update(courseRef, {
              availableSlots: currentAvailable - bData.participants
            });
          }
        }
      });
      
      await addNotification(b.userId, {
        title: `Booking ${status}! ${status === 'Confirmed' || status === 'Completed' ? '✅' : status === 'Cancelled' ? '❌' : 'ℹ️'}`,
        description: `Your booking for ${b.courseTitle} has been marked as ${status.toLowerCase()}.`,
        icon: status === 'Confirmed' || status === 'Completed' ? '🍰' : status === 'Cancelled' ? '🚫' : '📋',
        type: status === 'Cancelled' ? 'warning' : 'success'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  const addNotification = async (userId: string, noti: Omit<Notification, 'id' | 'userId' | 'time'>) => {
    try {
      const newNoti = {
        ...noti,
        userId,
        time: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'notifications'), newNoti);
      await updateDoc(docRef, { id: docRef.id });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'notifications');
    }
  };

  if (initialLoading) return null;

  return (
    <AppContext.Provider value={{ 
      currentUser, courses, bookings, notifications, users,
      login, loginWithEmail, registerWithEmail, logout, updateProfile, 
      addCourse, updateCourse, deleteCourse,
      addBooking, updateBookingStatus, addNotification 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
