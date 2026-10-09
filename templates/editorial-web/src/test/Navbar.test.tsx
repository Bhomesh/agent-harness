import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/Navbar';

describe('Navbar Component', () => {
  it('renders top announcement banner with Jaipur headquarters and CIN', () => {
    const handleConsultation = vi.fn();
    render(<Navbar onOpenConsultation={handleConsultation} />);

    expect(screen.getByText(/Headquartered in Jaipur, Rajasthan, India/i)).toBeInTheDocument();
    expect(screen.getByText(/U72900RJ2024PTC089124/i)).toBeInTheDocument();
    expect(screen.getByText(/World Trade Park Campus/i)).toBeInTheDocument();
    expect(screen.getByText(/ISO 27001 & SOC 2 Aligned/i)).toBeInTheDocument();
  });

  it('renders logo and navigation links', () => {
    const handleConsultation = vi.fn();
    render(<Navbar onOpenConsultation={handleConsultation} />);

    expect(screen.getByText(/Build/i)).toBeInTheDocument();
    expect(screen.getByText(/Swift/i)).toBeInTheDocument();
    expect(screen.getByText(/IT Consultancy • Jaipur/i)).toBeInTheDocument();

    const links = ['Services', 'Technologies', 'Cost Estimator', 'Case Studies', 'Jaipur Campus', 'Testimonials', 'FAQs'];
    links.forEach((link) => {
      expect(screen.getByRole('link', { name: link })).toBeInTheDocument();
    });
  });

  it('calls onOpenConsultation when clicking Book Free Consultation CTA', () => {
    const handleConsultation = vi.fn();
    render(<Navbar onOpenConsultation={handleConsultation} />);

    const ctaButton = screen.getByRole('button', { name: /Book Free Consultation/i });
    fireEvent.click(ctaButton);

    expect(handleConsultation).toHaveBeenCalledTimes(1);
  });

  it('toggles mobile menu drawer when mobile hamburger button is clicked', () => {
    const handleConsultation = vi.fn();
    render(<Navbar onOpenConsultation={handleConsultation} />);

    const hamburgerBtn = screen.getByRole('button', { name: /Toggle navigation/i });
    fireEvent.click(hamburgerBtn);

    expect(screen.getByRole('button', { name: /Book Free IT Audit/i })).toBeInTheDocument();

    // Clicking it triggers callback and closes
    const auditBtn = screen.getByRole('button', { name: /Book Free IT Audit/i });
    fireEvent.click(auditBtn);

    expect(handleConsultation).toHaveBeenCalledTimes(1);
  });
});
