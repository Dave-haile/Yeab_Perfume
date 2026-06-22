import React from 'react';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';
import { Category, Gender, Perfume } from '../types';
import PerfumeSlide from '../components/perfume/PerfumeSlide';

interface PresenterProps {
  filteredPerfumes: Perfume[];
  slideIndex: number;
  setSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  colors: Record<string, string>;
  isDarkMode: boolean;
  activeGender: Gender | 'All';
  activeCategory: Category | 'All';
  setActiveCategory: (cat: Category | 'All') => void;
  setActiveGender: (gender: Gender | 'All') => void;
  setSearchQuery: (query: string) => void;
  setInspectPerfume: (p: Perfume) => void;
}

export default function Presenter({
  filteredPerfumes,
  slideIndex,
  setSlideIndex,
  colors,
  isDarkMode,
  activeGender,
  activeCategory,
  setActiveCategory,
  setActiveGender,
  setSearchQuery,
  setInspectPerfume
}: PresenterProps) {
  
  const activeFiltersCount = 
    (activeCategory !== 'All' ? 1 : 0) + 
    (activeGender !== 'All' ? 1 : 0);

  const handleNextSlide = () => {
    if (filteredPerfumes.length === 0) return;
    setSlideIndex((prev) => (prev + 1) % filteredPerfumes.length);
  };

  const handlePrevSlide = () => {
    if (filteredPerfumes.length === 0) return;
    setSlideIndex((prev) => (prev - 1 + filteredPerfumes.length) % filteredPerfumes.length);
  };

  const currentSlidePerfume = filteredPerfumes[slideIndex] || filteredPerfumes[0];

  return (
    <motion.div
      key="catalog-presenter"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="p-6 md:p-10 lg:p-12 flex-1 flex flex-col items-center justify-center min-h-[500px]"
    >
      {filteredPerfumes.length > 0 && currentSlidePerfume ? (
        <div className="w-full max-w-4xl">
          {/* Active filter prompt snippet when slide presenter active */}
          {activeFiltersCount > 0 && (
            <div className="text-center mb-6 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
              Browsing {slideIndex + 1} of {filteredPerfumes.length} matching filters (
              {activeGender !== 'All' ? `${activeGender} Gender` : 'All Genders'} • {activeCategory} collection)
            </div>
          )}
          
          <PerfumeSlide
            perfume={currentSlidePerfume}
            colors={colors}
            onNext={handleNextSlide}
            onPrev={handlePrevSlide}
            onInspect={() => setInspectPerfume(currentSlidePerfume)}
            isDarkMode={isDarkMode}
          />
        </div>
      ) : (
        <div className="border p-12 rounded-3xl text-center max-w-md shadow-sm bg-[#FAF9F5] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/30">
          <Info className="text-[#c19253] mx-auto mb-4" size={24} />
          <h4 className="font-serif text-xl font-bold tracking-wide text-gray-900 dark:text-[#c19253] mb-2">
            Empty slide list
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            No perfumes active in the active category filters to build the slide presenter deck view.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setActiveGender('All');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all bg-black text-white dark:bg-[#c19253] dark:text-black"
          >
            Clear settings
          </button>
        </div>
      )}
    </motion.div>
  );
}
