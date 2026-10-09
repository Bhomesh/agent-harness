import React from 'react';
import { motion } from 'framer-motion';

export interface BentoGridItemProps {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  onClick?: () => void;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export const BentoGridItem: React.FC<BentoGridItemProps> = ({
  className = '',
  title,
  description,
  header,
  icon,
  badge,
  onClick,
  footer,
  children,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`row-span-1 rounded-2xl group/bento hover:shadow-2xl hover:shadow-cyan-500/10 transition duration-300 p-6 bg-zinc-950/80 border border-white/10 hover:border-cyan-500/40 justify-between flex flex-col space-y-4 backdrop-blur-sm relative overflow-hidden ${className}`}
    >
      {/* Subtle top border highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500" />

      {header}

      {children ? (
        children
      ) : (
        <div className="group-hover/bento:translate-x-1 transition duration-200">
          <div className="flex items-center justify-between mb-2">
            {icon}
            {badge && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-cyan-300 border border-white/10">
                {badge}
              </span>
            )}
          </div>
          {title && (
            <div className="font-bold text-white mb-1.5 text-lg tracking-tight">
              {title}
            </div>
          )}
          {description && (
            <div className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {description}
            </div>
          )}
        </div>
      )}

      {footer && <div className="pt-2">{footer}</div>}
    </motion.div>
  );
};

export default BentoGridItem;
