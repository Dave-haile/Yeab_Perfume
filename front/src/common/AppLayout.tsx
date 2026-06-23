import { useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "./AppContext";
import { Header } from "./Header";
import Sidebar from "./Sidebar";
import CategoryTabs from "../components/layout/CategoryTabs";
import TopTabs from "./TopTabs";
import PerfumeDetailsModal from "../components/perfume/PerfumeDetailsModal";

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isDarkMode,
    showFilters,
    activeCategory,
    setActiveCategory,
    activeGender,
    setActiveGender,
    inspectPerfume,
    setInspectPerfume,
    colors,
  } = useApp();

  const isAdminRoute = location.pathname.startsWith("/view/admin");

  // Keyboard shortcut: Ctrl+Shift+A → admin login
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        navigate("/admin/login");
      }
    },
    [navigate],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex h-screen overflow-hidden font-sans antialiased transition-colors duration-500 bg-primary text-[#111111] selection:bg-[#111111] selection:text-white dark:bg-black dark:text-[#c19253] dark:selection:bg-[#c19253] dark:selection:text-black">
      {/* Sidebar - always visible on desktop / slideout on mobile */}
      {!isAdminRoute && <Sidebar />}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative dark:bg-primary">
        {/* Header - hidden on admin route */}
        {!isAdminRoute && <Header />}

        {/* Custom Filter Drawer - only on catalog route */}
        {location.pathname === "/view/grid" && showFilters && (
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

        {/* Hidden click area to navigate to admin login (triple-click) */}
        <div
          className="absolute top-0 left-0 w-4 h-4 z-50 cursor-default opacity-0"
          onClick={() => navigate("/admin/login")}
          title="Admin access (hidden trigger)"
        />

        {/* Body content via nested routes */}
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0 relative bg-linear-to-b from-[#fdfdfc] to-[#fbf9f5] dark:from-black dark:to-black">
          <Outlet />
        </div>
      </main>

      {/* Detail inspector modal overlay */}
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
