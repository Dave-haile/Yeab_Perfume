import React, { useEffect } from 'react';
import { Perfume } from '../../types';
import { motion } from 'motion/react';
import { X, Star, Flame, Wind, Clock, Sun, Moon, Sparkles, Award } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PerfumeDetailsModalProps {
  perfume: Perfume;
  onClose: () => void;
  colors: Record<string, string>;
  isDarkMode?: boolean;
}

export default function PerfumeDetailsModal({ perfume, onClose, colors, isDarkMode = false }: PerfumeDetailsModalProps) {
  useEffect(() => {
    // Disable background scroll when modal open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
      {/* Soft Blurred Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        layoutId={`card-${perfume.id}`}
        className="relative w-full max-w-5xl h-full max-h-[85vh] lg:max-h-[90vh] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden z-10 border transition-all duration-300 bg-white border-[#ecebe7] text-[#111111] dark:bg-black dark:border-[#c19253]/25 dark:text-[#c19253]"
      >
        {/* Absolute Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md border bg-white/80 hover:bg-white text-[#111111] border-black/5 dark:bg-black dark:hover:bg-[#c19253]/20 dark:text-[#c19253] dark:border-[#c19253]/30"
        >
          <X size={18} />
        </button>

        {/* Left pane - Perfume Visual Representation */}
        <div className="w-full md:w-[45%] flex flex-col justify-between p-8 md:border-b-0 md:border-r relative overflow-hidden select-none border-b bg-[#fcfbfa] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/20">
          {/* Subtle logo vector watermark in the background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-150 font-serif font-black select-none text-[150px] transition-all duration-300 text-black opacity-[0.03] dark:text-[#c19253] dark:opacity-[0.02]">
            YEAB
          </div>

          <div className="self-start px-3 py-1 rounded text-[9px] font-mono font-black tracking-widest border uppercase bg-white text-gray-500 border-black/5 dark:bg-black dark:text-[#c19253] dark:border-[#c19253]/35">
            {perfume.code}
          </div>

          {/* Centered Flask Image */}
          <div className="flex-1 flex items-center justify-center py-6 w-full h-full max-h-[320px] overflow-hidden rounded-2xl">
            <motion.img
              layoutId={`image-${perfume.id}`}
              src={perfume.mainImage}
              alt={perfume.name}
              className="w-full h-full object-cover rounded-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Pricing & Brand details with luxury golden and text letter backings */}
          <div className="text-center pt-4 z-10">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c19253] block mb-1">
              Atelier formulation
            </span>
            <h2 className="font-serif text-3xl font-bold leading-tight mb-2 text-[#111111] dark:text-[#c19253]">
              {perfume.name}
            </h2>
            <p className="text-xs uppercase tracking-widest font-bold mb-6 text-gray-400">
              <span className="px-2.5 py-1 rounded-full border transition-colors bg-transparent border-transparent dark:bg-black dark:border-[#c19253]/30 dark:text-[#c19253]">
                {perfume.brand}
              </span>
            </p>

            <div className="px-6 py-3.5 rounded-2xl flex items-center justify-between shadow-xl shadow-black/10 transition-colors duration-300 bg-[#111111] text-white dark:bg-black dark:border dark:border-[#c19253]/45 dark:text-[#c19253]">
              <span className="text-[10px] tracking-widest text-[#c19253] font-bold uppercase">
                Acreage Price
              </span>
              <span className="font-serif text-base font-black tracking-wider text-[#c19253]">
                {perfume.price.toLocaleString()} ETB
              </span>
            </div>
          </div>
        </div>

        {/* Right pane - Detailed Fragrance Profile Scroll area */}
        <div className="w-full md:w-[55%] flex flex-col h-full transition-colors duration-300 bg-white dark:bg-black">
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-8 custom-scrollbar">
            
            {/* Description card */}
            <div>
              <p className="text-xs sm:text-sm leading-relaxed italic border-l-2 border-[#c19253] pl-4 transition-colors text-gray-600 dark:text-gray-300">
                "{perfume.description}"
              </p>
            </div>

            {/* Olfactory Accords Gauge lines */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-extrabold mb-4 flex items-center gap-2 transition-colors text-[#111111] dark:text-[#c19253]">
                <Sparkles size={14} className="text-[#c19253]" />
                Main accords
              </h3>
              <div className="space-y-3.5">
                {perfume.accords.map((accord, idx) => {
                  const barColor = colors[accord.name] || accord.color || '#ecebe7';
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] sm:text-xs">
                        <span className="font-extrabold uppercase tracking-wider transition-colors text-gray-700 dark:text-gray-200">
                          {accord.name}
                        </span>
                        <span className="font-mono font-bold px-2 py-0.5 rounded text-[10px] transition-all duration-300 text-gray-700 bg-gray-150/50 border border-black/5 dark:text-[#c19253] dark:bg-[#c19253]/10 dark:border dark:border-[#c19253]/20">
                          {accord.value}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full overflow-hidden transition-colors bg-gray-100 dark:bg-black border dark:border-[#c19253]/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${accord.value}%` }}
                          transition={{ duration: 1.2, delay: idx * 0.05, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: barColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Indicators Grid */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-extrabold mb-4 flex items-center gap-2 transition-colors text-[#111111] dark:text-[#c19253]">
                <Award size={14} className="text-[#c19253]" />
                Performance metrics
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="p-3.5 rounded-xl border flex items-center gap-3 transition-colors duration-300 bg-[#FAF9F5] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/20">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-colors bg-white border-black/[0.03] text-gray-600 dark:bg-black dark:border-[#c19253]/30 dark:text-[#c19253]">
                    <Clock size={14} />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                      Longevity
                    </span>
                    <span className="text-xs font-bold transition-colors text-[#111111] dark:text-[#c19253]">
                      {perfume.fragranceProfile.longevity}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border flex items-center gap-3 transition-colors duration-300 bg-[#FAF9F5] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/20">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-colors bg-white border-black/[0.03] text-gray-600 dark:bg-black dark:border-[#c19253]/30 dark:text-[#c19253]">
                    <Flame size={14} />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                      Projection
                    </span>
                    <span className="text-xs font-bold transition-colors text-[#111111] dark:text-[#c19253]">
                      {perfume.fragranceProfile.projection}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 lg:col-span-1 p-3.5 rounded-xl border flex items-center gap-3 transition-colors duration-300 bg-[#FAF9F5] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/20">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-colors bg-white border-black/[0.03] text-gray-600 dark:bg-black dark:border-[#c19253]/30 dark:text-[#c19253]">
                    <Wind size={14} />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                      Sillage
                    </span>
                    <span className="text-xs font-bold transition-colors text-[#111111] dark:text-[#c19253]">
                      {perfume.fragranceProfile.sillage}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wear Time & Seasons Split Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[10px] tracking-wider uppercase font-extrabold text-gray-400 mb-3 block">
                  Best Wear Time
                </h4>
                <div className="flex gap-2">
                  <div
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border text-xs font-bold transition-all shadow-sm",
                      perfume.dayNight !== 'Night'
                        ? "bg-[#fffdeb] border-[#fbeb66] text-[#c0a200] dark:bg-[#c19253]/15 dark:border-[#c19253]/45 dark:text-[#c19253]"
                        : "bg-gray-50 border-gray-100 text-gray-300 dark:bg-black dark:border-gray-800 dark:text-gray-500"
                    )}
                  >
                    <Sun size={14} /> Day
                  </div>
                  <div
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border text-xs font-bold transition-all shadow-sm",
                      perfume.dayNight !== 'Day'
                        ? "bg-[#161a29] border-[#22293e] text-white dark:bg-[#c19253] dark:border-transparent dark:text-black dark:font-black"
                        : "bg-gray-50 border-gray-100 text-gray-300 dark:bg-black dark:border-gray-800 dark:text-gray-500"
                    )}
                  >
                    <Moon size={14} /> Night
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] tracking-wider uppercase font-extrabold text-gray-400 mb-3 block">
                  Best Seasons
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Winter', 'Spring', 'Summer', 'Autumn'].map((season) => {
                    const isWearing = perfume.seasons.includes(season as any);
                    return (
                      <div
                        key={season}
                        className={cn(
                          "py-2 px-1 text-center rounded-lg text-[10px] font-bold border uppercase tracking-wider transition-all",
                          isWearing
                            ? "bg-white border-[#111111] text-[#111111] shadow-sm font-black dark:bg-[#c19253] dark:border-transparent dark:text-black"
                            : "bg-[#fcfcfa] text-gray-300 border-[#f3f2ee] dark:bg-black dark:text-gray-600 dark:border-[#c19253]/20"
                        )}
                      >
                        {season}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interactive Notes Section */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-extrabold mb-4 flex items-center gap-2 transition-colors text-[#111111] dark:text-[#c19253]">
                <Sparkles size={14} className="text-[#c19253]" />
                Fragrance Note Composition
              </h3>
              <div className="space-y-6">
                <NotesSubtier title="Top Notes" subtitle="First impression (0-30 mins)" notes={perfume.notes.top} isDarkMode={isDarkMode} />
                <NotesSubtier title="Heart Notes" subtitle="Core signature (1 hr-4 hrs)" notes={perfume.notes.middle} isDarkMode={isDarkMode} />
                <NotesSubtier title="Base Notes" subtitle="Lasting sillage (4 hrs-12 hrs)" notes={perfume.notes.base} isDarkMode={isDarkMode} />
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

function NotesSubtier({ title, subtitle, notes, isDarkMode }: { title: string; subtitle: string; notes: { name: string; iconUrl: string }[]; isDarkMode: boolean }) {
  if (!notes || notes.length === 0) return null;
  return (
    <div className="border p-5 rounded-2xl transition-colors duration-300 bg-[#fcfcfa] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/25">
      <div className="mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-wider leading-none mb-1 transition-colors text-[#111111] dark:text-[#c19253]">
          {title}
        </h4>
        <span className="text-[9px] text-gray-400 font-mono tracking-wide">
          {subtitle}
        </span>
      </div>
      <div className="flex flex-wrap gap-4">
        {notes.map((note, index) => (
          <div key={index} className="flex flex-col items-center gap-1.5 w-16">
            <div className="w-12 h-12 rounded-full overflow-hidden border flex items-center justify-center p-0.5 shadow-sm hover:scale-105 transition-transform duration-300 bg-white border-[#e5e4de] dark:bg-black dark:border-[#c19253]/35">
              <img
                src={note.iconUrl}
                alt={note.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558223635-a6a9be78efaa?w=100';
                }}
              />
            </div>
            <span className="text-[10px] font-bold text-center leading-tight truncate w-full capitalize transition-colors text-gray-600 dark:text-gray-300">
              {note.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
