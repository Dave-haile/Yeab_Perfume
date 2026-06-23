export type Gender = "Male" | "Female" | "Kids" | "Unisex";
export type DayNight = "Day" | "Night" | "Both";
export type Season = "Winter" | "Spring" | "Summer" | "Autumn";
export type Category =
  | "Perfume"
  | "Brand Perfume"
  | "Luxury Perfume"
  | "Ultra-Luxury Perfume";
export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
export type UserRole = "admin" | "staff";

export interface Perfume {
  id: string;
  name: string;
  code: string;
  brand: string;
  price: number;
  gender: Gender;
  category: Category;
  description: string;
  rating: number;
  mainImage: string;
  galleryImages: string[];
  accords: { name: string; value: number; color: string }[];
  fragranceProfile: {
    longevity: string;
    projection: string;
    sillage: string;
  };
  dayNight: DayNight;
  seasons: Season[];
  notes: {
    top: { name: string; iconUrl: string }[];
    middle: { name: string; iconUrl: string }[];
    base: { name: string; iconUrl: string }[];
  };
  stockStatus?: StockStatus;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export interface StaffRequest {
  id: string;
  perfumeId: string;
  perfumeName: string;
  station?: string;
  resolved: boolean;
  time: string;
  createdAt: string;
  resolvedAt?: string;
}
