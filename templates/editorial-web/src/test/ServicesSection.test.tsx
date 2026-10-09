import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ServicesSection } from '../components/ServicesSection';
import { servicesData } from '../data/servicesData';

describe('ServicesSection Component', () => {
  it('renders section title, subtitle, and all services initially', () => {
    const handleSelectService = vi.fn();
    render(<ServicesSection onSelectService={handleSelectService} />);

    expect(screen.getByText(/Comprehensive IT Advisory & Software Craftsmanship/i)).toBeInTheDocument();
    
    // Check first few service titles
    expect(screen.getByText(servicesData[0].title)).toBeInTheDocument();
    expect(screen.getByText(servicesData[1].title)).toBeInTheDocument();
  });

  it('filters services when category filter buttons are clicked', () => {
    const handleSelectService = vi.fn();
    render(<ServicesSection onSelectService={handleSelectService} />);

    const aiFilterBtn = screen.getByRole('button', { name: /Applied AI & RAG/i });
    fireEvent.click(aiFilterBtn);

    // AI services should be visible
    expect(screen.getByText(/Applied AI & Autonomous Agents/i)).toBeInTheDocument();
    
    // Non-AI service like Cloud Architecture should not be visible
    expect(screen.queryByText(/Cloud Architecture, Migration & DevOps/i)).not.toBeInTheDocument();
  });

  it('toggles deliverables expansion when clicking View Full Scope', () => {
    const handleSelectService = vi.fn();
    render(<ServicesSection onSelectService={handleSelectService} />);

    const viewFullScopeButtons = screen.getAllByRole('button', { name: /View Full Scope/i });
    expect(viewFullScopeButtons.length).toBeGreaterThan(0);

    fireEvent.click(viewFullScopeButtons[0]);
    expect(screen.getByText(/Show Less/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Show Less/i));
    expect(screen.queryByText(/Show Less/i)).not.toBeInTheDocument();
  });

  it('invokes onSelectService callback when clicking Request Quote', () => {
    const handleSelectService = vi.fn();
    render(<ServicesSection onSelectService={handleSelectService} />);

    const requestQuoteButtons = screen.getAllByRole('button', { name: /Request Quote/i });
    fireEvent.click(requestQuoteButtons[0]);

    expect(handleSelectService).toHaveBeenCalledTimes(1);
    expect(handleSelectService).toHaveBeenCalledWith(servicesData[0].title);
  });
});
