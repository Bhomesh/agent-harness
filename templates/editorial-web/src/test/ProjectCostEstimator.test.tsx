import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCostEstimator } from '../components/ProjectCostEstimator';

describe('ProjectCostEstimator Component', () => {
  it('renders correctly with default USD currency', () => {
    const handleQuote = vi.fn();
    render(<ProjectCostEstimator onQuoteRequested={handleQuote} />);

    expect(screen.getByText(/Transparent Project Estimator/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated Investment Range:/i)).toBeInTheDocument();
    expect(screen.getByText('$16,200')).toBeInTheDocument();
    expect(screen.getByText('$21,600')).toBeInTheDocument();
    expect(screen.getByText(/8 Weeks/i)).toBeInTheDocument();
  });

  it('switches currency between USD and INR correctly', () => {
    const handleQuote = vi.fn();
    render(<ProjectCostEstimator onQuoteRequested={handleQuote} />);

    // Switch to INR
    const inrButton = screen.getByRole('button', { name: /INR \(₹\) India/i });
    fireEvent.click(inrButton);

    expect(screen.getByText('₹13.9')).toBeInTheDocument();
    expect(screen.getByText('₹18.6 Lakhs')).toBeInTheDocument();
    expect(screen.getByText(/Excluding 18% GST/i)).toBeInTheDocument();

    // Switch back to USD
    const usdButton = screen.getByRole('button', { name: /USD \(\$\) Global/i });
    fireEvent.click(usdButton);

    expect(screen.getByText('$16,200')).toBeInTheDocument();
    expect(screen.getByText('$21,600')).toBeInTheDocument();
    expect(screen.getByText(/Inclusive of global architecture advisory/i)).toBeInTheDocument();
  });

  it('recalculates budget and timeline when project type changes', () => {
    const handleQuote = vi.fn();
    render(<ProjectCostEstimator onQuoteRequested={handleQuote} />);

    // Switch to Applied AI & RAG (Base 22000 => min 19,800, max 26,400, 8 weeks)
    const aiButton = screen.getByRole('button', { name: /Applied AI & RAG/i });
    fireEvent.click(aiButton);

    expect(screen.getByText('$19,800')).toBeInTheDocument();
    expect(screen.getByText('$26,400')).toBeInTheDocument();
    expect(screen.getByText(/8 Weeks/i)).toBeInTheDocument();
    expect(screen.getByText(/1 AI\/RAG Specialist/i)).toBeInTheDocument();

    // Switch to Cybersecurity Audit (Base 14000 => min 12,600, max 16,800, 4 weeks)
    const secButton = screen.getByRole('button', { name: /Cybersecurity Audit/i });
    fireEvent.click(secButton);

    expect(screen.getByText('$12,600')).toBeInTheDocument();
    expect(screen.getByText('$16,800')).toBeInTheDocument();
    expect(screen.getByText(/4 Weeks/i)).toBeInTheDocument();
    expect(screen.getByText(/2 Senior Security Auditors/i)).toBeInTheDocument();
  });

  it('recalculates pricing on complexity tier changes', () => {
    const handleQuote = vi.fn();
    render(<ProjectCostEstimator onQuoteRequested={handleQuote} />);

    // Click Lean MVP tier (Base 18000 * 0.75 = 13500 => min 12,150, max 16,200, 6 weeks)
    const mvpButton = screen.getByRole('button', { name: /Lean MVP/i });
    fireEvent.click(mvpButton);

    expect(screen.getByText('$12,150')).toBeInTheDocument();
    expect(screen.getByText('$16,200')).toBeInTheDocument();
    expect(screen.getByText(/6 Weeks/i)).toBeInTheDocument();

    // Click Mission Critical (Enterprise) tier (Base 18000 * 1.8 = 32400 => min 29,160, max 38,880, 12 weeks)
    const entButton = screen.getByRole('button', { name: /Mission Critical/i });
    fireEvent.click(entButton);

    expect(screen.getByText('$29,160')).toBeInTheDocument();
    expect(screen.getByText('$38,880')).toBeInTheDocument();
    expect(screen.getByText(/12 Weeks/i)).toBeInTheDocument();
    expect(screen.getByText(/1 Dedicated Delivery Manager/i)).toBeInTheDocument();
  });

  it('toggles AI add-on and updates budget & timeline', () => {
    const handleQuote = vi.fn();
    render(<ProjectCostEstimator onQuoteRequested={handleQuote} />);

    // Default hasAI is false. Toggling turns it on (18000 + 6000 = 24000 => min 21,600, max 28,800, 10 weeks)
    const aiToggle = screen.getByRole('button', { name: /Include Private LLM\/RAG Pipeline/i });
    fireEvent.click(aiToggle);

    expect(screen.getByText('$21,600')).toBeInTheDocument();
    expect(screen.getByText('$28,800')).toBeInTheDocument();
    expect(screen.getByText(/10 Weeks/i)).toBeInTheDocument();
  });

  it('toggles expedited delivery velocity', () => {
    const handleQuote = vi.fn();
    render(<ProjectCostEstimator onQuoteRequested={handleQuote} />);

    // Expedited speed: Base 18000 * 1.25 = 22500 => min 20,250, max 27,000, 6 weeks
    const expeditedButton = screen.getByRole('button', { name: /Expedited Fast-Track/i });
    fireEvent.click(expeditedButton);

    expect(screen.getByText('$20,250')).toBeInTheDocument();
    expect(screen.getByText('$27,000')).toBeInTheDocument();
    expect(screen.getByText(/6 Weeks/i)).toBeInTheDocument();
  });

  it('triggers onQuoteRequested callback with complete details when locking in estimate', () => {
    const handleQuote = vi.fn();
    render(<ProjectCostEstimator onQuoteRequested={handleQuote} />);

    const ctaButton = screen.getByRole('button', { name: /Lock In Estimate & Request RFP/i });
    fireEvent.click(ctaButton);

    expect(handleQuote).toHaveBeenCalledTimes(1);
    expect(handleQuote.mock.calls[0][0]).toContain('Project: CLOUD');
    expect(handleQuote.mock.calls[0][0]).toContain('Scale: GROWTH');
    expect(handleQuote.mock.calls[0][0]).toContain('$16,200 - $21,600');
    expect(handleQuote.mock.calls[0][0]).toContain('8 wks');
  });
});
