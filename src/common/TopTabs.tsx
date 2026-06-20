import { Gender } from "../types";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

interface TopTabsProps {
  activeGender: Gender | "All";
  setActiveGender: (gender: Gender | "All") => void;
  isDarkMode?: boolean;
}

export default function TopTabs({
  activeGender,
  setActiveGender,
  isDarkMode = false,
}: TopTabsProps) {
  const tabs: { value: Gender | "All"; label: string }[] = [
    { value: "All", label: "All Audianc" },
    { value: "Male", label: "Masculine" },
    { value: "Female", label: "Feminine" },
    { value: "Unisex", label: "Unisex Blend" },
    { value: "Kids", label: "Children" },
  ];

  return (
    <div className="p-1.5 rounded-full flex gap-1 w-fit max-w-full overflow-x-auto luxury-scrollbar border shadow-sm transition-all duration-300 bg-[#f0eee8]/50 backdrop-blur-md border-white/50 text-[#111111] dark:bg-black/50 dark:backdrop-blur-md dark:border-[#c19253]/25 dark:text-[#c19253]">
      {tabs.map((tab) => {
        const isActive = activeGender === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => setActiveGender(tab.value)}
            className={cn(
              "relative px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap focus:outline-none",
              isActive
                ? "text-white dark:text-black"
                : "text-gray-500 hover:text-[#111111] dark:hover:text-[#c19253]/90 hover:bg-gray-100/30 dark:hover:bg-[#c19253]/10",
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTopTab"
                className="absolute inset-0 rounded-full shadow-md z-0 bg-[#111111] dark:bg-[#c19253]"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
