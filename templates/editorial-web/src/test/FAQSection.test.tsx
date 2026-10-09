import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQSection } from '../components/FAQSection';
import { faqData } from '../data/faqData';

describe('FAQSection Component', () => {
  it('renders FAQ section title and all questions', () => {
    render(<FAQSection />);

    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
    expect(screen.getByText(/Consulting & Procurement FAQ/i)).toBeInTheDocument();

    for (const faq of faqData) {
      expect(screen.getByText(faq.question)).toBeInTheDocument();
    }
  });

  it('renders first FAQ open by default and shows answer', () => {
    render(<FAQSection />);

    expect(screen.getByText(faqData[0].answer)).toBeInTheDocument();
  });

  it('toggles FAQ item open and closed upon click', () => {
    render(<FAQSection />);

    // Click first FAQ question to close it
    const firstQuestionBtn = screen.getByText(faqData[0].question);
    fireEvent.click(firstQuestionBtn);

    expect(screen.queryByText(faqData[0].answer)).not.toBeInTheDocument();

    // Click second FAQ question to open it
    const secondQuestionBtn = screen.getByText(faqData[1].question);
    fireEvent.click(secondQuestionBtn);

    expect(screen.getByText(faqData[1].answer)).toBeInTheDocument();
  });
});
