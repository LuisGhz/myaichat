import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { LoginErrors } from './LoginErrors';

// Create a mock function that the module factory will use. Declare before vi.mock so
// tests can set its return value per-case.
const useSearchParamsMock = vi.fn();

vi.mock('react-router', () => ({
  useSearchParams: () => useSearchParamsMock(),
}));

describe('LoginErrors', () => {
  const mockUseSearchParams = (params: Record<string, string | null>) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== null) qs.set(k, v);
    });
    useSearchParamsMock.mockReturnValue([qs]);
  };

  const renderComponent = () => render(<LoginErrors />);

  beforeEach(() => {
    useSearchParamsMock.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders nothing when there is no error', () => {
    mockUseSearchParams({ error: null, message: null });
    renderComponent();
    expect(screen.queryByText(/Invalid or expired token/i)).toBeNull();
    expect(screen.queryByText(/Validation failed/i)).toBeNull();
    expect(screen.queryByText(/Network error/i)).toBeNull();
  });

  it('shows invalid token message for invalid_token error', () => {
    mockUseSearchParams({ error: 'invalid_token', message: null });
    renderComponent();
    expect(screen.getByText(/Invalid or expired token/i)).toBeInTheDocument();
  });

  it('shows validation failed message for validation_failed error', () => {
    mockUseSearchParams({ error: 'validation_failed', message: null });
    renderComponent();
    expect(screen.getByText(/Validation failed/i)).toBeInTheDocument();
  });

  it('shows network error message for network_error error', () => {
    mockUseSearchParams({ error: 'network_error', message: null });
    renderComponent();
    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
  });

  it('shows custom message when unknown error with message param', () => {
    mockUseSearchParams({ error: 'some_other_error', message: 'Custom message' });
    renderComponent();
    expect(screen.getByText(/Custom message/i)).toBeInTheDocument();
  });

  it('shows generic unknown error when unknown error without message', () => {
    mockUseSearchParams({ error: 'some_other_error', message: null });
    renderComponent();
    expect(screen.getByText(/An unknown error occurred/i)).toBeInTheDocument();
  });
});
