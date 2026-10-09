import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { siteConfig } from '../data/siteData';

const REPEAT_COUNT = 8;
const SCALE_RATIO = 0.82;

function generateWaveCurve(width: number, height: number) {
  const normW = width / SCALE_RATIO;
  const normH = height / SCALE_RATIO;
  const centerX = normW / 2;
  const spreadX = normW / 3.6;
  const baseOffset = normH - 10;
  const amplitude = normH * 0.66;
  const bound = 6 * normW;
  const step = normW / 40;

  const yFunc = (x: number) =>
    baseOffset - amplitude * Math.exp(-((x - centerX) ** 2) / (2 * spreadX * spreadX));

  const points: [number, number][] = [];
  for (let x = centerX - bound; x <= centerX + bound; x += step) {
    points.push([x, yFunc(x)]);
  }

  const clampPt = (idx: number) => points[Math.min(Math.max(idx, 0), points.length - 1)];
  const fmt = (num: number) => num.toFixed(1);

  let pathData = `M${fmt(points[0][0])} ${fmt(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [p0x, p0y] = clampPt(i - 1);
    const [p1x, p1y] = clampPt(i);
    const [p2x, p2y] = clampPt(i + 1);
    const [p3x, p3y] = clampPt(i + 2);

    const cp1x = p1x + (p2x - p0x) / 6;
    const cp1y = p1y + (p2y - p0y) / 6;
    const cp2x = p2x - (p3x - p1x) / 6;
    const cp2y = p2y - (p3y - p1y) / 6;

    pathData += `C${fmt(cp1x)} ${fmt(cp1y)} ${fmt(cp2x)} ${fmt(cp2y)} ${fmt(p2x)} ${fmt(p2y)}`;
  }

  return {
    viewBox: `0 0 ${fmt(normW)} ${fmt(normH)}`,
    d: pathData,
  };
}

export const StatementCurve: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hiddenTextRef = useRef<SVGTextElement | null>(null);
  const [dimensions, setDimensions] = useState<{ w: number; h: number }>({
    w: typeof window !== 'undefined' && window.innerWidth ? Math.max(window.innerWidth, 1200) : 1440,
    h: 480,
  });
  const [textOffset, setTextOffset] = useState<number>(0);
  const [animate, setAnimate] = useState<boolean>(true);

  const rawWords = siteConfig.statementWords.join('  ✦  ') + '  ✦  ';

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const w = Math.round(rect.width / 20) * 20;
      const h = Math.round(rect.height / 10) * 10;
      setDimensions((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    document.addEventListener('visibilitychange', measure);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const textNode = hiddenTextRef.current;
    if (!textNode) return;

    const computeLength = () => {
      try {
        const len = textNode.getComputedTextLength();
        if (len > 0) {
          setTextOffset(len);
          return;
        }
      } catch (e) {
        // Fallback calculation for jsdom/unrendered environments
      }
      setTextOffset(rawWords.length * 52);
    };

    computeLength();
    const prefersReduced =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    setAnimate(!prefersReduced);

    const fontSize =
      typeof window !== 'undefined' && window.getComputedStyle
        ? window.getComputedStyle(textNode).fontSize || '100px'
        : '100px';
    document.fonts?.load(`800 ${fontSize} "Manrope Variable"`).then(computeLength).catch(() => {});
    document.fonts?.ready?.then(computeLength).catch(() => {});
  }, [dimensions, rawWords]);

  const curve = generateWaveCurve(dimensions.w, dimensions.h);

  return (
    <section className="site-statement reveal reveal--fade reveal--visible" aria-label="Brand statement">
      <div className="site-statement__inner" ref={containerRef}>
        <svg className="site-statement__svg" viewBox={curve.viewBox} preserveAspectRatio="xMidYMid meet">
          <defs>
            <path id="site-statement-curve" d={curve.d} fill="none" />
          </defs>
          {/* Hidden measuring text */}
          <text ref={hiddenTextRef} className="site-statement__text" x="0" y="-9999" visibility="hidden">
            {rawWords}
          </text>
          {/* Animated looping text */}
          <text className="site-statement__text">
            <textPath
              href="#site-statement-curve"
              xlinkHref="#site-statement-curve"
              startOffset={textOffset}
            >
              {rawWords.repeat(REPEAT_COUNT)}
              {animate && textOffset > 0 && (
                <animate
                  key={textOffset}
                  attributeName="startOffset"
                  from="0"
                  to={textOffset.toString()}
                  dur="28s"
                  repeatCount="indefinite"
                />
              )}
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
};
