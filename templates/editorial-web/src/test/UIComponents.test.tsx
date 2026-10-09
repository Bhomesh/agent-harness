import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Spotlight } from '../components/ui/Spotlight';
import { BackgroundGrid } from '../components/ui/BackgroundGrid';
import { DotBackground } from '../components/ui/DotBackground';
import { BentoGrid, BentoGridItem } from '../components/ui/BentoGrid';
import { Button as MovingBorderButton } from '../components/ui/MovingBorder';
import { HoverBorderGradient } from '../components/ui/HoverBorderGradient';
import { CardHoverEffect } from '../components/ui/CardHoverEffect';
import { FloatingNav } from '../components/ui/FloatingNav';

describe('Aceternity UI Components', () => {
  it('renders Spotlight SVG with custom fill and unique filter ID', () => {
    const { container } = render(
      <>
        <Spotlight fill="rgba(6, 182, 212, 0.45)" className="custom-spotlight-1" />
        <Spotlight fill="rgba(255, 255, 255, 0.2)" className="custom-spotlight-2" />
      </>
    );
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(2);
    const filter1 = svgs[0].querySelector('filter')?.getAttribute('id');
    const filter2 = svgs[1].querySelector('filter')?.getAttribute('id');
    expect(filter1).toBeTruthy();
    expect(filter2).toBeTruthy();
    expect(filter1).not.toBe(filter2);
  });

  it('renders BackgroundGrid with children and pattern options', () => {
    render(
      <BackgroundGrid pattern="grid">
        <span data-testid="grid-child">Grid Content</span>
      </BackgroundGrid>
    );
    expect(screen.getByTestId('grid-child')).toBeInTheDocument();
  });

  it('renders DotBackground with children', () => {
    render(
      <DotBackground>
        <span data-testid="dot-child">Dot Content</span>
      </DotBackground>
    );
    expect(screen.getByTestId('dot-child')).toBeInTheDocument();
  });

  it('renders BentoGrid and BentoGridItem', () => {
    const handleClick = vi.fn();
    render(
      <BentoGrid>
        <BentoGridItem
          title="Bento Item 1"
          description="Description for item 1"
          badge="PRO"
          onClick={handleClick}
        />
      </BentoGrid>
    );

    expect(screen.getByText('Bento Item 1')).toBeInTheDocument();
    expect(screen.getByText('Description for item 1')).toBeInTheDocument();
    expect(screen.getByText('PRO')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Bento Item 1'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders MovingBorderButton and handles click', () => {
    const handleClick = vi.fn();
    render(
      <MovingBorderButton onClick={handleClick}>
        Click Moving Border
      </MovingBorderButton>
    );

    const btn = screen.getByRole('button', { name: /Click Moving Border/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders HoverBorderGradient component', () => {
    render(
      <HoverBorderGradient>
        <span>Hover Border Tag</span>
      </HoverBorderGradient>
    );

    expect(screen.getByText('Hover Border Tag')).toBeInTheDocument();
  });

  it('renders CardHoverEffect with items and hover support', () => {
    const handleClick = vi.fn();
    const items = [
      {
        title: 'Card 1',
        description: 'Description 1',
        badge: 'NEW',
        onClick: handleClick,
        meta: <div>Custom Meta Content</div>,
      },
      {
        title: 'Card 2',
        description: 'Description 2',
      },
    ];

    render(<CardHoverEffect items={items} />);

    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
    expect(screen.getByText('Custom Meta Content')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Card 1'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders FloatingNav with navigation links', () => {
    const navItems = [
      { name: 'Services', link: '#services' },
      { name: 'Pricing', link: '#pricing' },
    ];

    render(
      <FloatingNav
        navItems={navItems}
        extraAction={<button>Action</button>}
      />
    );

    expect(screen.getByRole('link', { name: 'Services' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pricing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
