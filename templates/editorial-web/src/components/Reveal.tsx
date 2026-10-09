import React, { useEffect, useRef, useState } from 'react';

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  variant?: 'up' | 'left' | 'right' | 'scale' | 'fade';
  delay?: number;
  className?: string;
  id?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  as: Component = 'div',
  variant = 'up',
  delay = 0,
  className = '',
  id,
  style,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // @ts-ignore
    <Component
      ref={ref}
      id={id}
      className={`reveal reveal--${variant} ${visible ? 'reveal--visible' : ''} ${className}`}
      style={{ ...style, transitionDelay: visible ? `${delay}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Component>
  );
};
