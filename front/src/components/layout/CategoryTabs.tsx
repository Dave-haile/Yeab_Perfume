import { Category } from '../../types';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface CategoryTabsProps {
  activeCategory: Category | 'All';
  setActiveCategory: (category: Category | 'All') => void;
  isDarkMode?: boolean;
}

export default function CategoryTabs({ activeCategory, setActiveCategory, isDarkMode = false }: CategoryTabsProps) {
  const tabs: { value: Category | 'All'; label: string }[] = [
    { value: 'All', label: 'All Formulations' },
    { value: 'Perfume', label: 'Signature Line' },
    { value: 'Brand Perfume', label: 'Designer Prestige' },
    { value: 'Luxury Perfume', label: 'Exclusive Private' },
  ];

  return (
    <div className="p-1.5 rounded-full flex gap-1 w-fit max-w-full overflow-x-auto luxury-scrollbar border shadow-sm transition-all duration-300 bg-[#f0eee8]/50 backdrop-blur-md border-white/50 text-[#111111] dark:bg-black/50 dark:backdrop-blur-md dark:border-[#c19253]/25 dark:text-[#c19253]">
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => setActiveCategory(tab.value)}
            className={cn(
              "relative px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap focus:outline-none",
              isActive 
                ? "text-white dark:text-black" 
                : "text-gray-500 hover:text-[#111111] dark:hover:text-[#c19253]/90 hover:bg-gray-100/30 dark:hover:bg-[#c19253]/10"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategoryTab"
                className="absolute inset-0 rounded-full shadow-md z-0 bg-[#111111] dark:bg-[#c19253]"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
