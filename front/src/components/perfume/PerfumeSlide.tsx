import React from 'react';
import { Perfume } from '../../types';
import { motion } from 'motion/react';
import { Star, Eye, Sparkles, Sun, Moon, Hourglass, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PerfumeSlideProps {
  perfume: Perfume;
  onNext?: () => void;
  onPrev?: () => void;
  colors: Record<string, string>;
  onInspect: () => void;
  isDarkMode?: boolean;
  hideNav?: boolean;
}

export default function PerfumeSlide({ perfume, onNext, onPrev, colors, onInspect, isDarkMode = false, hideNav = false }: PerfumeSlideProps) {
  // Collect a sample list of notes to showcase as tiny icons
  const listNotes = [
    ...perfume.notes.top,
    ...perfume.notes.middle,
    ...perfume.notes.base
  ].slice(0, 5);

  return (
    <div className="w-full flex-1 flex flex-col lg:flex-row rounded-3xl overflow-hidden border shadow-lg select-none transition-colors duration-300 bg-[#FAF9F5] border-[#ecebe7] text-[#111111] dark:bg-black dark:border-[#c19253]/25 dark:text-[#c19253]">
      
      {/* LEFT COLUMN: Visual Showcase & Ingredients (Top, Heart, Base snippets) */}
      <div className="w-full lg:w-[42%] p-6 sm:p-8 flex flex-col justify-between lg:border-b-0 lg:border-r relative border-b transition-colors duration-300 bg-[#f6f5f0] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/20">
        <div className="flex items-center justify-between">
          <span className="border px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider uppercase transition-colors bg-white/80 border-black/5 text-gray-500 dark:bg-black dark:border-[#c19253]/40 dark:text-[#c19253]">
            {perfume.code}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm border transition-colors bg-[#111111] text-[#c19253] border-transparent dark:bg-black dark:text-[#c19253] dark:border-[#c19253]/25">
            <Sparkles size={10} />
            {perfume.category}
          </div>
        </div>

        {/* Floating Flask with double gradient shadow effects */}
        <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
          <div className="relative w-full max-w-[130px] sm:max-w-[160px] lg:max-w-[190px] aspect-[1/1.2] flex items-center justify-center">
            {/* Blurry shadow asset representing luxurious depth behind the flask */}
            <motion.div
              layoutId={`image-shadow-${perfume.id}`}
              className="absolute w-[95%] h-[95%] blur-2xl rounded-full z-0 translate-y-3 bg-black/15 dark:bg-black/80"
            />
            
            <motion.img
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              src={perfume.mainImage}
              alt={perfume.name}
              className="w-full h-full object-cover rounded-2xl relative z-10 drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="mt-4 text-center z-10">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-xl lg:text-2xl font-serif font-black leading-none text-gray-800 dark:text-white">
                {perfume.rating.toFixed(1)}
              </span>
              <div className="flex gap-0.5 text-[#c19253]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < Math.floor(perfume.rating) ? "#c19253" : "transparent"}
                    className="text-[#c19253]"
                  />
                ))}
              </div>
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#c19253]">
              Curator rating
            </span>
          </div>
        </div>

        {/* Mini Ingredient Note Chips at Bottom */}
        <div className="p-3 rounded-2xl border shadow-sm transition-colors duration-300 bg-white/80 border-black/5 dark:bg-black dark:border-[#c19253]/20">
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-gray-400 mb-2 block">
            Highlight Ingredients
          </span>
          <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-start">
            {listNotes.map((note, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 w-12 flex-shrink-0">
                <div className="w-8 h-8 rounded-full overflow-hidden border p-0.5 shadow-sm transition-colors bg-white border-[#ecebe7] dark:bg-black dark:border-[#c19253]/30">
                  <img
                    src={note.iconUrl}
                    alt={note.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558223635-a6a9be78efaa?w=100';
                    }}
                  />
                </div>
                <span className="text-[8px] font-bold leading-tight truncate w-full text-center capitalize transition-colors text-gray-500 dark:text-gray-300">
                  {note.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Accords list, wear periods, action triggers */}
      <div className="w-full lg:w-[58%] p-6 sm:p-8 flex flex-col justify-between relative transition-colors duration-300 bg-white dark:bg-black animate-fade-in">
        <div className="space-y-6">
          
          {/* Header Title Information */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c19253] block mb-1">
              {perfume.brand}
            </span>
            <div className="flex items-start justify-between">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-none text-[#111111] dark:text-white">
                {perfume.name}
              </h2>
            </div>
          </div>

          {/* Accords dynamic segment blocks list */}
          <div className="space-y-3">
            <h4 className="text-[9px] uppercase tracking-[0.2em] font-extrabold transition-colors text-gray-400 dark:text-[#c19253]">
              Accords Spectrum
            </h4>
            <div className="space-y-3">
              {perfume.accords.slice(0, 4).map((accord, idx) => {
                const backgroundBar = colors[accord.name] || accord.color || '#ecebe7';
                return (
                  <div key={idx} className="space-y-1.5 animate-fade-in">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="font-extrabold uppercase tracking-wider transition-colors text-gray-700 dark:text-gray-200">
                        {accord.name}
                      </span>
                      <span className="font-mono font-bold px-2 py-0.5 rounded text-[10px] transition-all duration-300 text-gray-700 bg-gray-150/50 border border-black/5 dark:text-[#c19253] dark:bg-[#c19253]/10 dark:border dark:border-[#c19253]/20">
                        {accord.value}%
                      </span>
                    </div>
                    {/* Progress track matching the background aesthetics */}
                    <div className="h-2 w-full rounded-full overflow-hidden transition-colors duration-300 bg-gray-100 dark:bg-black/60 border dark:border-[#c19253]/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${accord.value}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: idx * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: backgroundBar }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats Grid: wear period split + longevity review */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Wear time display slider bar */}
            <div className="p-3 rounded-xl border transition-colors duration-300 bg-[#FAF9F5] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/20">
              <span className="text-[9px] tracking-wider uppercase font-bold text-[#c19253] block mb-1.5">
                Wear Period
              </span>
              <div className="flex gap-2 items-center">
                <Sun size={14} className={perfume.dayNight !== 'Night' ? "text-[#c19253]" : "text-gray-300"} />
                <div className="h-1 flex-1 rounded-full relative transition-colors bg-gray-200 dark:bg-gray-800">
                  <div
                    className={cn(
                      "h-full rounded-full transition-colors",
                      perfume.dayNight === 'Both' ? 'w-full' : 'w-1/2',
                      perfume.dayNight === 'Night' ? 'ml-auto' : '',
                      "bg-[#111111] dark:bg-[#c19253]"
                    )}
                  />
                </div>
                <Moon size={14} className={perfume.dayNight !== 'Day' ? "text-[#111111] dark:text-gray-200" : "text-gray-300"} />
              </div>
            </div>

            {/* Performance bullet */}
            <div className="p-3 rounded-xl border flex items-center gap-3 transition-colors duration-300 bg-[#FAF9F5] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/20">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-colors bg-white text-gray-500  dark:bg-black dark:border-[#c19253]/30 dark:text-[#c19253]">
                <Hourglass size={12} />
              </div>
              <div>
                <span className="block text-[8px] uppercase tracking-wider font-extrabold text-gray-400">
                  Longevity
                </span>
                <span className="text-xs font-bold transition-colors text-[#111111] dark:text-[#c19253]">
                  {perfume.fragranceProfile.longevity} duration
                </span>
              </div>
            </div>

          </div>

          {/* Seasons chips lines */}
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
              Optimal Seasons
            </h4>
            <div className="flex gap-2">
              {['Winter', 'Spring', 'Summer', 'Autumn'].map((s) => {
                const isActive = perfume.seasons.includes(s as any);
                return (
                  <span
                    key={s}
                    className={cn(
                      "flex-1 py-1 rounded-md text-[9px] text-center uppercase tracking-widest font-bold border transition-all duration-300",
                      isActive
                        ? "bg-[#111111] text-white border-black dark:bg-[#c19253] dark:text-black dark:border-transparent dark:font-black"
                        : "bg-[#fcfcfa] text-gray-300 border-[#f0eee8] dark:bg-black dark:text-gray-600 dark:border-[#c19253]/20"
                    )}
                  >
                    {s}
                  </span>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer actions block: Price tag and pagination triggers */}
        <div className="border-t pt-5 mt-6 flex flex-row items-center justify-between gap-4 transition-colors border-[#ecebe7] dark:border-[#c19253]/20">
          <div className="flex border rounded-xl overflow-hidden shadow-sm transition-colors duration-300 bg-[#fcfcfa] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/20">
            <div className="px-3 py-2.5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center transition-colors bg-black text-white dark:bg-[#c19253] dark:text-black">
              Investment
            </div>
            <div className="px-4 py-2.5 text-xs sm:text-sm font-serif font-black flex items-center justify-center min-w-[75px] sm:min-w-[95px] transition-colors bg-white text-gray-900 dark:bg-black dark:text-[#c19253]">
              {perfume.price.toLocaleString()} ETB
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={onInspect}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border font-bold uppercase tracking-widest text-[9px] sm:text-xs transition-colors duration-300 border-black/10 hover:border-black/30 hover:bg-gray-50 text-gray-700 dark:border-[#c19253]/30 dark:hover:border-[#c19253] dark:text-[#c19253] dark:hover:text-white dark:bg-black dark:hover:bg-[#c19253]/10"
            >
              <Eye size={12} />
              Inspect Blend
            </button>

            {!hideNav && (
              <div className="flex gap-1.5">
                <button
                  onClick={onPrev}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg hover:-translate-x-0.5 transition-all outline-none bg-[#111111] hover:bg-black text-white hover:text-[#c19253] dark:bg-[#c19253] dark:text-black dark:hover:bg-white"
                  title="Previous scent"
                >
                  <div className="rotate-180 flex"><ArrowRight size={16} /></div>
                </button>
                <button
                  onClick={onNext}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg hover:translate-x-0.5 transition-all outline-none bg-[#111111] hover:bg-black text-white hover:text-[#c19253] dark:bg-[#c19253] dark:text-black dark:hover:bg-white"
                  title="Next scent"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
