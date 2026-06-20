import {
  Award,
  Eye,
  Grid,
  Menu,
  Moon,
  PanelLeftOpen,
  Sparkles,
  Sun,
} from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

export const Header = ({
  setIsSidebarOpen,
  isSidebarVisible,
  setIsSidebarVisible,
  currentView,
  setSlideIndex,
  perfumes,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  return (
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
        <div className={cn("hidden lg:block", !isSidebarVisible && "pl-2")}>
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
            isDarkMode ? "Switch to Day Mode" : "Switch to Midnight Velvet Mode"
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
  );
};
