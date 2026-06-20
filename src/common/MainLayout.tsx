import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Category } from "../types";
import { useLogo } from "../lib/api";
import { useTheme } from "../components/ThemeProvider";
// import Header from "../Header";
// import Breadcrumbs from "../Breadcrumbs";

const MainLayout: React.FC<{
  children: React.ReactNode;
  fullWidth?: boolean;
}> = ({ children, fullWidth = false }) => {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [, setSlideIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logo } = useLogo();
  const { isDarkMode } = useTheme();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeCategory={activeCategory}
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          setSlideIndex(0);
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        logo={logo}
        isDarkMode={isDarkMode}
      />

      <main
        className={`flex-1 transition-all duration-300 bg-slate-50 dark:bg-slate-950 min-h-screen ${isSidebarOpen ? "lg:ml-14" : "lg:ml-48"}`}
      >
        <div
          className={`${fullWidth ? "w-full" : "max-w-384 mx-auto"} p-2.5 md:p-5`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
