import React from 'react';
import { BentoGridItem } from './BentoGridItem';

export const BentoGrid = ({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </div>
  );
};

export { BentoGridItem };
export default BentoGrid;
