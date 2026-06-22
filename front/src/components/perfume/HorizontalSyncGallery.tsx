import React, { useRef, useState, useEffect, useCallback } from "react";
import { Perfume } from "../../types";
import { Star, Eye, Compass, Award, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

// Helper function to chunk array into smaller arrays
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// =============================================================================
// Smooth horizontal scroll hook — light, fluid, snap-after-coast
// =============================================================================
const useHorizontalScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isCoasting, setIsCoasting] = useState(false);

  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });
  const velocityHistoryRef = useRef<number[]>([]);
  const lastPosRef = useRef({ x: 0, time: 0 });
  const coasterRef = useRef<number | null>(null);
  // Track whether the user actually moved during this drag
  const hasMovedRef = useRef(false);

  // Cancel any ongoing coast/inertia animation
  const stopCoasting = useCallback(() => {
    if (coasterRef.current !== null) {
      cancelAnimationFrame(coasterRef.current);
      coasterRef.current = null;
    }
    setIsCoasting(false);
  }, []);

  // After coasting completes, softly land on the nearest snap point
  const snapToNearest = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;

    const containerRect = el.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    // Find the child whose center is closest to the container center
    let closestDist = Infinity;
    let closestIndex = 0;
    children.forEach((child, i) => {
      const childRect = child.getBoundingClientRect();
      const childCenter = childRect.left + childRect.width / 2;
      const dist = Math.abs(childCenter - containerCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });

    const target = children[closestIndex];
    const targetRect = target.getBoundingClientRect();
    const parentRect = el.getBoundingClientRect();
    // Scroll so the target is centered
    const offset =
      target.offsetLeft - (parentRect.width - targetRect.width) / 2;

    el.scrollTo({ left: offset, behavior: "smooth" });
  }, []);

  // Clean-up
  useEffect(() => {
    return () => {
      if (coasterRef.current !== null) {
        cancelAnimationFrame(coasterRef.current);
      }
    };
  }, []);

  // ---- MOUSE HANDLERS ---------------------------------------------------

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      if (e.button !== 0) return;

      stopCoasting();
      setIsDragging(true);
      hasMovedRef.current = false;

      dragStartRef.current = {
        x: e.clientX,
        scrollLeft: containerRef.current.scrollLeft,
      };
      lastPosRef.current = { x: e.clientX, time: performance.now() };
      velocityHistoryRef.current = [];
    },
    [stopCoasting],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;
      e.preventDefault();

      const el = containerRef.current;
      const now = performance.now();
      const dt = now - lastPosRef.current.time;

      // Direct offset scroll — keeps 1:1 tracking with the cursor
      const dx = e.clientX - dragStartRef.current.x;
      el.scrollLeft = dragStartRef.current.scrollLeft - dx;
      hasMovedRef.current = true;

      // Velocity tracking via rolling history (6 samples for smooth inertia)
      if (dt > 0) {
        const v = (e.clientX - lastPosRef.current.x) / dt;
        velocityHistoryRef.current.push(v);
        // Keep last 6 samples
        if (velocityHistoryRef.current.length > 6) {
          velocityHistoryRef.current.shift();
        }
      }

      lastPosRef.current = { x: e.clientX, time: now };
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      setIsDragging(false);

      // If the user didn't actually move (just clicked), no coast
      if (!hasMovedRef.current) return;

      if (!containerRef.current) return;

      // Average velocity from history
      const hist = velocityHistoryRef.current;
      if (hist.length === 0) return;
      const avgV = hist.reduce((a, b) => a + b, 0) / hist.length;
      const absV = Math.abs(avgV);

      if (absV > 0.01) {
        // Start momentum coasting with a natural deceleration curve
        setIsCoasting(true);

        // Speed multiplier: scale velocity to pixels-per-frame
        // Higher = more glide on release
        let speed = avgV * 28;
        // Friction per frame (lower = longer coast)
        const friction = 0.955;

        const coast = () => {
          const el = containerRef.current;
          if (!el) {
            stopCoasting();
            return;
          }

          el.scrollLeft -= speed;
          speed *= friction;

          if (Math.abs(speed) > 0.1) {
            coasterRef.current = requestAnimationFrame(coast);
          } else {
            stopCoasting();
            // Soft landing: snap to nearest item
            snapToNearest();
          }
        };

        coasterRef.current = requestAnimationFrame(coast);
      } else {
        // Small flick — just snap
        snapToNearest();
      }
    },
    [isDragging, stopCoasting, snapToNearest],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only treat as release if actually dragging
      if (!isDragging) return;
      // Re-use the same logic
      handleMouseUp(e as unknown as React.MouseEvent<HTMLDivElement>);
    },
    [isDragging, handleMouseUp],
  );

  // ---- TOUCH HANDLERS ---------------------------------------------------
  // (Mirror the mouse logic above)

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      stopCoasting();
      setIsDragging(true);
      hasMovedRef.current = false;

      const t = e.touches[0];
      dragStartRef.current = {
        x: t.clientX,
        scrollLeft: containerRef.current.scrollLeft,
      };
      lastPosRef.current = { x: t.clientX, time: performance.now() };
      velocityHistoryRef.current = [];
    },
    [stopCoasting],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;

      const t = e.touches[0];
      const el = containerRef.current;
      const now = performance.now();
      const dt = now - lastPosRef.current.time;

      const dx = t.clientX - dragStartRef.current.x;
      el.scrollLeft = dragStartRef.current.scrollLeft - dx;
      hasMovedRef.current = true;

      if (dt > 0) {
        const v = (t.clientX - lastPosRef.current.x) / dt;
        velocityHistoryRef.current.push(v);
        if (velocityHistoryRef.current.length > 6) {
          velocityHistoryRef.current.shift();
        }
      }

      lastPosRef.current = { x: t.clientX, time: now };
    },
    [isDragging],
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!hasMovedRef.current) return;
    if (!containerRef.current) return;

    const hist = velocityHistoryRef.current;
    if (hist.length === 0) return;
    const avgV = hist.reduce((a, b) => a + b, 0) / hist.length;
    const absV = Math.abs(avgV);

    if (absV > 0.01) {
      setIsCoasting(true);

      let speed = avgV * 24; // Slightly slower multiplier for touch
      const friction = 0.955;

      const coast = () => {
        const el = containerRef.current;
        if (!el) {
          stopCoasting();
          return;
        }
        el.scrollLeft -= speed;
        speed *= friction;
        if (Math.abs(speed) > 0.1) {
          coasterRef.current = requestAnimationFrame(coast);
        } else {
          stopCoasting();
          snapToNearest();
        }
      };

      coasterRef.current = requestAnimationFrame(coast);
    } else {
      snapToNearest();
    }
  }, [isDragging, stopCoasting, snapToNearest]);

  return {
    containerRef,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};

