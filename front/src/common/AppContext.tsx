import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { usePerfumes, useAccordColors, useLogo } from "../lib/api";
import { useTheme } from "../components/ThemeProvider";
import { Category, Gender, Perfume } from "../types";

interface AppContextValue {
  // Data
  perfumes: Perfume[];
  loading: boolean;
  setPerfumes: ReturnType<typeof usePerfumes>["setPerfumes"];
  colors: Record<string, string>;
  setColors: ReturnType<typeof useAccordColors>["setColors"];
  logo: string | null;
  setLogo: ReturnType<typeof useLogo>["setLogo"];
  isDarkMode: boolean;

  // Filters
  activeCategory: Category | "All";
  setActiveCategory: (cat: Category | "All") => void;
  activeGender: Gender | "All";
  setActiveGender: (gender: Gender | "All") => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Derived
  filteredPerfumes: Perfume[];

  // Catalog view toggle (gallery vs grid)
  catalogView: boolean;
  setCatalogView: (v: boolean) => void;

  // Slide presenter
  slideIndex: number;
  setSlideIndex: (n: number | ((prev: number) => number)) => void;

  // Sidebar
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  isSidebarVisible: boolean;
  setIsSidebarVisible: (v: boolean) => void;

  // Inspector modal
  inspectPerfume: Perfume | null;
  setInspectPerfume: (p: Perfume | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { perfumes, loading, setPerfumes } = usePerfumes();
  const { colors, setColors } = useAccordColors();
  const { logo, setLogo } = useLogo();
  const { isDarkMode } = useTheme();

  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [activeGender, setActiveGender] = useState<Gender | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [catalogView, setCatalogView] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [inspectPerfume, setInspectPerfume] = useState<Perfume | null>(null);

  const filteredPerfumes = useMemo(
    () =>
      perfumes.filter((perfume) => {
        const matchesCategory =
          activeCategory === "All" ? true : perfume.category === activeCategory;
        const matchesGender =
          activeGender === "All" ? true : perfume.gender === activeGender;
        const matchesSearch =
          searchQuery.trim() === ""
            ? true
            : perfume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              perfume.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
              perfume.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesGender && matchesSearch;
      }),
    [perfumes, activeCategory, activeGender, searchQuery],
  );

  const value: AppContextValue = {
    perfumes,
    loading,
    setPerfumes,
    colors,
    setColors,
    logo,
    setLogo,
    isDarkMode,
    activeCategory,
    setActiveCategory,
    activeGender,
    setActiveGender,
    showFilters,
    setShowFilters,
    searchQuery,
    setSearchQuery,
    filteredPerfumes,
    catalogView,
    setCatalogView,
    slideIndex,
    setSlideIndex,
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarVisible,
    setIsSidebarVisible,
    inspectPerfume,
    setInspectPerfume,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx;
}
