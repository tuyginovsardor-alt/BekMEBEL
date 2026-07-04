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
  id: number;
  name: string;
  role: string;
  comment: string;
  rating: number;
  date: string;
}

export interface OrderFormData {
  fullName: string;
  phone: string;
  category: string;
  message: string;
}
