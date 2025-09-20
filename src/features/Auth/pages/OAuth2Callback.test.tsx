import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// Mocks for react-router hooks
const navigateMock = vi.fn();
const searchParamsGetMock = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => navigateMock,
  useSearchParams: () => [{
    get: (key: string) => searchParamsGetMock(key),
  }],
}));

// Mock useAuth hook
const validateTokenWithBackendMock = vi.fn();
vi.mock('shared/hooks/useAuth', () => ({
  useAuth: () => ({
    validateTokenWithBackend: validateTokenWithBackendMock,
  }),
}));

import { OAuth2Callback } from './OAuth2Callback';

describe('OAuth2Callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('redirects to / when token is valid', async () => {
    searchParamsGetMock.mockImplementation((k: string) => (k === 'token' ? 'valid-token' : null));

    // Simulate successful backend validation returning { valid: true }
    validateTokenWithBackendMock.mockResolvedValueOnce({ ok: true, json: async () => ({ valid: true }) });

    render(<OAuth2Callback />);

    await waitFor(() => {
      expect(validateTokenWithBackendMock).toHaveBeenCalledWith('valid-token');
      expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  test('removes token and redirects to login when validation fails (backend ok=false)', async () => {
    searchParamsGetMock.mockImplementation((k: string) => (k === 'token' ? 'bad-token' : null));

    validateTokenWithBackendMock.mockResolvedValueOnce({ ok: false });

    // ensure localStorage is available
    const localStorageRemoveSpy = vi.spyOn(Storage.prototype, 'removeItem');

    render(<OAuth2Callback />);

    await waitFor(() => {
      expect(validateTokenWithBackendMock).toHaveBeenCalledWith('bad-token');
      expect(localStorageRemoveSpy).toHaveBeenCalledWith('auth_token');
      expect(navigateMock).toHaveBeenCalledWith('/auth/login?error=validation_failed');
    });
  });

  test('redirects to login with error when search params include error', async () => {
    searchParamsGetMock.mockImplementation((k: string) => {
      if (k === 'error') return 'access_denied';
      if (k === 'message') return 'user denied permission';
      return null;
    });

    render(<OAuth2Callback />);

    await waitFor(() => {
      const params = new URLSearchParams();
      params.set('error', 'access_denied');
      params.set('message', 'user denied permission');
      expect(navigateMock).toHaveBeenCalledWith(`/auth/login?${params.toString()}`);
    });
  });

  test('redirects to login with no_token when no token or error present', async () => {
    searchParamsGetMock.mockReturnValue(null);

    render(<OAuth2Callback />);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/auth/login?error=no_token');
    });
  });
});
