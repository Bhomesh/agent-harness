import React from 'react';

interface DotBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const DotBackground: React.FC<DotBackgroundProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden bg-black flex items-center justify-center ${className}`}
    >
      {/* Aceternity Dot Pattern */}
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Radial Gradient Mask for soft vignette fade */}
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-black/60" />

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

export default DotBackground;
