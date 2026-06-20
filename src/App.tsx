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

export default function App() {
  const { perfumes, loading, setPerfumes } = usePerfumes();
  const { colors, setColors } = useAccordColors();
  const { logo, setLogo } = useLogo();
  const { isDarkMode, toggleTheme } = useTheme();

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
          <header className="h-20 border-b flex items-center justify-between px-6 sm:px-8 z-20 flex-shrink-0 select-none transition-colors duration-300 bg-white/80 border-[#ecebe7] text-[#111111] dark:bg-black dark:border-[#c19253]/20 dark:text-[#c19253]">
            <div className="flex items-center gap-4">
              {/* Hamburger button for smaller layout devices */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl transition-colors hover:bg-gray-100 text-[#111111] dark:hover:bg-[#c19253]/10 dark:text-[#c19253]"
                title="Open atelier filters"
              >
                <Menu size={20} />
              </button>

              {/* Sidebar Toggle for Desktop/Large screens when hidden */}
              {!isSidebarVisible && (
                <button
                  onClick={() => setIsSidebarVisible(true)}
                  className="hidden lg:flex items-center gap-2 p-2.5 -ml-2 rounded-xl border border-dashed border-[#ecebe7] bg-white/40 backdrop-blur-md transition-all hover:bg-gray-50 text-[#111111] dark:bg-black/40 dark:hover:bg-[#c19253]/10 dark:border-[#c19253]/35 dark:text-[#c19253]"
                  title="Show Sidebar"
                >
                  <PanelLeftOpen size={18} />
                  <span className="text-[10px] tracking-widest font-extrabold uppercase">
                    Show Menu
                  </span>
                </button>
              )}

              {/* Quick Title Branding Indicator */}
              <div
                className={cn("hidden lg:block", !isSidebarVisible && "pl-2")}
              >
                <span className="text-[10px] tracking-[0.25em] font-extrabold block uppercase text-gray-400 dark:text-[#c19253]/60">
                  Yeab Perfumes
                </span>
                <h2 className="font-serif text-lg font-bold text-gray-700 dark:text-white/90">
                  {currentView === "catalog"
                    ? "Atelier Collection List"
                    : currentView === "brand-presenter"
                      ? "Designer Brand Showcase"
                      : currentView === "luxury-presenter"
                        ? "Private Luxury Showcase"
                        : currentView === "presenter"
                          ? "Featured Scent Presenter"
                          : "Master Atelier Workspace"}
                </h2>
              </div>
            </div>

            {/* VIEW MODE toggling pills & Theme Toggle */}
            <div className="flex items-center gap-3 max-w-full">
              <div className="p-1 rounded-full flex gap-1 border shadow-inner transition-colors duration-300 bg-[#f0eee8] border-black/[0.03] dark:bg-black dark:border-[#c19253]/20 max-w-full overflow-x-auto luxury-scrollbar whitespace-nowrap">
                <button
                  onClick={() => {
                    navigate("/view/grid");
                    setSlideIndex(0);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                    currentView === "catalog"
                      ? "bg-white text-[#111111] shadow-sm font-black dark:bg-[#c19253] dark:text-black dark:shadow-sm dark:font-black"
                      : "text-gray-400 hover:text-black dark:text-[#c19253]/60 dark:hover:text-[#c19253]",
                  )}
                >
                  <Grid size={12} />
                  Gallery Grid
                </button>
                <button
                  onClick={() => {
                    navigate("/view/presenter");
                    setSlideIndex(0);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                    currentView === "presenter"
                      ? "bg-white text-[#111111] shadow-sm font-black dark:bg-[#c19253] dark:text-black dark:shadow-sm dark:font-black"
                      : "text-gray-400 hover:text-black dark:text-[#c19253]/60 dark:hover:text-[#c19253]",
                  )}
                >
                  <Eye size={12} />
                  Featured Presenter
                </button>
                <button
                  onClick={() => {
                    navigate("/view/brand");
                    setSlideIndex(0);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                    currentView === "brand-presenter"
                      ? "bg-white text-[#111111] shadow-sm font-black dark:bg-[#c19253] dark:text-black dark:shadow-sm dark:font-black"
                      : "text-gray-400 hover:text-black dark:text-[#c19253]/60 dark:hover:text-[#c19253]",
                  )}
                >
                  <Sparkles size={12} />
                  Brand Presenter
                </button>
                <button
                  onClick={() => {
                    navigate("/view/luxury");
                    setSlideIndex(0);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                    currentView === "luxury-presenter"
                      ? "bg-white text-[#111111] shadow-sm font-black dark:bg-[#c19253] dark:text-black dark:shadow-sm dark:font-black"
                      : "text-gray-400 hover:text-black dark:text-[#c19253]/60 dark:hover:text-[#c19253]",
                  )}
                >
                  <Award size={12} />
                  Luxury Presenter
                </button>
              </div>

              {/* Visual indicators */}
              <div className="hidden sm:flex h-10 px-4 rounded-xl border items-center gap-2 text-[11px] font-bold transition-all duration-300 bg-[#FAF9F5] border-[#ecebe7] text-gray-600 dark:bg-black dark:border-[#c19253]/20 dark:text-[#c19253]">
                <Sparkles size={12} className="text-[#c19253]" />
                <span>{perfumes.length} Fragrances</span>
              </div>

              {/* Theme switcher */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 shadow-sm bg-[#FAF9F5] border-[#ecebe7] text-gray-600 hover:bg-gray-100 dark:bg-black dark:border-[#c19253]/30 dark:text-[#c19253] dark:hover:bg-[#c19253]/10"
                title={
                  isDarkMode
                    ? "Switch to Day Mode"
                    : "Switch to Midnight Velvet Mode"
                }
              >
                {isDarkMode ? (
                  <Sun size={15} className="text-amber-400 animate-spin-slow" />
                ) : (
                  <Moon size={15} className="text-[#111111]" />
                )}
              </button>
            </div>
          </header>
        )}

        {/* CUSTOM FILTER DRAWER (GENDER & CATEGORY SELECTORS) - ONLY VISIBLE ON VIEWS CATALOG */}
        {currentView === "catalog" && (
          <div className="border-b py-4 px-6 sm:px-8 flex flex-col md:flex-row md:flex-wrap items-center justify-between gap-4 z-10 shrink-0 select-none transition-colors duration-300 bg-white/40 border-[#ecebe7]/60 dark:bg-black dark:border-[#c19253]/20 w-full min-w-0">
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto min-w-0">
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
            </div>

            {/* Filter Search Input */}
            <div className="w-full sm:w-72 relative shrink-0">
              <input
                type="text"
                placeholder="Search scent notes or names... sss"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border px-4 py-2 rounded-xl text-xs font-bold outline-none transition-all pr-12 bg-[#fcfcfa] border-[#ecebe7] text-gray-700 focus:border-[#c19253] dark:bg-black dark:border-[#c19253]/35 dark:text-white dark:focus:border-[#c19253]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-mono tracking-wider select-none font-bold">
                Ctrl K
              </span>
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
