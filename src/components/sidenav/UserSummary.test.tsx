import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { UserSummary } from './UserSummary';
import * as useAuthModule from 'shared/hooks/useAuth';
import * as authStateModule from 'store/app/AuthStore';

// Default mocks: no user and a noop logout
vi.mock('shared/hooks/useAuth', () => ({ useAuth: () => ({ logout: vi.fn() }) }));
vi.mock('store/app/AuthStore', () => ({ useAuthState: () => ({ user: null }) }));

describe('UserSummary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when there is no user', () => {
    const { container } = render(<UserSummary />);
    expect(container).toBeEmptyDOMElement();
  });

  it('displays user info and calls logout on button click', () => {
    const logoutMock = vi.fn();

    // Spy on modules and override implementation for this test
    vi.spyOn(authStateModule, 'useAuthState').mockReturnValue({
      user: { name: 'Jane Doe', email: 'jane@example.com', avatarUrl: 'avatar.png' },
    } as unknown as ReturnType<typeof authStateModule.useAuthState>);

    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({ logout: logoutMock } as unknown as ReturnType<typeof useAuthModule.useAuth>);

    render(<UserSummary />);

    expect(screen.getByText('jane@example.com')).toBeInTheDocument();

    const img = screen.getByRole('img', { name: 'Jane Doe' });
    expect(img).toHaveAttribute('src', 'avatar.png');

    const btn = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(btn);
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
