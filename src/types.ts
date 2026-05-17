export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  priceFormatted: string;
  schedule: string;
  image: string;
  level: CourseLevel;
  slots: number;
  availableSlots: number;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Unpaid' | 'Checking' | 'Paid';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  courseImage: string;
  date: string;
  totalPrice: number;
  totalPriceFormatted: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  participants: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  type: 'success' | 'payment' | 'reminder' | 'warning';
}
