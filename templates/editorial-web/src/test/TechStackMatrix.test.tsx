import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TechStackMatrix } from '../components/TechStackMatrix';
import { techStackData } from '../data/techStackData';

describe('TechStackMatrix Component', () => {
  it('renders section title and tech cards with proficiency ratings', () => {
    render(<TechStackMatrix />);

    expect(screen.getByText(/Battle-Tested Engineering Stack/i)).toBeInTheDocument();
    expect(screen.getByText(/Technical Arsenal/i)).toBeInTheDocument();

    expect(screen.getByText(techStackData[0].name)).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(`${techStackData[0].proficiency}% Proficiency`, 'i')).length).toBeGreaterThan(0);
  });

  it('filters technologies by category pill buttons', () => {
    render(<TechStackMatrix />);

    // Filter by Security & Auth
    const secFilterBtn = screen.getByRole('button', { name: /Security & Auth/i });
    fireEvent.click(secFilterBtn);

    expect(screen.getByText('Zero Trust & OAuth2/OIDC')).toBeInTheDocument();
    expect(screen.getByText('HashiCorp Vault')).toBeInTheDocument();

    // Switch to Applied AI & RAG
    const aiFilterBtn = screen.getByRole('button', { name: /Applied AI & RAG/i });
    fireEvent.click(aiFilterBtn);

    expect(screen.getByText('LangGraph & LangChain')).toBeInTheDocument();
    expect(screen.getByText('Qdrant & pgvector')).toBeInTheDocument();

    // Reset to All Technologies
    const allFilterBtn = screen.getByRole('button', { name: /All Technologies/i });
    fireEvent.click(allFilterBtn);

    expect(screen.getByText('Kubernetes')).toBeInTheDocument();
    expect(screen.getByText('Terraform')).toBeInTheDocument();
  });
});
