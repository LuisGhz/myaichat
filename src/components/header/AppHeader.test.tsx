import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// We'll swap the implementation of the hooks per-test using vitest's mock API
const mockSetSideNavCollapsed = vi.fn();
vi.mock('store/app/AppStore', async () => {
  // provide placeholders that tests will override via vi.mocked
  return {
    useAppStore: () => ({ sideNavCollapsed: true }),
    useAppStoreActions: () => ({ setSideNavCollapsed: mockSetSideNavCollapsed }),
  };
});

import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and shows expand button when sideNavCollapsed is true', async () => {
    // override mocked hook to return collapsed = true
    const mod = await import('store/app/AppStore');
  vi.spyOn(mod, 'useAppStore').mockImplementation(() => ({ sideNavCollapsed: true, chatsSummary: [], isGettingNewChat: false }));
  vi.spyOn(mod, 'useAppStoreActions').mockImplementation(() => ({ setSideNavCollapsed: mockSetSideNavCollapsed, setChatsSummary: () => {}, setIsGettingNewChat: () => {} }));

    render(<AppHeader />);

    expect(screen.getByText(/My AI Chat/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /expand side navigation/i });
    expect(btn).toBeInTheDocument();

    await userEvent.click(btn);
    expect(mockSetSideNavCollapsed).toHaveBeenCalledWith(false);
  });

  it('does not show expand button when sideNavCollapsed is false', async () => {
    const mod = await import('store/app/AppStore');
  vi.spyOn(mod, 'useAppStore').mockImplementation(() => ({ sideNavCollapsed: false, chatsSummary: [], isGettingNewChat: false }));
  vi.spyOn(mod, 'useAppStoreActions').mockImplementation(() => ({ setSideNavCollapsed: mockSetSideNavCollapsed, setChatsSummary: () => {}, setIsGettingNewChat: () => {} }));

    render(<AppHeader />);

    expect(screen.getByText(/My AI Chat/i)).toBeInTheDocument();
    const btns = screen.queryAllByRole('button', { name: /expand side navigation/i });
    expect(btns).toHaveLength(0);
  });
});
