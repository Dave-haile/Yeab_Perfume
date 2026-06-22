import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { usePerfumes, useAccordColors, useLogo } from "./lib/api";
import { Category, Gender, Perfume } from "./types";
import Sidebar from "./common/Sidebar";
import TopTabs from "./common/TopTabs";
import CategoryTabs from "./components/layout/CategoryTabs";
import PerfumeDetailsModal from "./components/perfume/PerfumeDetailsModal";
import { motion, AnimatePresence } from "motion/react";
import {
  Grid,
  Eye,
  Menu,
  Sparkles,
  SlidersHorizontal,
  Settings,
  Info,
  ShoppingCart,
  Award,
  Moon,
  Sun,
  PanelLeftOpen,
} from "lucide-react";
import { useTheme } from "./components/ThemeProvider";
import { cn } from "./lib/utils";

// Page Views
import CatalogGrid from "./views/CatalogGrid";
import Presenter from "./views/Presenter";
import BrandPresenter from "./views/BrandPresenter";
import LuxuryPresenter from "./views/LuxuryPresenter";
import Admin from "./views/Admin";
import { Header } from "./common/Header";

export default function App() {
  const { perfumes, loading, setPerfumes } = usePerfumes();
  const { colors, setColors } = useAccordColors();
  const { logo, setLogo } = useLogo();
  const { isDarkMode } = useTheme();
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Navigation state management
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [activeGender, setActiveGender] = useState<Gender | "All">("All");

  // High-level viewport derived from route path
  const currentView =
    location.pathname === "/view/presenter"
      ? "presenter"
      : location.pathname === "/view/brand"
        ? "brand-presenter"
        : location.pathname === "/view/luxury"
          ? "luxury-presenter"
          : location.pathname === "/view/admin"
            ? "admin"
            : "catalog";

  // Single slide deck indicator
  const [slideIndex, setSlideIndex] = useState(0);

  // Inspector modal focus slot
  const [inspectPerfume, setInspectPerfume] = useState<Perfume | null>(null);

  // Mobile drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Desktop sidebar visibility state
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Search input state for direct inventory filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [catalogView, setCatalogView] = useState(true);

  // Filter computation
  const filteredPerfumes = perfumes.filter((perfume) => {
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
  });

  return (
    <div className="flex h-screen overflow-hidden font-sans antialiased transition-colors duration-500 bg-primary text-[#111111] selection:bg-[#111111] selection:text-white dark:bg-black dark:text-[#c19253] dark:selection:bg-[#c19253] dark:selection:text-black">
      {/* PRIMARY VIEWER CONSOLE */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative dark:bg-primary">
        {/* UPPER MINIMALIST CONSOLE CONTROL BAR */}
        {currentView !== "admin" && (
          <Header
            currentView={currentView}
            isSidebarVisible={isSidebarVisible}
            perfumes={perfumes}
            setIsSidebarOpen={setIsSidebarOpen}
            setIsSidebarVisible={setIsSidebarVisible}
            setSlideIndex={setSlideIndex}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            setCatalogView={setCatalogView}
            catalogView={catalogView}
          />
        )}

        {/* CUSTOM FILTER DRAWER (GENDER & CATEGORY SELECTORS) - ONLY VISIBLE ON VIEWS CATALOG */}
        {currentView === "catalog" && showFilters && (
          <div className="border-b py-4 px-6 sm:px-8 flex flex-col md:flex-row md:flex-wrap items-center justify-between gap-4 z-10 shrink-0 select-none transition-colors duration-300 bg-white/40 border-[#ecebe7]/60 dark:bg-black dark:border-[#c19253]/20 w-full min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto min-w-0">
              <AnimatePresence mode="wait">
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto min-w-0"
                  >
                    <CategoryTabs
                      activeCategory={activeCategory}
                      setActiveCategory={setActiveCategory}
                      isDarkMode={isDarkMode}
                    />
                    <TopTabs
                      activeGender={activeGender}
                      setActiveGender={setActiveGender}
                      isDarkMode={isDarkMode}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* BODY CONSOLE CONTENT */}
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0 relative bg-linear-to-b from-[#fdfdfc] to-[#fbf9f5] dark:from-black dark:to-black">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Navigate to="/view/grid" replace />} />
              <Route
                path="/view/grid"
                element={
                  <CatalogGrid
                    filteredPerfumes={filteredPerfumes}
                    loading={loading}
                    colors={colors}
                    isDarkMode={isDarkMode}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    activeGender={activeGender}
                    setActiveGender={setActiveGender}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setInspectPerfume={setInspectPerfume}
                    catalogView={catalogView}
                  />
                }
              />
              <Route
                path="/view/presenter"
                element={
                  <Presenter
                    filteredPerfumes={filteredPerfumes}
                    slideIndex={slideIndex}
                    setSlideIndex={setSlideIndex}
                    colors={colors}
                    isDarkMode={isDarkMode}
                    activeGender={activeGender}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    setActiveGender={setActiveGender}
                    setSearchQuery={setSearchQuery}
                    setInspectPerfume={setInspectPerfume}
                  />
                }
              />
              <Route
                path="/view/brand"
                element={
                  <BrandPresenter
                    perfumes={perfumes}
                    colors={colors}
                    setInspectPerfume={setInspectPerfume}
                    isDarkMode={isDarkMode}
                  />
                }
              />
              <Route
                path="/view/luxury"
                element={
                  <LuxuryPresenter
                    perfumes={perfumes}
                    colors={colors}
                    setInspectPerfume={setInspectPerfume}
                    isDarkMode={isDarkMode}
                  />
                }
              />
              <Route
                path="/view/admin"
                element={
                  <Admin
                    perfumes={perfumes}
                    setPerfumes={setPerfumes}
                    colors={colors}
                    setColors={setColors}
                    logo={logo}
                    setLogo={setLogo}
                    isDarkMode={isDarkMode}
                  />
                }
              />
              {/* Fallback pattern redirecting safely home to grid */}
              <Route path="*" element={<Navigate to="/view/grid" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>

      {/* DETAIL SPECTRUM MODAL INSPECTOR OVERLAY */}
      <AnimatePresence>
        {inspectPerfume && (
          <PerfumeDetailsModal
            perfume={inspectPerfume}
            colors={colors}
            onClose={() => setInspectPerfume(null)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
