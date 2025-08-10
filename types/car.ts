export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  priceUSD: number;
  mileage: number;
  transmission: string;
  fuel: string;
  condition: string;
  location: string;
  description: string;
  features: string[];
  images: string[];
  featured: boolean;
  newly_arrived: boolean;
  date_added: string;
}

export interface SearchFilters {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  transmission?: string;
  fuel?: string;
  location?: string;
}

export interface BookingForm {
  name: string;
  phone: string;
  email: string;
  carId: string;
  preferredDate: string;
  message: string;
}

export interface CarSubmission {
  id: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  asking_price: number;
  transmission: string;
  fuel: string;
  condition: string;
  location: string;
  description: string;
  features: string[];
  images: string[];
  idDocument?: File;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}
