import React from 'react';
import { siteConfig, ProblemItem } from '../data/siteData';
import { Reveal } from './Reveal';

function splitIntoChunks<T>(arr: T[], parts: number): T[][] {
  const result: T[][] = Array.from({ length: parts }, () => []);
  arr.forEach((item, idx) => {
    result[idx % parts].push(item);
  });
  return result;
}

const MarqueeTrack: React.FC<{ items: ProblemItem[]; direction: 'left' | 'right' }> = ({
  items,
  direction,
}) => {
  return (
    <div className={`site-marquee__track site-marquee__track--${direction}`}>
      {Array.from({ length: 4 }, (_, setIdx) => (
        <div
          key={setIdx}
          className="site-marquee__set"
          aria-hidden={setIdx > 0 ? true : undefined}
        >
          {items.map((item, itemIdx) => (
            <span
              key={`${item.label}-${itemIdx}`}
              className={`site-problem site-problem--${item.tone}`}
            >
              {item.label}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export const SiteProblems: React.FC = () => {
  const lanes = splitIntoChunks(siteConfig.problems, 3);

  return (
    <section className="site-problems" id="problems">
      <div className="site-section">
        <Reveal as="h2" className="site-h2" variant="up">
          The Problems We Solve
        </Reveal>
      </div>

      <Reveal className="site-marquee" variant="fade" delay={100}>
        {lanes.map((lane, idx) => (
          <MarqueeTrack
            key={idx}
            items={lane}
            direction={idx % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </Reveal>
    </section>
  );
};
