import React from "react";
import { motion } from "motion/react";
import { SlidersHorizontal, Info } from "lucide-react";
import { useApp } from "../common/AppContext";
import HorizontalSyncGallery from "../components/perfume/HorizontalSyncGallery";
import { PerfumeCard } from "../components/perfume/PerfumeCard";

export default function CatalogGrid() {
  const {
    filteredPerfumes,
    loading,
    colors,
    isDarkMode,
    activeCategory,
    setActiveCategory,
    activeGender,
    setActiveGender,
    searchQuery,
    setSearchQuery,
    setInspectPerfume,
    catalogView,
  } = useApp();

  const activeFiltersCount =
    (activeCategory !== "All" ? 1 : 0) +
    (activeGender !== "All" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  return (
    <motion.div
      key="catalog-gallery"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col gap-10"
    >
      <div className="space-y-10">
        {/* Active filters indicators readout */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-3 bg-transparent p-0">
            <span className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 text-gray-400">
              <SlidersHorizontal size={12} />
              Active constraints
            </span>

            {activeCategory !== "All" && (
              <span className="text-[9px] uppercase font-bold px-3 py-1 bg-[#c19253] text-black rounded-full tracking-wider shadow-xs">
                Collection: {activeCategory}
              </span>
            )}
            {activeGender !== "All" && (
              <span className="text-[9px] uppercase font-bold px-3 py-1 bg-black text-white dark:bg-black dark:text-[#c19253] dark:border dark:border-[#c19253]/40 rounded-full tracking-wider shadow-xs">
                {activeGender} Audience
              </span>
            )}
            {searchQuery.trim() !== "" && (
              <div className="flex items-center gap-1">
                <span className="text-[9px] uppercase font-bold px-3 py-1 rounded-full border bg-gray-100 border-[#ecebe7] text-gray-700 dark:bg-black dark:border-[#c19253]/30 dark:text-gray-300">
                  Term: "{searchQuery}"
                </span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-extrabold pr-2 text-gray-400 hover:text-black dark:text-[#c19253] dark:hover:text-white"
                  title="Clear search term"
                >
                  ×
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setActiveCategory("All");
                setActiveGender("All");
                setSearchQuery("");
              }}
              className="text-[9px] uppercase font-bold text-red-500 tracking-wider underline underline-offset-4"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Core layout grid */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-24 text-center">
            <div className="w-8 h-8 border-2 border-[#c19253] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-[#c19253]">
              Loading high fashion blends...
            </p>
          </div>
        ) : filteredPerfumes.length > 0 ? (
          <div className="space-y-12">
            {catalogView ? (
              <div className="bg-[#FAF9F5]/40 dark:bg-black/40 rounded-3xl border border-[#ecebe7]/40 dark:border-[#c19253]/25 backdrop-blur-sm">
                <HorizontalSyncGallery
                  perfumes={filteredPerfumes}
                  colors={colors}
                  onInspect={setInspectPerfume}
                  isDarkMode={isDarkMode}
                />
              </div>
            ) : (
              <div className="space-y-6 pt-4 border-t border-[#ecebe7]/60 dark:border-[#c19253]/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-extrabold text-[#111] dark:text-[#c19253]">
                      Atelier Formulation Grid
                    </h3>
                    <p className="text-xs text-gray-400">
                      Explore all formulations matching your active constraints
                    </p>
                  </div>

                  <div className="text-[10px] font-mono font-bold uppercase px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#ecebe7] text-gray-500 dark:bg-black dark:border-[#c19253]/30 dark:text-[#c19253]">
                    Showing {filteredPerfumes.length} profiles
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPerfumes.map((perfume) => (
                    <div
                      key={perfume.id}
                      className="transition-all duration-300"
                    >
                      <PerfumeCard
                        perfume={perfume}
                        colors={colors}
                        onClick={() => setInspectPerfume(perfume)}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-dashed p-16 rounded-3xl text-center flex flex-col items-center justify-center max-w-xl mx-auto my-12 bg-[#FAF9F5] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/35">
            <Info className="text-gray-300 mb-4" size={32} />
            <h4 className="font-serif text-2xl font-bold mb-2 text-gray-950 dark:text-[#c19253]">
              No essence found
            </h4>
            <p className="text-xs leading-relaxed mb-6 text-gray-500 dark:text-gray-400">
              No formulation matched your active selection. Clear query tags or
              register a custom formulation row inside the master workspace.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setActiveGender("All");
                setSearchQuery("");
              }}
              className="px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase shadow-sm transition-all duration-300 bg-black hover:bg-neutral-800 text-white dark:bg-[#c19253] dark:text-black dark:hover:bg-white"
            >
              Reset inventory filter
            </button>
          </div>
        )}
      </div>

      <div className="mt-16 text-center border-t pt-8 border-[#ecebe7] dark:border-[#c19253]/20">
        <p className="text-[10px] text-[#c19253] font-bold uppercase tracking-widest">
          YEAB LUXURY COLOGNES • STYLED FOR EXQUISITE APPRECIATION
        </p>
      </div>
    </motion.div>
  );
}
