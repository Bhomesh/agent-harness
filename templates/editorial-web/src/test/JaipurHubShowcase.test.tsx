import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JaipurHubShowcase } from '../components/JaipurHubShowcase';
import { jaipurHubData } from '../data/jaipurHubData';

describe('JaipurHubShowcase Component', () => {
  it('displays the registered company name and Jaipur details', () => {
    const handleVisit = vi.fn();
    render(<JaipurHubShowcase onScheduleVisit={handleVisit} />);

    expect(screen.getByText(/Jaipur, Rajasthan: The Silicon Desert/i)).toBeInTheDocument();
    expect(screen.getByText(jaipurHubData.companyName)).toBeInTheDocument();
    expect(screen.getByText(jaipurHubData.corporateRegistration.cin)).toBeInTheDocument();
    expect(screen.getByText(jaipurHubData.corporateRegistration.gstin)).toBeInTheDocument();
    expect(screen.getByText(jaipurHubData.corporateRegistration.msmeRegistration)).toBeInTheDocument();
    expect(screen.getByText(jaipurHubData.corporateRegistration.dpiitRecognition)).toBeInTheDocument();
    expect(screen.getByText(jaipurHubData.headquarters.addressLine1)).toBeInTheDocument();
    expect(screen.getByText(jaipurHubData.headquarters.techCampus)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${jaipurHubData.headquarters.pincode}`, 'i'))).toBeInTheDocument();
  });

  it('renders contact hotline and direct inquiries', () => {
    const handleVisit = vi.fn();
    render(<JaipurHubShowcase onScheduleVisit={handleVisit} />);

    expect(screen.getByText(jaipurHubData.contact.phoneIndia)).toBeInTheDocument();
    expect(screen.getByText(jaipurHubData.contact.emailGeneral)).toBeInTheDocument();
  });

  it('renders regional strategic advantages and certifications', () => {
    const handleVisit = vi.fn();
    render(<JaipurHubShowcase onScheduleVisit={handleVisit} />);

    expect(screen.getByText(/Direct Elite Talent Pipelines/i)).toBeInTheDocument();
    expect(screen.getByText(/MNIT Jaipur, BITS Pilani/i)).toBeInTheDocument();
    expect(screen.getByText(/Follow-The-Sun 24\/7 Timezone Coverage/i)).toBeInTheDocument();

    for (const cert of jaipurHubData.certifications) {
      expect(screen.getByText(cert)).toBeInTheDocument();
    }
  });

  it('triggers onScheduleVisit callback when clicking schedule button', () => {
    const handleVisit = vi.fn();
    render(<JaipurHubShowcase onScheduleVisit={handleVisit} />);

    const visitBtn = screen.getByRole('button', { name: /Schedule an In-Person Visit to our WTP Campus/i });
    fireEvent.click(visitBtn);

    expect(handleVisit).toHaveBeenCalledTimes(1);
  });
});
