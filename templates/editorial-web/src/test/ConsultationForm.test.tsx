import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConsultationForm } from '../components/ConsultationForm';

describe('ConsultationForm Component', () => {
  it('renders form fields with labels and inputs', () => {
    render(<ConsultationForm />);

    expect(screen.getByText(/Full Name \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Work Email \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone \/ WhatsApp Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Organization \/ Company/i)).toBeInTheDocument();
    expect(screen.getByText(/Consulting Domain/i)).toBeInTheDocument();
    expect(screen.getByText(/Target Budget Tier/i)).toBeInTheDocument();
    expect(screen.getByText(/Project Brief & Architectural Requirements/i)).toBeInTheDocument();
    expect(screen.getByText(/Request Mutual Non-Disclosure Agreement/i)).toBeInTheDocument();
  });

  it('validates empty inputs and displays error message', () => {
    const { container } = render(<ConsultationForm />);

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    expect(screen.getByText(/Please provide your name and work email address\./i)).toBeInTheDocument();
  });

  it('validates invalid email format and displays error message', () => {
    const { container } = render(<ConsultationForm />);

    const nameInput = screen.getByPlaceholderText(/e\.g\. Ankit Sharma/i);
    const emailInput = screen.getByPlaceholderText(/sarah@company\.com/i);
    const form = container.querySelector('form')!;

    fireEvent.change(nameInput, { target: { value: 'Vikram Singh' } });
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.submit(form);

    expect(screen.getByText(/Please enter a valid business email address\./i)).toBeInTheDocument();
  });

  it('pre-fills initialService and initialQuote when passed', () => {
    render(
      <ConsultationForm
        initialService="Applied AI & Autonomous Agents"
        initialQuote="Project: AI | Est: $30,000"
      />
    );

    expect(screen.getByDisplayValue(/Applied AI & Autonomous Agents/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Project: AI \| Est: \$30,000/i)).toBeInTheDocument();
  });

  it('renders modal dialog when isOpenModal is true and invokes onCloseModal', () => {
    const handleClose = vi.fn();
    render(<ConsultationForm isOpenModal={true} onCloseModal={handleClose} />);

    expect(screen.getByText(/Book Free Architectural Consultation/i)).toBeInTheDocument();
    expect(screen.getByText(/Build Swift • Jaipur Office/i)).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button');
    const xButton = closeButtons.find(b => b.querySelector('svg.lucide-x'));
    expect(xButton).toBeDefined();
    if (xButton) {
      fireEvent.click(xButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('submits form successfully when valid details are provided', async () => {
    render(<ConsultationForm />);

    const nameInput = screen.getByPlaceholderText(/e\.g\. Ankit Sharma/i);
    const emailInput = screen.getByPlaceholderText(/sarah@company\.com/i);
    const companyInput = screen.getByPlaceholderText(/Acme Enterprises Inc\./i);
    const submitBtn = screen.getByRole('button', { name: /Submit RFP/i });

    fireEvent.change(nameInput, { target: { value: 'Rajesh Sharma' } });
    fireEvent.change(emailInput, { target: { value: 'rajesh@cloudtech.com' } });
    fireEvent.change(companyInput, { target: { value: 'CloudTech Jaipur' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Transmitting to Jaipur Architect Pod\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Consultation Request Received!/i)).toBeInTheDocument();
      expect(screen.getByText(/Rajesh Sharma/i)).toBeInTheDocument();
      expect(screen.getByText(/Within 4 Business Hours/i)).toBeInTheDocument();
      expect(screen.getByText(/Auto-Draft Dispatched to rajesh@cloudtech\.com/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
