import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Category } from "../types";
import { cn } from "../lib/utils";
import {
  Droplet,
  Gem,
  Star,
  Settings,
  Award,
  PanelLeftClose,
} from "lucide-react";

interface SidebarProps {
  activeCategory: Category | "All";
  setActiveCategory: (cat: Category | "All") => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  logo: string | null;
  onOpenAdmin?: () => void;
  currentView?:
    | "catalog"
    | "presenter"
    | "admin"
    | "brand-presenter"
    | "luxury-presenter";
  setCurrentView?: (
    view:
      | "catalog"
      | "presenter"
      | "admin"
      | "brand-presenter"
      | "luxury-presenter",
  ) => void;
  isDarkMode?: boolean;
  isSidebarVisible?: boolean;
  setIsSidebarVisible?: (visible: boolean) => void;
}

export default function Sidebar({
  activeCategory,
  setActiveCategory,
  isOpen,
  setIsOpen,
  logo,
  isDarkMode = false,
  isSidebarVisible = true,
  setIsSidebarVisible,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

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

  const categories: {
    id: "perfumes" | "brand_perfume" | "luxury_perfume";
    label: string;
    sub: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "perfumes",
      label: "Perfumes",
      sub: "The complete collection",
      icon: <Droplet size={16} />,
    },
    {
      id: "brand_perfume",
      label: "Brand Perfume",
      sub: "Scrollable presenter",
      icon: <Star size={16} />,
    },
    {
      id: "luxury_perfume",
      label: "Luxury Perfume",
      sub: "Luxury private presenter",
      icon: <Gem size={16} />,
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-8 px-6 font-sans transition-colors duration-300 border-r bg-primary border-custom text-primary dark:bg-primary dark:border-[#c19253]/20 dark:text-primary">
      <div className="space-y-10">
        {/* Close/Hide button for Sidebar on both desktop & mobile */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase">
            Yeab Menu
          </span>
          <button
            onClick={() => {
              setIsOpen(false);
              if (setIsSidebarVisible) {
                setIsSidebarVisible(false);
              }
            }}
            className="p-1.5 rounded-full transition-colors hover:bg-gray-200/50 dark:hover:bg-[#c19253]/10 text-[#111111] dark:text-white"
            title="Hide Sidebar"
          >
            <PanelLeftClose size={18} className="text-[#c19253]" />
          </button>
        </div>

        {/* Elegant Typographic Logo Header */}
        <div className="text-center flex flex-col items-center">
          <div className="mb-4 relative flex items-center justify-center">
            {logo ? (
              <img
                src={logo}
                alt="YEAB Logo"
                className="w-16 h-16 object-contain"
              />
            ) : (
              <div className="w-12 h-12 rounded-full border flex items-center justify-center shadow-sm transition-colors duration-300 bg-white border-black/10 dark:bg-black dark:border-[#c19253]/40">
                <Award size={24} className="text-[#c19253]" strokeWidth={1.5} />
              </div>
            )}
          </div>

          <div className="relative inline-block pb-3">
            {/* Individually styled letters for the 'YEAB' logo background plate */}
            <div className="flex justify-center gap-1 my-1">
              {["Y", "E", "A", "B"].map((letter, i) => (
                <span
                  key={i}
                  className="w-10 h-11 flex items-center justify-center font-serif text-2xl font-black rounded border transition-all duration-300 shadow-sm bg-[#111111] text-white border-black dark:bg-black dark:text-[#c19253] dark:border-[#c19253]/40"
                >
                  {letter}
                </span>
              ))}
            </div>
            <p className="text-[9px] tracking-[0.35em] font-bold uppercase text-[#c19253] mt-2">
              Luxury Perfumes
            </p>
            {/* Amharic name styled with a distinctive background capsule */}
            <span className="text-[11px] font-serif font-medium block mt-1.5 px-3 py-1 rounded-full shadow-xs border mx-auto w-fit bg-gray-50 text-gray-500 border-gray-100 dark:bg-black dark:text-[#c19253] dark:border-[#c19253]/30">
              የአብ ሽቶ
            </span>
            <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#c19253] to-transparent" />
          </div>
        </div>

        {/* Categories / Navigation Menu */}
        <div className="space-y-3">
          <p className="text-[9px] tracking-[0.25em] font-bold text-gray-400 uppercase pl-1">
            Collections
          </p>
          <nav className="space-y-1.5">
            {categories.map((cat) => {
              const isActive =
                (cat.id === "perfumes" && currentView === "catalog") ||
                (cat.id === "brand_perfume" &&
                  currentView === "brand-presenter") ||
                (cat.id === "luxury_perfume" &&
                  currentView === "luxury-presenter");
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === "perfumes") {
                      setActiveCategory("All");
                      navigate("/view/grid");
                    } else if (cat.id === "brand_perfume") {
                      navigate("/view/brand");
                    } else if (cat.id === "luxury_perfume") {
                      navigate("/view/luxury");
                    }
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 group",
                    isActive
                      ? "bg-[#111111] text-white shadow-xl shadow-black/10 translate-x-1 dark:bg-[#c19253] dark:text-black dark:shadow-xl dark:shadow-[#c19253]/20 dark:translate-x-1"
                      : "hover:bg-[#f3f2ee] text-gray-700 dark:hover:bg-[#c19253]/10 dark:text-gray-300",
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                      isActive
                        ? "bg-white/10 text-white dark:bg-black/10 dark:text-black"
                        : "bg-[#f3f2ee] text-gray-500 group-hover:bg-[#edebe6] dark:bg-black dark:text-gray-300 dark:group-hover:bg-[#c19253]/10",
                    )}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider leading-tight">
                      {cat.label}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] block",
                        isActive
                          ? "text-white/60 dark:text-black/80"
                          : "text-gray-400",
                      )}
                    >
                      {cat.sub}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Admin Atelier Entrance Footer */}
      <div className="space-y-3 border-t pt-6 border-[#ecebe7] dark:border-[#c19253]/25">
        <button
          onClick={() => {
            navigate("/view/admin");
            setIsOpen(false);
          }}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-300",
            currentView === "admin"
              ? "bg-[#c19253] text-[#09070f] dark:text-black shadow-lg shadow-[#c19253]/25 font-black"
              : "border border-[#e5e4de] hover:border-black/20 text-gray-500 hover:text-[#111111] bg-white hover:bg-gray-50 dark:border-[#c19253]/30 dark:hover:border-[#c19253] dark:text-gray-400 dark:hover:text-[#c19253] dark:bg-black dark:hover:bg-[#c19253]/10",
          )}
        >
          <Settings
            size={14}
            className={currentView === "admin" ? "animate-spin-slow" : ""}
          />
          Atelier formulation
        </button>
        <p className="text-[8px] text-center text-gray-400 font-medium font-mono uppercase tracking-widest">
          EST. 2026 • ADDIS ABABA
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Large screen left rail */}
      {isSidebarVisible && (
        <aside className="hidden lg:block w-[280px] h-full flex-shrink-0 z-10">
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Sidebar overlay slideout */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-[300px] max-w-[85vw] h-full shadow-2xl flex flex-col z-10 transition-transform">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