// =============================================================================
// Component
// =============================================================================

interface HorizontalSyncGalleryProps {
  perfumes: Perfume[];
  colors: Record<string, string>;
  onInspect: (perfume: Perfume) => void;
  isDarkMode?: boolean;
}

export default function HorizontalSyncGallery({
  perfumes,
  colors,
  onInspect,
  isDarkMode = false,
}: HorizontalSyncGalleryProps) {
  // Divide perfumes into 4 groups (grids)
  const itemsPerGrid = Math.ceil(perfumes.length / 4);
  const perfumeGrids = chunkArray(perfumes, itemsPerGrid);

  if (perfumes.length === 0) {
    return (
      <div className="border border-dashed p-12 rounded-3xl text-center flex flex-col items-center justify-center max-w-xl mx-auto my-6 bg-[#FAF9F5] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/30">
        <AlertCircle className="text-gray-300 mb-3" size={24} />
        <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-[#c19253]">
          No Perfumes Found
        </h4>
        <p className="text-xs text-gray-500 max-w-xs mt-1">
          Adjust your active audience or collection filters to uncover our
          majestic blends.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 relative overflow-hidden">
      {/* Decorative top header line */}
      <div className="flex items-center justify-between px-2 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#c19253]/10 text-[#c19253] dark:bg-[#c19253]/20">
            <Compass size={14} className="animate-spin-slow" />
          </span>
          <div>
            <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#c19253] block">
              Curated Horizon Showcase
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-gray-400 dark:text-gray-300 font-bold uppercase tracking-wider">
                Interactive Flick Deck • {perfumes.length} Fragrances
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Four independent horizontal grids */}
      <div className="w-full">
        {perfumeGrids.map((gridPerfumes, gridIndex) => {
          // Each grid gets its own scroll functionality
          const {
            containerRef,
            onMouseDown,
            onMouseMove,
            onMouseUp,
            onMouseLeave,
            onTouchStart,
            onTouchMove,
            onTouchEnd,
          } = useHorizontalScroll();

          return (
            <div key={gridIndex} className="mb-4 last:mb-0">
              <div className={cn("relative w-full")}>
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-[#fdfdfc] to-transparent pointer-events-none z-10 dark:from-black" />
                <div
                  ref={containerRef}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseLeave}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  className={cn(
                    "flex gap-6 overflow-x-auto select-none px-6 py-4 cursor-grab active:cursor-grabbing",
                    "luxury-scrollbar snap-x scroll-smooth snap-proximity",
                  )}
                  style={{
                    WebkitOverflowScrolling: "touch",
                    touchAction: "auto",
                    overscrollBehaviorX: "contain",
                    scrollBehavior: "auto",
                  }}
                >
                  {gridPerfumes.map((perfume: Perfume) => (
                    <div
                      key={perfume.id}
                      className={cn(
                        "shrink-0 w-72.5 sm:w-87.5 md:w-105 rounded-3xl overflow-hidden transition-all duration-500 relative flex flex-col md:flex-row border shadow-md",
                        "bg-white/70 border-[#ecebe7] dark:bg-black/50 dark:border-[#c19253]/15",
                      )}
                    >
                      <div className="w-full md:w-1/2 aspect-4/5 md:aspect-auto md:h-full relative overflow-hidden bg-gray-50 flex items-center justify-center dark:bg-black">
                        <img
                          src={perfume.mainImage}
                          alt={perfume.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-4 left-4 border border-[#c19253]/35 px-2 py-0.5 rounded-md text-[8px] font-mono font-black tracking-widest bg-[#0a0614]/80 text-[#c19253] shadow-sm">
                          {perfume.code}
                        </span>
                        <div className="absolute bottom-4 left-4 flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-1 rounded-full bg-[#0a0614]/85 text-[#c19253] backdrop-blur-md shadow-md border border-[#c19253]/15">
                          <Star
                            size={10}
                            className="fill-[#c19253] text-[#c19253]"
                          />
                          <span>{perfume.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-7 flex flex-col justify-between relative bg-white dark:bg-black transition-all">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-extrabod tracking-[0.2em] px-2.5 py-0.5 rounded uppercase text-[#c19253] bg-[#c19253]/10 dark:bg-[#c19253]/20">
                              {perfume.brand}
                            </span>
                            {perfume.category === "Luxury Perfume" ? (
                              <span className="text-[8px] font-extrabod tracking-widest uppercase flex items-center gap-1 text-[#c19253]">
                                <Award size={10} /> Luxury
                              </span>
                            ) : (
                              <span className="text-[8px] font-extrabod tracking-widest uppercase flex items-center gap-1 text-gray-400">
                                <Sparkles size={10} /> {perfume.category}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-gray-950 dark:text-[#c19253] line-clamp-1">
                              {perfume.name}
                            </h4>
                            <p className="text-[11px] leading-relaxed text-gray-400 dark:text-gray-400 line-clamp-2 italic font-serif">
                              "{perfume.description}"
                            </p>
                          </div>
                          <div className="space-y-2 pt-1 border-t border-[#ecebe7] dark:border-[#c19253]/15">
                            <span className="text-[8px] uppercase tracking-wider font-extrabod text-gray-400">
                              Accords Composition
                            </span>
                            <div className="space-y-1.5">
                              {perfume.accords.slice(0, 3).map((accord, i) => {
                                const barBg =
                                  colors[accord.name] ||
                                  accord.color ||
                                  "#ecebe7";
                                return (
                                  <div key={i} className="space-y-0.5">
                                    <div className="flex items-center justify-between text-[9px] font-mono">
                                      <span className="text-gray-500 dark:text-gray-300 font-bold">
                                        {accord.name}
                                      </span>
                                      <span className="text-gray-400">
                                        {accord.value}%
                                      </span>
                                    </div>
                                    <div className="h-1 bg-gray-100 dark:bg-black border dark:border-[#c19253]/10 rounded-full overflow-hidden">
                                      <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                          width: `${accord.value}%`,
                                          backgroundColor: barBg,
                                        }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {perfume.notes.top.slice(0, 2).map((note, i) => (
                              <span
                                key={i}
                                className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-black dark:border dark:border-[#c19253]/20 dark:text-gray-300"
                              >
                                Top: {note.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3 pt-4 mt-4 border-t border-[#ecebe7] dark:border-[#c19253]/15">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] tracking-[0.2em] font-extrabod uppercase text-gray-400">
                              Value investment
                            </span>
                            <span className="text-sm font-serif font-black tracking-wide text-gray-950 dark:text-[#c19253]">
                              {perfume.price.toLocaleString()} ETB
                            </span>
                          </div>

                          <button
                            onClick={() => onInspect(perfume)}
                            className="w-full py-2 bg-[#111] hover:bg-neutral-800 text-white rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 dark:bg-[#c19253] dark:text-black dark:hover:bg-[#977344] cursor-pointer"
                          >
                            <Eye size={12} />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right ambient fade overlay */}
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-[#fdfdfc] to-transparent pointer-events-none z-10 dark:from-black" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
