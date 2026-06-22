import React from 'react';
import { Perfume } from '../../types';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PerfumeCardProps {
  perfume: Perfume;
  onClick: () => void;
  colors: Record<string, string>;
  isDarkMode?: boolean;
}

export const PerfumeCard: React.FC<PerfumeCardProps> = ({ perfume, onClick, colors, isDarkMode = false }) => {
  return (
    <motion.div
      layoutId={`card-${perfume.id}`}
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer flex flex-col rounded-2xl p-4 border transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5",
        "bg-white hover:bg-[#fafafa] text-[#111111] border-[#ecebe7] hover:border-black/30",
        "dark:bg-black dark:hover:bg-[#c19253]/5 dark:text-[#c19253] dark:border-[#c19253]/20 dark:hover:border-[#c19253]/45 dark:hover:shadow-[#c19253]/5"
      )}
      whileTap={{ scale: 0.98 }}
    >
      {/* Editorial Catalog Code Tag with modern background backing */}
      <span className="absolute top-6 left-6 z-10 border px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-wider shadow-sm bg-white/90 border-black/5 text-gray-500 dark:bg-black dark:border-[#c19253]/35 dark:text-[#c19253]">
        {perfume.code}
      </span>

      {/* Main Imagery Area */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4.5 flex items-center justify-center border bg-[#fbfbfa] border-black/5 dark:bg-black dark:border-[#c19253]/20">
        <motion.img
          layoutId={`image-${perfume.id}`}
          src={perfume.mainImage}
          alt={perfume.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Accords dynamic bar layout on absolute overlay bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-1 justify-center z-10 opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-500">
          {perfume.accords.slice(0, 3).map((accord, idx) => {
            const barBg = colors[accord.name] || accord.color || '#ecebe7';
            return (
              <div
                key={idx}
                className="h-1 flex-1 rounded-full overflow-hidden bg-black/5 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${accord.value}%` }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: barBg }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Meta details with luxury text backgrounds */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] px-2 py-0.5 rounded transition-all duration-300 text-[#c19253] bg-transparent border border-transparent dark:bg-black dark:border-[#c19253]/20">
              {perfume.brand}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-500 bg-[#f7f5ef] dark:text-[#c19253] dark:bg-black dark:border dark:border-[#c19253]/20">
              <Star size={10} className="fill-[#c19253] text-[#c19253]" />
              <span>{perfume.rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="font-serif text-lg font-bold leading-tight mb-2 transition-colors line-clamp-2 text-[#111111] group-hover:text-[#c19253] dark:text-[#c19253] dark:group-hover:text-[#c19253]">
            {perfume.name}
          </h3>
        </div>

        <div>
          {/* Subtle Accords list Pills */}
          <div className="flex flex-wrap gap-1 mb-4">
            {perfume.accords.slice(0, 3).map((accord, idx) => (
              <span
                key={idx}
                className="text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border transition-all duration-300 bg-[#f3f2ee] text-gray-500 border-black/[0.02] dark:bg-black dark:text-gray-300 dark:border-[#c19253]/20"
              >
                {accord.name}
              </span>
            ))}
          </div>

          {/* Pricing Row with brand value representation backing */}
          <div className="flex items-center justify-between border-t pt-3.5 mt-2 transition-colors duration-300 border-[#ecebe7] dark:border-[#c19253]/20">
            <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-bold">
              Investment
            </span>
            <span className="text-xs font-serif font-black tracking-wide border-b pb-0.5 px-2 py-0.5 rounded transition-all duration-300 text-[#111111] bg-transparent border-gray-200 group-hover:border-[#111111] dark:text-[#c19253] dark:bg-[#c19253]/15 dark:border-transparent dark:group-hover:bg-[#c19253]/25">
              {perfume.price.toLocaleString()} ETB
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
