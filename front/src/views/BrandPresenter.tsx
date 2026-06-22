import React from 'react';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';
import { Perfume } from '../types';
import PerfumeSlide from '../components/perfume/PerfumeSlide';

interface BrandPresenterProps {
  perfumes: Perfume[];
  colors: Record<string, string>;
  setInspectPerfume: (p: Perfume) => void;
  isDarkMode: boolean;
}

export default function BrandPresenter({
  perfumes,
  colors,
  setInspectPerfume,
  isDarkMode
}: BrandPresenterProps) {
  const brandPerfumes = perfumes.filter(p => p.category === 'Brand Perfume');

  return (
    <motion.div
      key="brand-presenter"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="p-6 md:p-10 lg:p-12 flex-1 flex flex-col gap-8 overflow-y-auto"
    >
      <div className="text-center space-y-2 mb-4">
        <span className="text-[10px] tracking-[0.3em] font-extrabold uppercase text-[#c19253] block">
          Designer Prestige Showcase
        </span>
        <h3 className="font-serif text-3xl font-bold text-gray-900 dark:text-[#c19253]">
          Brand Perfume Collections
        </h3>
        <div className="h-[1px] w-24 bg-[#c19253] mx-auto mt-2" />
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Scroll through our masterfully captured designer house blends with complex fragrance notes and profiles.
        </p>
      </div>

      {brandPerfumes.length > 0 ? (
        <div className="flex flex-col gap-10 w-full max-w-4xl mx-auto pb-16">
          {brandPerfumes.map((perfume) => (
            <div key={perfume.id} className="transition-all duration-300 hover:translate-y-[-2px]">
              <PerfumeSlide
                perfume={perfume}
                colors={colors}
                onInspect={() => setInspectPerfume(perfume)}
                isDarkMode={isDarkMode}
                hideNav={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed p-16 rounded-3xl text-center max-w-xl mx-auto my-12 bg-[#FAF9F5] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/30">
          <Info className="text-gray-300 mb-4 mx-auto" size={32} />
          <h4 className="font-serif text-2xl font-bold mb-2 text-gray-950 dark:text-[#c19253]">
            No Brand Blends Found
          </h4>
          <p className="text-xs leading-relaxed mb-6 text-gray-500 dark:text-gray-400">
            No brand perfumes are currently formulated. Add a custom Designer Prestige row inside the formulations atelier portal.
          </p>
        </div>
      )}
    </motion.div>
  );
}
