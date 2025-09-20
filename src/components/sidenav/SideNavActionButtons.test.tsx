import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Mock react-router's useNavigate so we can assert navigation calls
const navigateMock = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

import { SideNavActionButtons } from './SideNavActionButtons';

describe('SideNavActionButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders both action buttons', () => {
    render(<SideNavActionButtons />);

    expect(screen.getByRole('button', { name: /New conversation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Prompts/i })).toBeInTheDocument();
  });

  it('navigates to /chat when New conversation is clicked', async () => {
    render(<SideNavActionButtons />);
    await userEvent.click(screen.getByRole('button', { name: /New conversation/i }));
    expect(navigateMock).toHaveBeenCalledWith('/chat');
  });

  it('navigates to /prompts when Prompts is clicked', async () => {
    render(<SideNavActionButtons />);
    await userEvent.click(screen.getByRole('button', { name: /Prompts/i }));
    expect(navigateMock).toHaveBeenCalledWith('/prompts');
  });
});
