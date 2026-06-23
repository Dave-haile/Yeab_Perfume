/**
 * Perfume seeder
 * Run with: npx ts-node seed.ts
 *
 * What it does:
 * 1. Wipes all existing perfumes (clean slate)
 * 2. Inserts the sample perfumes below
 *
 * Safe to run multiple times — clears first, then re-inserts.
 * Images here use placeholder URLs. Once you upload real images
 * via POST /api/uploads/image, replace the URLs here or just
 * update them from the admin panel.
 */

import "dotenv/config";
import db from "./db/connection";
import { createTables } from "./db/schema";
import { createPerfume } from "./models/perfumes";
import { CreatePerfumeDTO, CreateUserDTO, User } from "./types";
import { createUser } from "./models/users";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const perfumes: CreatePerfumeDTO[] = [
  {
    name: "Noir de Velours",
    code: "ME-001",
    brand: "Maison Étoile",
    price: 145,
    gender: "Unisex",
    category: "Luxury Perfume",
    description:
      "A smoky, resinous oud wrapped in dark rose and warm amber. Built for the evening — commanding, deep, unforgettable.",
    rating: 4.7,
    mainImage: "/uploads/placeholder-dark.jpg",
    galleryImages: [],
    accords: [
      { name: "Oud", value: 85, color: "#6B2737" },
      { name: "Rose", value: 70, color: "#C9A876" },
      { name: "Amber", value: 60, color: "#8B6F47" },
    ],
    fragranceProfile: {
      longevity: "8-10 hours",
      projection: "Strong",
      sillage: "Heavy",
    },
    dayNight: "Night",
    seasons: ["Autumn", "Winter"],
    notes: {
      top: [
        { name: "Black Pepper", iconUrl: "" },
        { name: "Bergamot", iconUrl: "" },
      ],
      middle: [
        { name: "Oud", iconUrl: "" },
        { name: "Rose", iconUrl: "" },
      ],
      base: [
        { name: "Amber", iconUrl: "" },
        { name: "Vanilla", iconUrl: "" },
      ],
    },
    inStock: true,
  },
  {
    name: "Jardin Blanc",
    code: "ME-002",
    brand: "Maison Étoile",
    price: 128,
    gender: "Female",
    category: "Perfume",
    description:
      "Sunlit white florals drifting over a whisper of clean musk. Light, airy, and effortlessly elegant.",
    rating: 4.5,
    mainImage: "/uploads/placeholder-light.jpg",
    galleryImages: [],
    accords: [
      { name: "Floral", value: 90, color: "#E8D5B5" },
      { name: "Musk", value: 50, color: "#F7F1E8" },
      { name: "Citrus", value: 40, color: "#C9A876" },
    ],
    fragranceProfile: {
      longevity: "5-7 hours",
      projection: "Moderate",
      sillage: "Light",
    },
    dayNight: "Day",
    seasons: ["Spring", "Summer"],
    notes: {
      top: [
        { name: "Pear", iconUrl: "" },
        { name: "Neroli", iconUrl: "" },
      ],
      middle: [
        { name: "Jasmine", iconUrl: "" },
        { name: "Peony", iconUrl: "" },
      ],
      base: [
        { name: "White Musk", iconUrl: "" },
        { name: "Cedar", iconUrl: "" },
      ],
    },
    inStock: true,
  },
  {
    name: "Santal Fumé",
    code: "ME-003",
    brand: "Maison Étoile",
    price: 162,
    gender: "Male",
    category: "Luxury Perfume",
    description:
      "Creamy sandalwood and supple leather, finished with a whisper of smoked tea. Grounded, confident, warm.",
    rating: 4.8,
    mainImage: "/uploads/placeholder-wood.jpg",
    galleryImages: [],
    accords: [
      { name: "Woody", value: 88, color: "#8B6F47" },
      { name: "Leather", value: 65, color: "#6B2737" },
      { name: "Smoky", value: 45, color: "#120F0E" },
    ],
    fragranceProfile: {
      longevity: "9-11 hours",
      projection: "Strong",
      sillage: "Moderate",
    },
    dayNight: "Both",
    seasons: ["Autumn", "Winter"],
    notes: {
      top: [
        { name: "Cardamom", iconUrl: "" },
        { name: "Smoked Tea", iconUrl: "" },
      ],
      middle: [
        { name: "Sandalwood", iconUrl: "" },
        { name: "Leather", iconUrl: "" },
      ],
      base: [
        { name: "Vetiver", iconUrl: "" },
        { name: "Tonka Bean", iconUrl: "" },
      ],
    },
    inStock: true,
  },
  {
    inStock: true,
    name: "Oud Wood Intense",
    code: "P-OW19",
    brand: "Tom Ford",
    price: 9500,
    gender: "Male",
    category: "Brand Perfume",
    description:
      "An incredibly luxurious and intense blend of rare oud wood, smoky cardamom, Sichuan pepper, and warm amber resin.",
    rating: 4.8,
    mainImage:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600",
    ],
    accords: [
      { name: "Woody", value: 90, color: "#8d6e63" },
      { name: "Spicy", value: 75, color: "#d84315" },
      { name: "Leather", value: 60, color: "#5d4037" },
    ],
    fragranceProfile: {
      longevity: "10H",
      projection: "Strong",
      sillage: "Heavy",
    },
    dayNight: "Night",
    seasons: ["Winter", "Autumn"],
    notes: {
      top: [
        {
          name: "Sichuan Pepper",
          iconUrl:
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop",
        },
        {
          name: "Cardamom",
          iconUrl:
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop",
        },
      ],
      middle: [
        {
          name: "Oud Wood",
          iconUrl:
            "https://images.unsplash.com/photo-1517457210515-46e3fb0b35cd?w=100&h=100&fit=crop",
        },
        {
          name: "Sandalwood",
          iconUrl:
            "https://images.unsplash.com/photo-1626015502690-e555909247eb?w=100&h=100&fit=crop",
        },
      ],
      base: [
        {
          name: "Vanilla",
          iconUrl:
            "https://images.unsplash.com/photo-1615655513076-2e4b31a3962b?w=100&h=100&fit=crop",
        },
        {
          name: "Amber Resin",
          iconUrl:
            "https://images.unsplash.com/photo-1616081498175-680459c3a3b0?w=100&h=100&fit=crop",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Baccarat Rouge 540",
    code: "P-BR54",
    brand: "Maison Francis Kurkdjian",
    price: 13500,
    gender: "Unisex",
    category: "Luxury Perfume",
    description:
      "Luminous and highly sophisticated, Baccarat Rouge 540 lies on the skin like a warm, sweet, poetic amber-floral breeze.",
    rating: 4.9,
    mainImage:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
    ],
    accords: [
      { name: "Amber", value: 95, color: "#ff8f00" },
      { name: "Sweet", value: 85, color: "#f06292" },
      { name: "Woody", value: 70, color: "#8d6e63" },
    ],
    fragranceProfile: {
      longevity: "12H+",
      projection: "Enormous",
      sillage: "Enormous",
    },
    dayNight: "Both",
    seasons: ["Winter", "Spring", "Autumn"],
    notes: {
      top: [
        {
          name: "Saffron",
          iconUrl:
            "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=100&h=100&fit=crop",
        },
        {
          name: "Jasmine",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?w=100&h=100&fit=crop",
        },
      ],
      middle: [
        {
          name: "Amberwood",
          iconUrl:
            "https://images.unsplash.com/photo-1517457210515-46e3fb0b35cd?w=100&h=100&fit=crop",
        },
        {
          name: "Ambergris",
          iconUrl:
            "https://images.unsplash.com/photo-1626015502690-e555909247eb?w=100&h=100&fit=crop",
        },
      ],
      base: [
        {
          name: "Fir Resin",
          iconUrl:
            "https://images.unsplash.com/photo-1615655513076-2e4b31a3962b?w=100&h=100&fit=crop",
        },
        {
          name: "Cedarwood",
          iconUrl:
            "https://images.unsplash.com/photo-1550605995-1c390543f324?w=100&h=100&fit=crop",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Bleu de Chanel",
    code: "P-BC40",
    brand: "Chanel",
    price: 8900,
    gender: "Male",
    category: "Brand Perfume",
    description:
      "A deeply captivating woody-aromatic masterpiece designed with sharp, invigorating grapefruit and lemon over heavy incense.",
    rating: 4.7,
    mainImage:
      "https://images.unsplash.com/photo-1523293111624-9b2f2d9dc2ba?w=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1523293111624-9b2f2d9dc2ba?w=600",
    ],
    accords: [
      { name: "Citrus", value: 85, color: "#fbc02d" },
      { name: "Woody", value: 75, color: "#8d6e63" },
      { name: "Aromatic", value: 65, color: "#009688" },
    ],
    fragranceProfile: {
      longevity: "8H",
      projection: "Moderate",
      sillage: "Moderate",
    },
    dayNight: "Both",
    seasons: ["Spring", "Summer", "Autumn"],
    notes: {
      top: [
        {
          name: "Grapefruit",
          iconUrl:
            "https://images.unsplash.com/photo-1577234286142-fc0ee054174d?w=100&h=100&fit=crop",
        },
        {
          name: "Lemon Mint",
          iconUrl:
            "https://images.unsplash.com/photo-1590502593747-422e1180addd?w=100&h=100&fit=crop",
        },
      ],
      middle: [
        {
          name: "Ginger Root",
          iconUrl:
            "https://images.unsplash.com/photo-1596541604085-f53856a9486c?w=100&h=100&fit=crop",
        },
        {
          name: "Nutmeg Spice",
          iconUrl:
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop",
        },
      ],
      base: [
        {
          name: "Smoky Incense",
          iconUrl:
            "https://images.unsplash.com/photo-1533038590840-0255c27bf215?w=100&h=100&fit=crop",
        },
        {
          name: "Sandalwood",
          iconUrl:
            "https://images.unsplash.com/photo-1626015502690-e555909247eb?w=100&h=100&fit=crop",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "La Vie Est Belle",
    code: "P-LB55",
    brand: "Lancôme",
    price: 6400,
    gender: "Female",
    category: "Perfume",
    description:
      "An elegant, optimistic floral-gourmand fragrance weaving black currant, pear, and blooming iris with a deep dark-chocolate base.",
    rating: 4.6,
    mainImage:
      "https://images.unsplash.com/photo-1588405748880-12d1d4d03e54?w=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1588405748880-12d1d4d03e54?w=600",
    ],
    accords: [
      { name: "Sweet", value: 90, color: "#f06292" },
      { name: "Fruity", value: 80, color: "#ff5252" },
      { name: "Floral", value: 70, color: "#ec407a" },
    ],
    fragranceProfile: {
      longevity: "9H",
      projection: "Strong",
      sillage: "Heavy",
    },
    dayNight: "Day",
    seasons: ["Winter", "Autumn", "Spring"],
    notes: {
      top: [
        {
          name: "Ripe Pear",
          iconUrl:
            "https://images.unsplash.com/photo-1615486171448-4cbab134375b?w=100&h=100&fit=crop",
        },
        {
          name: "Black Currant",
          iconUrl:
            "https://images.unsplash.com/photo-1586523171305-645472851b68?w=100&h=100&fit=crop",
        },
      ],
      middle: [
        {
          name: "Florentine Iris",
          iconUrl:
            "https://images.unsplash.com/photo-1614705353118-c2b4c5211d27?w=100&h=100&fit=crop",
        },
        {
          name: "Jasmine Blossom",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?w=100&h=100&fit=crop",
        },
      ],
      base: [
        {
          name: "Praline Sugar",
          iconUrl:
            "https://images.unsplash.com/photo-1557993414-f4b66dfdfc29?w=100&h=100&fit=crop",
        },
        {
          name: "Madagascar Vanilla",
          iconUrl:
            "https://images.unsplash.com/photo-1615655513076-2e4b31a3962b?w=100&h=100&fit=crop",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Dior Sauvage",
    code: "P-DS12",
    brand: "Dior",
    price: 8800,
    gender: "Male",
    category: "Brand Perfume",
    description:
      "A radically fresh and raw composition, dictating absolute values with powerful bergamot freshness and heavy amberwood.",
    rating: 4.5,
    mainImage:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600",
    ],
    accords: [
      { name: "Citrus", value: 85, color: "#fbc02d" },
      { name: "Aromatic", value: 75, color: "#009688" },
      { name: "Fresh Spicy", value: 65, color: "#00acc1" },
    ],
    fragranceProfile: {
      longevity: "8H",
      projection: "Strong",
      sillage: "Moderate",
    },
    dayNight: "Day",
    seasons: ["Spring", "Summer", "Autumn"],
    notes: {
      top: [
        {
          name: "Calabrian Bergamot",
          iconUrl:
            "https://images.unsplash.com/photo-1577234286142-fc0ee054174d?w=100&h=100&fit=crop",
        },
        {
          name: "Szechuan Pepper",
          iconUrl:
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop",
        },
      ],
      middle: [
        {
          name: "French Lavender",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?w=100&h=100&fit=crop",
        },
        {
          name: "Star Anise",
          iconUrl:
            "https://images.unsplash.com/photo-1614705353118-c2b4c5211d27?w=100&h=100&fit=crop",
        },
      ],
      base: [
        {
          name: "Cedarwood",
          iconUrl:
            "https://images.unsplash.com/photo-1550605995-1c390543f324?w=100&h=100&fit=crop",
        },
        {
          name: "Ambergris",
          iconUrl:
            "https://images.unsplash.com/photo-1626015502690-e555909247eb?w=100&h=100&fit=crop",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Chanel No. 5",
    code: "P-C05",
    brand: "Chanel",
    price: 12500,
    gender: "Female",
    category: "Luxury Perfume",
    description:
      "The very abstract, mysterious class of absolute femininity, featuring sparkling aldehydes and rose absolute over warm sandalwood.",
    rating: 4.8,
    mainImage:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600",
    ],
    accords: [
      { name: "Aldehydic", value: 90, color: "#f59e0b" },
      { name: "Floral", value: 85, color: "#ec407a" },
      { name: "Powdery", value: 75, color: "#ce93d8" },
    ],
    fragranceProfile: {
      longevity: "12H+",
      projection: "Enormous",
      sillage: "Enormous",
    },
    dayNight: "Night",
    seasons: ["Winter", "Autumn"],
    notes: {
      top: [
        {
          name: "Aldehydes",
          iconUrl:
            "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=100&h=100&fit=crop",
        },
        {
          name: "Neroli Blossom",
          iconUrl:
            "https://images.unsplash.com/photo-1577234286142-fc0ee054174d?w=100&h=100&fit=crop",
        },
      ],
      middle: [
        {
          name: "Grasse Rose",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?w=100&h=100&fit=crop",
        },
        {
          name: "Jasmine Absolute",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?w=100&h=100&fit=crop",
        },
      ],
      base: [
        {
          name: "Madagascar Vanilla",
          iconUrl:
            "https://images.unsplash.com/photo-1615655513076-2e4b31a3962b?w=100&h=100&fit=crop",
        },
        {
          name: "Mysore Sandalwood",
          iconUrl:
            "https://images.unsplash.com/photo-1616081498175-680459c3a3b0?w=100&h=100&fit=crop",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Baby Powder Fresh",
    code: "P-BP02",
    brand: "Yeab Organics",
    price: 3200,
    gender: "Kids",
    category: "Perfume",
    description:
      "An exceptionally mild, soothing, and allergen-safe cologne formulation crafted for delicate skins, offering light chamomile and vanilla.",
    rating: 4.4,
    mainImage:
      "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Powdery", value: 90, color: "#ce93d8" },
      { name: "Fresh", value: 80, color: "#26c6da" },
      { name: "Sweet", value: 65, color: "#f06292" },
    ],
    fragranceProfile: {
      longevity: "4H",
      projection: "Light",
      sillage: "Soft",
    },
    dayNight: "Day",
    seasons: ["Spring", "Summer"],
    notes: {
      top: [
        {
          name: "Sweet Orange",
          iconUrl:
            "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "White Petals",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Chamomile Tea",
          iconUrl:
            "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Warm Milk",
          iconUrl:
            "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Musk",
          iconUrl:
            "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Smooth Vanilla",
          iconUrl:
            "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Velvet Noir",
    code: "P-VN22",
    brand: "Chanel",
    price: 12800,
    gender: "Female",
    category: "Luxury Perfume",
    description:
      "A seductive bouquet of dark roses, black currant, and smoky vanilla layered with patchouli and warm amber that leaves an unforgettable trail of mystery.",
    rating: 4.9,
    mainImage:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1588405748880-8d4b3a44ebf2?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Floral", value: 90, color: "#e91e63" },
      { name: "Warm Spicy", value: 85, color: "#ff6f00" },
      { name: "Woody", value: 75, color: "#4e342e" },
    ],
    fragranceProfile: {
      longevity: "10H+",
      projection: "Strong",
      sillage: "Heavy",
    },
    dayNight: "Night",
    seasons: ["Autumn", "Winter"],
    notes: {
      top: [
        {
          name: "Black Currant",
          iconUrl:
            "https://images.unsplash.com/photo-1599695756054-0f44e36fa7f5?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Dark Rose",
          iconUrl:
            "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Smoky Vanilla",
          iconUrl:
            "https://images.unsplash.com/photo-1515549832467-8783363e19b6?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Patchouli",
          iconUrl:
            "https://images.unsplash.com/photo-1596541604085-f53856a9486c?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Warm Amber",
          iconUrl:
            "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Sandalwood",
          iconUrl:
            "https://images.unsplash.com/photo-1511802187628-3b1debcca8f0?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Oud Imperial",
    code: "P-OI33",
    brand: "Maison Francis Kurkdjian",
    price: 15900,
    gender: "Male",
    category: "Luxury Perfume",
    description:
      "A majestic blend of rare agarwood, Bulgarian rose, and saffron with hints of amber and leather that exudes power, prestige, and timeless elegance.",
    rating: 4.8,
    mainImage:
      "https://images.unsplash.com/photo-1588405748880-8d4b3a44ebf2?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1588405748880-8d4b3a44ebf2?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1563170351-be824bc3aa33?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Oud", value: 98, color: "#3e2723" },
      { name: "Spicy", value: 88, color: "#bf360c" },
      { name: "Leather", value: 80, color: "#5d4037" },
    ],
    fragranceProfile: {
      longevity: "12H+",
      projection: "Very Strong",
      sillage: "Heavy",
    },
    dayNight: "Night",
    seasons: ["Spring", "Winter"],
    notes: {
      top: [
        {
          name: "Saffron",
          iconUrl:
            "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Bulgarian Rose",
          iconUrl:
            "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Agarwood",
          iconUrl:
            "https://images.unsplash.com/photo-1596541604085-f53856a9486c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Amber",
          iconUrl:
            "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Leather",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Cedarwood",
          iconUrl:
            "https://images.unsplash.com/photo-1511802187628-3b1debcca8f0?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Gardenia Blanc",
    code: "P-GB44",
    brand: "Gucci",
    price: 8900,
    gender: "Female",
    category: "Luxury Perfume",
    description:
      "A luminous bouquet of white gardenia, jasmine petals, and orange blossom with a creamy coconut undertone that evokes a sun-drenched Mediterranean garden.",
    rating: 4.7,
    mainImage:
      "https://images.unsplash.com/photo-1594035910387-f5604778a0a0?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1594035910387-f5604778a0a0?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1527960669560-d7fc8d8aef6b?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "White Floral", value: 95, color: "#f8bbd0" },
      { name: "Creamy", value: 80, color: "#f5f5f5" },
      { name: "Sweet", value: 75, color: "#ffcc02" },
    ],
    fragranceProfile: {
      longevity: "7H",
      projection: "Moderate",
      sillage: "Light",
    },
    dayNight: "Day",
    seasons: ["Spring", "Summer"],
    notes: {
      top: [
        {
          name: "Orange Blossom",
          iconUrl:
            "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Gardenia",
          iconUrl:
            "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Jasmine Petals",
          iconUrl:
            "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Coconut Milk",
          iconUrl:
            "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "White Musk",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Vanilla Bean",
          iconUrl:
            "https://images.unsplash.com/photo-1515549832467-8783363e19b6?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Cypress & Cedar",
    code: "P-CC55",
    brand: "Tom Ford",
    price: 11200,
    gender: "Male",
    category: "Luxury Perfume",
    description:
      "A crisp, aromatic blend of Mediterranean cypress, Virginia cedar, and smoky incense with a dash of black pepper and vetiver that embodies modern sophistication.",
    rating: 4.5,
    mainImage:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1511802187628-3b1debcca8f0?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1563170351-be824bc3aa33?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Woody", value: 92, color: "#4e342e" },
      { name: "Aromatic", value: 85, color: "#2e7d32" },
      { name: "Spicy", value: 78, color: "#bf360c" },
    ],
    fragranceProfile: {
      longevity: "8H",
      projection: "Strong",
      sillage: "Moderate",
    },
    dayNight: "Both",
    seasons: ["Autumn", "Winter"],
    notes: {
      top: [
        {
          name: "Black Pepper",
          iconUrl:
            "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Cypress",
          iconUrl:
            "https://images.unsplash.com/photo-1515516969-d4014cc0c997?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Cedarwood",
          iconUrl:
            "https://images.unsplash.com/photo-1511802187628-3b1debcca8f0?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Incense",
          iconUrl:
            "https://images.unsplash.com/photo-1596541604085-f53856a9486c?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Vetiver",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Oakmoss",
          iconUrl:
            "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Pink Mimosa",
    code: "P-PM66",
    brand: "Dior",
    price: 9500,
    gender: "Female",
    category: "Luxury Perfume",
    description:
      "A delicate and joyful blend of pink mimosa flowers, powdery iris, and sweet pear with a whisper of almond and creamy sandalwood that radiates effortless femininity.",
    rating: 4.4,
    mainImage:
      "https://images.unsplash.com/photo-1527960669560-d7fc8d8aef6b?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1527960669560-d7fc8d8aef6b?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1594035910387-f5604778a0a0?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Powdery", value: 88, color: "#f3e5f5" },
      { name: "Floral", value: 85, color: "#f48fb1" },
      { name: "Fruity", value: 75, color: "#ffcc02" },
    ],
    fragranceProfile: {
      longevity: "5H",
      projection: "Soft",
      sillage: "Light",
    },
    dayNight: "Day",
    seasons: ["Spring", "Summer"],
    notes: {
      top: [
        {
          name: "Sweet Pear",
          iconUrl:
            "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Mimosa",
          iconUrl:
            "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Powdery Iris",
          iconUrl:
            "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Almond",
          iconUrl:
            "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Sandalwood",
          iconUrl:
            "https://images.unsplash.com/photo-1511802187628-3b1debcca8f0?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "White Musk",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Tobacco & Honey",
    code: "P-TH77",
    brand: "Byredo",
    price: 13800,
    gender: "Unisex",
    category: "Ultra-Luxury Perfume",
    description:
      "A bold and addictive fusion of aged tobacco leaves, golden honey, and dark rum with hints of cinnamon and dried fruits that creates a warm, intoxicating aura.",
    rating: 4.8,
    mainImage:
      "https://images.unsplash.com/photo-1588405748880-8d4b3a44ebf2?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1588405748880-8d4b3a44ebf2?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1563170351-be824bc3aa33?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Tobacco", value: 96, color: "#5d4037" },
      { name: "Sweet", value: 88, color: "#ff6f00" },
      { name: "Bozy", value: 82, color: "#4e342e" },
    ],
    fragranceProfile: {
      longevity: "10H+",
      projection: "Very Strong",
      sillage: "Heavy",
    },
    dayNight: "Night",
    seasons: ["Autumn", "Winter"],
    notes: {
      top: [
        {
          name: "Dark Rum",
          iconUrl:
            "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Cinnamon",
          iconUrl:
            "https://images.unsplash.com/photo-1515516969-d4014cc0c997?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Tobacco Leaf",
          iconUrl:
            "https://images.unsplash.com/photo-1596541604085-f53856a9486c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Golden Honey",
          iconUrl:
            "https://images.unsplash.com/photo-1515549832467-8783363e19b6?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Dried Fruits",
          iconUrl:
            "https://images.unsplash.com/photo-1599695756054-0f44e36fa7f5?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Amber",
          iconUrl:
            "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Mojito Mint",
    code: "P-MM88",
    brand: "Acqua Di Parma",
    price: 7500,
    gender: "Unisex",
    category: "Luxury Perfume",
    description:
      "A refreshing burst of crushed mint leaves, lime zest, and white rum with a touch of sugar cane and basil that brings the vibrant energy of a Cuban cocktail to life.",
    rating: 4.3,
    mainImage:
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Green", value: 92, color: "#43a047" },
      { name: "Citrus", value: 85, color: "#fbc02d" },
      { name: "Aromatic", value: 78, color: "#2e7d32" },
    ],
    fragranceProfile: {
      longevity: "5H",
      projection: "Moderate",
      sillage: "Moderate",
    },
    dayNight: "Day",
    seasons: ["Spring", "Summer"],
    notes: {
      top: [
        {
          name: "Crushed Mint",
          iconUrl:
            "https://images.unsplash.com/photo-1515516969-d4014cc0c997?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Lime Zest",
          iconUrl:
            "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "White Rum",
          iconUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Basil",
          iconUrl:
            "https://images.unsplash.com/photo-1515516969-d4014cc0c997?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Sugar Cane",
          iconUrl:
            "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "White Musk",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Saffron & Leather",
    code: "P-SL99",
    brand: "Maison Francis Kurkdjian",
    price: 14500,
    gender: "Male",
    category: "Ultra-Luxury Perfume",
    description:
      "A daring blend of precious saffron, soft suede leather, and black tea with a smoky vetiver undertone that defines modern masculinity and refined taste.",
    rating: 4.7,
    mainImage:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1588405748880-8d4b3a44ebf2?auto=format&fit=crop&q=80&w=650",
      "https://images.unsplash.com/photo-1563170351-be824bc3aa33?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Leather", value: 94, color: "#3e2723" },
      { name: "Spicy", value: 90, color: "#bf360c" },
      { name: "Smoky", value: 82, color: "#4e342e" },
    ],
    fragranceProfile: {
      longevity: "11H+",
      projection: "Very Strong",
      sillage: "Heavy",
    },
    dayNight: "Night",
    seasons: ["Autumn", "Winter"],
    notes: {
      top: [
        {
          name: "Saffron",
          iconUrl:
            "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Black Tea",
          iconUrl:
            "https://images.unsplash.com/photo-1515516969-d4014cc0c997?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Suede Leather",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Smoky Vetiver",
          iconUrl:
            "https://images.unsplash.com/photo-1511802187628-3b1debcca8f0?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Cedarwood",
          iconUrl:
            "https://images.unsplash.com/photo-1511802187628-3b1debcca8f0?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Oakmoss",
          iconUrl:
            "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Ocean Breeze",
    code: "P-OB11",
    brand: "Acqua Di Parma",
    price: 7800,
    gender: "Unisex",
    category: "Luxury Perfume",
    description:
      "An invigorating splash of Sicilian bergamot, fresh sea spray, lavender, and crisp white rosemary that captures the warmth of a beach escape.",
    rating: 4.6,
    mainImage:
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Aquatic", value: 95, color: "#29b6f6" },
      { name: "Citrus", value: 85, color: "#fbc02d" },
      { name: "Herbal", value: 70, color: "#43a047" },
    ],
    fragranceProfile: {
      longevity: "6H",
      projection: "Moderate",
      sillage: "Moderate",
    },
    dayNight: "Day",
    seasons: ["Spring", "Summer"],
    notes: {
      top: [
        {
          name: "Bergamot Citrus",
          iconUrl:
            "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Sea Salt Spray",
          iconUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Rosemary Sprig",
          iconUrl:
            "https://images.unsplash.com/photo-1515516969-d4014cc0c997?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Blue Lavender",
          iconUrl:
            "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Driftwood",
          iconUrl:
            "https://images.unsplash.com/photo-1596541604085-f53856a9486c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Musk",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Velvet Rose",
    code: "P-VR24",
    brand: "Chanel",
    price: 9200,
    gender: "Female",
    category: "Luxury Perfume",
    description:
      "A romantic bouquet of Bulgarian rose, Turkish rose, and patchouli wrapped in soft vanilla and warm amber for timeless elegance.",
    rating: 4.8,
    mainImage:
      "https://images.unsplash.com/photo-1541643600914-78c6b6e5c8c9?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1541643600914-78c6b6e5c8c9?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Floral", value: 92, color: "#e91e63" },
      { name: "Woody", value: 75, color: "#5d4037" },
      { name: "Sweet", value: 68, color: "#ff9800" },
    ],
    fragranceProfile: {
      longevity: "8H",
      projection: "Strong",
      sillage: "Intense",
    },
    dayNight: "Night",
    seasons: ["Autumn", "Winter"],
    notes: {
      top: [
        {
          name: "Bulgarian Rose",
          iconUrl:
            "https://images.unsplash.com/photo-1587814213272-4d4e2a2d8f3e?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Pink Pepper",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Turkish Rose",
          iconUrl:
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Jasmine",
          iconUrl:
            "https://images.unsplash.com/photo-1584797011931-5c8e5e4f0e3a?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Patchouli",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Vanilla Amber",
          iconUrl:
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Noir Oud",
    code: "P-NO37",
    brand: "Tom Ford",
    price: 12500,
    gender: "Male",
    category: "Ultra-Luxury Perfume",
    description:
      "A dark and mysterious blend of oud wood, leather, spicy saffron, and rich tobacco with a smoky incense base.",
    rating: 4.7,
    mainImage:
      "https://images.unsplash.com/photo-1594032643928-3c4f0c6a6e5c?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1594032643928-3c4f0c6a6e5c?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Oud", value: 90, color: "#3e2723" },
      { name: "Spicy", value: 80, color: "#f44336" },
      { name: "Leather", value: 75, color: "#5d4037" },
    ],
    fragranceProfile: {
      longevity: "10H",
      projection: "Strong",
      sillage: "Intense",
    },
    dayNight: "Night",
    seasons: ["Autumn", "Winter"],
    notes: {
      top: [
        {
          name: "Saffron",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Bergamot",
          iconUrl:
            "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Oud Wood",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Leather",
          iconUrl:
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Tobacco",
          iconUrl:
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Incense",
          iconUrl:
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Citrus Grove",
    code: "P-CG15",
    brand: "Hermès",
    price: 6800,
    gender: "Unisex",
    category: "Luxury Perfume",
    description:
      "Bright and zesty with Sicilian lemon, grapefruit, orange blossom, and a touch of vetiver for a fresh, sunny escape.",
    rating: 4.5,
    mainImage:
      "https://images.unsplash.com/photo-1587015300109-5b5b5b5b5b5b?auto=format&fit=crop&q=80&w=650", // citrus-themed
    galleryImages: [
      "https://images.unsplash.com/photo-1587015300109-5b5b5b5b5b5b?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Citrus", value: 95, color: "#ffeb3b" },
      { name: "Fresh", value: 80, color: "#4caf50" },
      { name: "Woody", value: 60, color: "#795548" },
    ],
    fragranceProfile: {
      longevity: "5H",
      projection: "Moderate",
      sillage: "Light",
    },
    dayNight: "Day",
    seasons: ["Spring", "Summer"],
    notes: {
      top: [
        {
          name: "Sicilian Lemon",
          iconUrl:
            "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Grapefruit",
          iconUrl:
            "https://images.unsplash.com/photo-1587015300109-5b5b5b5b5b5b?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Orange Blossom",
          iconUrl:
            "https://images.unsplash.com/photo-1584797011931-5c8e5e4f0e3a?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Vetiver",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Musk",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Midnight Orchid",
    code: "P-MO42",
    brand: "Gucci",
    price: 8500,
    gender: "Female",
    category: "Luxury Perfume",
    description:
      "Exotic and seductive with black orchid, jasmine, dark chocolate, and patchouli for a mysterious evening allure.",
    rating: 4.4,
    mainImage:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Floral", value: 88, color: "#9c27b0" },
      { name: "Gourmand", value: 72, color: "#795548" },
      { name: "Woody", value: 65, color: "#3e2723" },
    ],
    fragranceProfile: {
      longevity: "7H",
      projection: "Moderate",
      sillage: "Moderate",
    },
    dayNight: "Night",
    seasons: ["Autumn", "Winter", "Spring"],
    notes: {
      top: [
        {
          name: "Black Orchid",
          iconUrl:
            "https://images.unsplash.com/photo-1584797011931-5c8e5e4f0e3a?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Jasmine Sambac",
          iconUrl:
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Ylang-Ylang",
          iconUrl:
            "https://images.unsplash.com/photo-1587015300109-5b5b5b5b5b5b?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Patchouli",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Dark Chocolate",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Arctic Woods",
    code: "P-AW29",
    brand: "Creed",
    price: 14500,
    gender: "Unisex",
    category: "Ultra-Luxury Perfume",
    description:
      "Crisp pine, icy bergamot, and vetiver with a base of cedar and white musk evoking a pristine winter forest.",
    rating: 4.9,
    mainImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Woody", value: 90, color: "#4a2c0b" },
      { name: "Fresh", value: 85, color: "#81d4fa" },
      { name: "Aromatic", value: 70, color: "#26a69a" },
    ],
    fragranceProfile: {
      longevity: "9H",
      projection: "Strong",
      sillage: "Moderate",
    },
    dayNight: "Both",
    seasons: ["Winter", "Autumn"],
    notes: {
      top: [
        {
          name: "Bergamot",
          iconUrl:
            "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Pine Needle",
          iconUrl:
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Juniper",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Cedarwood",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "White Musk",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Golden Oud",
    code: "P-GO51",
    brand: "Tom Ford",
    price: 13800,
    gender: "Unisex",
    category: "Ultra-Luxury Perfume",
    description:
      "A rich and opulent fusion of oud, saffron, amber, and sweet vanilla with warm woody undertones that exudes sophistication.",
    rating: 4.8,
    mainImage:
      "https://images.unsplash.com/photo-1594032643928-3c4f0c6a6e5c?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1594032643928-3c4f0c6a6e5c?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Oud", value: 92, color: "#3e2723" },
      { name: "Spicy", value: 78, color: "#f44336" },
      { name: "Amber", value: 85, color: "#ff9800" },
    ],
    fragranceProfile: {
      longevity: "10H",
      projection: "Strong",
      sillage: "Intense",
    },
    dayNight: "Night",
    seasons: ["Autumn", "Winter"],
    notes: {
      top: [
        {
          name: "Saffron",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Bergamot",
          iconUrl:
            "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Oud Wood",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Rose",
          iconUrl:
            "https://images.unsplash.com/photo-1587814213272-4d4e2a2d8f3e?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Amber",
          iconUrl:
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Vanilla",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Fresh Linen",
    code: "P-FL19",
    brand: "Maison Francis Kurkdjian",
    price: 9500,
    gender: "Unisex",
    category: "Luxury Perfume",
    description:
      "Clean and airy with white musk, crisp linen accord, lavender, and a hint of citrus for a sophisticated everyday freshness.",
    rating: 4.6,
    mainImage:
      "https://images.unsplash.com/photo-1541643600914-78c6b6e5c8c9?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1541643600914-78c6b6e5c8c9?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Fresh", value: 90, color: "#81d4fa" },
      { name: "Musky", value: 85, color: "#e0e0e0" },
      { name: "Floral", value: 65, color: "#e91e63" },
    ],
    fragranceProfile: {
      longevity: "7H",
      projection: "Moderate",
      sillage: "Moderate",
    },
    dayNight: "Day",
    seasons: ["Spring", "Summer"],
    notes: {
      top: [
        {
          name: "Bergamot",
          iconUrl:
            "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Lavender",
          iconUrl:
            "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "White Linen",
          iconUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "White Musk",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Cedar",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Black Vanilla",
    code: "P-BV33",
    brand: "Yves Saint Laurent",
    price: 7200,
    gender: "Female",
    category: "Luxury Perfume",
    description:
      "Warm and sensual with Madagascar vanilla, tonka bean, jasmine, and a touch of spicy pink pepper.",
    rating: 4.7,
    mainImage:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Gourmand", value: 88, color: "#795548" },
      { name: "Sweet", value: 82, color: "#ff9800" },
      { name: "Floral", value: 70, color: "#e91e63" },
    ],
    fragranceProfile: {
      longevity: "8H",
      projection: "Strong",
      sillage: "Moderate",
    },
    dayNight: "Night",
    seasons: ["Autumn", "Winter"],
    notes: {
      top: [
        {
          name: "Pink Pepper",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Jasmine",
          iconUrl:
            "https://images.unsplash.com/photo-1584797011931-5c8e5e4f0e3a?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Vanilla",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Tonka Bean",
          iconUrl:
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Summer Fig",
    code: "P-SF27",
    brand: "Diptyque",
    price: 8800,
    gender: "Unisex",
    category: "Luxury Perfume",
    description:
      "Juicy Mediterranean fig, coconut milk, and cedarwood with a green woody base that feels like a sun-drenched garden.",
    rating: 4.5,
    mainImage:
      "https://images.unsplash.com/photo-1587015300109-5b5b5b5b5b5b?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1587015300109-5b5b5b5b5b5b?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Fruity", value: 85, color: "#f06292" },
      { name: "Green", value: 80, color: "#4caf50" },
      { name: "Woody", value: 72, color: "#5d4037" },
    ],
    fragranceProfile: {
      longevity: "6H",
      projection: "Moderate",
      sillage: "Moderate",
    },
    dayNight: "Day",
    seasons: ["Summer", "Spring"],
    notes: {
      top: [
        {
          name: "Fig Leaf",
          iconUrl:
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Coconut Milk",
          iconUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Cedarwood",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Fig Wood",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Royal Leather",
    code: "P-RL44",
    brand: "Creed",
    price: 15200,
    gender: "Male",
    category: "Ultra-Luxury Perfume",
    description:
      "A bold blend of Italian leather, birch tar, jasmine, and spicy cardamom with a smoky vetiver base.",
    rating: 4.9,
    mainImage:
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Leather", value: 90, color: "#5d4037" },
      { name: "Smoky", value: 75, color: "#424242" },
      { name: "Spicy", value: 70, color: "#f44336" },
    ],
    fragranceProfile: {
      longevity: "9H",
      projection: "Strong",
      sillage: "Intense",
    },
    dayNight: "Night",
    seasons: ["Autumn", "Winter"],
    notes: {
      top: [
        {
          name: "Cardamom",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Leather",
          iconUrl:
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Jasmine",
          iconUrl:
            "https://images.unsplash.com/photo-1584797011931-5c8e5e4f0e3a?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Birch Tar",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Vetiver",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Moonlit Lily",
    code: "P-ML36",
    brand: "Chanel",
    price: 9800,
    gender: "Female",
    category: "Luxury Perfume",
    description:
      "Elegant white lily, neroli, and green tea with soft musk and sandalwood for a delicate, moonlit floral experience.",
    rating: 4.6,
    mainImage:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Floral", value: 93, color: "#e91e63" },
      { name: "Green", value: 75, color: "#4caf50" },
      { name: "Musky", value: 68, color: "#e0e0e0" },
    ],
    fragranceProfile: {
      longevity: "7H",
      projection: "Moderate",
      sillage: "Moderate",
    },
    dayNight: "Both",
    seasons: ["Spring", "Summer"],
    notes: {
      top: [
        {
          name: "Neroli",
          iconUrl:
            "https://images.unsplash.com/photo-1584797011931-5c8e5e4f0e3a?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "White Lily",
          iconUrl:
            "https://images.unsplash.com/photo-1587814213272-4d4e2a2d8f3e?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Green Tea",
          iconUrl:
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Sandalwood",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Musk",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Spiced Tobacco",
    code: "P-ST48",
    brand: "Dior",
    price: 11200,
    gender: "Male",
    category: "Luxury Perfume",
    description:
      "Warm tobacco leaf, cinnamon, tonka bean, and creamy vanilla with a base of patchouli and leather.",
    rating: 4.8,
    mainImage:
      "https://images.unsplash.com/photo-1594032643928-3c4f0c6a6e5c?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1594032643928-3c4f0c6a6e5c?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Tobacco", value: 88, color: "#5d4037" },
      { name: "Spicy", value: 80, color: "#f44336" },
      { name: "Sweet", value: 72, color: "#ff9800" },
    ],
    fragranceProfile: {
      longevity: "9H",
      projection: "Strong",
      sillage: "Intense",
    },
    dayNight: "Night",
    seasons: ["Autumn", "Winter"],
    notes: {
      top: [
        {
          name: "Cinnamon",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Tobacco Leaf",
          iconUrl:
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Tonka Bean",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Patchouli",
          iconUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
  {
    inStock: true,
    name: "Aqua Marine",
    code: "P-AM12",
    brand: "Acqua Di Parma",
    price: 6900,
    gender: "Unisex",
    category: "Luxury Perfume",
    description:
      "A refreshing oceanic scent with marine notes, grapefruit, rosemary, and driftwood for a breezy coastal vibe.",
    rating: 4.5,
    mainImage:
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=650",
    galleryImages: [
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=650",
    ],
    accords: [
      { name: "Aquatic", value: 94, color: "#29b6f6" },
      { name: "Citrus", value: 80, color: "#fbc02d" },
      { name: "Aromatic", value: 68, color: "#43a047" },
    ],
    fragranceProfile: {
      longevity: "5H",
      projection: "Moderate",
      sillage: "Light",
    },
    dayNight: "Day",
    seasons: ["Spring", "Summer"],
    notes: {
      top: [
        {
          name: "Grapefruit",
          iconUrl:
            "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Marine Accord",
          iconUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=150",
        },
      ],
      middle: [
        {
          name: "Rosemary",
          iconUrl:
            "https://images.unsplash.com/photo-1515516969-d4014cc0c997?auto=format&fit=crop&q=80&w=150",
        },
      ],
      base: [
        {
          name: "Driftwood",
          iconUrl:
            "https://images.unsplash.com/photo-1596541604085-f53856a9486c?auto=format&fit=crop&q=80&w=150",
        },
        {
          name: "Musk",
          iconUrl:
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
  },
];

const users: CreateUserDTO[] = [
  {
    username: "dave",
    role: "admin",
    password: "admin123",
  },
  {
    username: "test",
    role: "staff",
    password: "staff123",
  },
];

// ─── Run ─────────────────────────────────────────────────────────────────────

function seed() {
  // Make sure tables exist first
  createTables();

  // Wipe existing perfumes so we start clean each time
  db.prepare("DELETE FROM perfumes").run();
  console.log("🗑️  Cleared existing perfumes");

  // Insert each one
  for (const perfume of perfumes) {
    const created = createPerfume(perfume);
    console.log(`✅ Created: ${created.name} (${created.id})`);
  }
  for (const user of users) {
    const created = createUser(user);
    console.log(`Created: ${created.username} with ${created.id}`);
  }

  console.log(`\n🌱 Seeded ${perfumes.length} perfumes successfully`);
  process.exit(0);
}

seed();
