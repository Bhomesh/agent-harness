import React from 'react';

interface BackgroundGridProps {
  children?: React.ReactNode;
  className?: string;
  pattern?: 'dots' | 'grid';
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({
  children,
  className = '',
  pattern = 'dots',
}) => {
  return (
    <div className={`relative w-full overflow-hidden bg-black ${className}`}>
      {pattern === 'dots' ? (
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      ) : (
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      )}

      {/* Radial Gradient Mask for signature Aceternity fade */}
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] bg-black/60" />

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundGrid;
