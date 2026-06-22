export type Gender = "Male" | "Female" | "Kids" | "Unisex";
export type DayNight = "Day" | "Night" | "Both";
export type Season = "Winter" | "Spring" | "Summer" | "Autumn";
export type Category =
  | "Perfume"
  | "Brand Perfume"
  | "Luxury Perfume"
  | "Ultra-Luxury Perfume";

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
}
