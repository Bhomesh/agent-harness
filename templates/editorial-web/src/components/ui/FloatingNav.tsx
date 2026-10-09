import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

export interface NavItem {
  name: string;
  link: string;
  icon?: React.ReactNode;
}

export interface FloatingNavProps {
  navItems: NavItem[];
  className?: string;
  extraAction?: React.ReactNode;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  navItems,
  className = '',
  extraAction,
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    if (typeof current === 'number') {
      const direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.25,
        }}
        className={`flex max-w-[calc(100vw-1.5rem)] sm:max-w-fit fixed top-3 sm:top-6 inset-x-0 mx-auto border border-white/10 rounded-full bg-zinc-950/85 backdrop-blur-xl shadow-2xl z-[5000] px-3 sm:px-6 py-1.5 sm:py-2 items-center justify-center space-x-1 sm:space-x-4 ${className}`}
      >
        {navItems.map((navItem, idx: number) => (
          <a
            key={`link-${idx}`}
            href={navItem.link}
            className="relative text-zinc-300 items-center flex space-x-1 hover:text-white transition-colors text-[11px] sm:text-sm font-medium py-1 px-1.5 sm:px-2.5 rounded-full hover:bg-white/5 shrink-0"
          >
            {navItem.icon && <span className="block sm:hidden text-cyan-400">{navItem.icon}</span>}
            <span className="text-[11px] sm:text-sm whitespace-nowrap">{navItem.name}</span>
          </a>
        ))}
        {extraAction && (
          <div className="pl-1.5 sm:pl-3 border-l border-white/10 shrink-0">{extraAction}</div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingNav;
