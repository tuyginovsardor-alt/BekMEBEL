export interface FurnitureCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  details: string;
  items: string[];
  material: string;
  guarantee: string;
  duration: string;
}

export interface Testimonial {
  id: string; // Updated to string for Firestore ID
  name: string;
  role: string;
  comment: string;
  rating: number;
  date: string;
  createdAt?: any;
}

export interface OrderFormData {
  fullName: string;
  phone: string;
  category: string;
  message: string;
}

export interface Booking {
  id: string;
  fullName: string;
  phone: string;
  category: string;
  message: string;
  status: 'yangi' | 'aloqada' | 'kelishildi' | 'yakunlandi' | 'bekor_qilindi';
  createdAt: any;
  updatedAt: any;
  userId?: string;
  adminNote?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  assignedAt: any;
  assignedBy?: string;
}

export interface ContactSettings {
  phones: string[];
  email: string;
  address: string;
  workingHours: string;
  instagram: string;
  telegram: string;
  mapsLink: string;
}
