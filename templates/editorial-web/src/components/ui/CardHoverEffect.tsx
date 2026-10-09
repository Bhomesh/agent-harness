import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface HoverEffectItem {
  title: string;
  description: string;
  link?: string;
  icon?: React.ReactNode;
  badge?: string;
  onClick?: () => void;
  meta?: React.ReactNode;
}

export const HoverEffect = ({
  items,
  className = '',
}: {
  items: HoverEffectItem[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-6 ${className}`}
    >
      {items.map((item, idx) => (
        <div
          key={item?.title || idx}
          className="relative group block p-2 h-full w-full cursor-pointer"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={item.onClick}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-cyan-500/[0.12] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.1 },
                }}
              />
            )}
          </AnimatePresence>
          <div className="rounded-2xl h-full w-full p-6 sm:p-7 overflow-hidden bg-zinc-950/90 border border-white/10 group-hover:border-cyan-500/40 relative z-20 transition duration-300 flex flex-col justify-between backdrop-blur-sm shadow-xl">
            {/* Subtle top edge gradient line on hover */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {item.icon && (
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-cyan-400 group-hover:text-cyan-300">
                    {item.icon}
                  </div>
                )}
                {item.badge && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-cyan-300 border border-white/10">
                    {item.badge}
                  </span>
                )}
              </div>
              <h4 className="text-white font-bold tracking-tight text-lg group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h4>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">
                {item.description}
              </p>
            </div>
            {item.meta && <div className="pt-4 mt-4 border-t border-white/5">{item.meta}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export const CardHoverEffect = HoverEffect;
export default CardHoverEffect;
