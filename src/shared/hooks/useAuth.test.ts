import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mocks
const mockNavigate = vi.fn();
const mockSetUser = vi.fn();
const mockSetIsAuthenticated = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('store/app/AuthStore', () => ({
  useAuthActions: () => ({
    setUser: mockSetUser,
    setIsAuthenticated: mockSetIsAuthenticated,
  }),
}));

// Helper to reset localStorage before each test
beforeEach(() => {
  localStorage.clear();
  vi.resetAllMocks();
});

// Define window.location as writable for test that manipulates it
Object.defineProperty(window, 'location', {
  writable: true,
  value: { href: '' },
});

import { useAuth } from './useAuth';
describe('useAuth hook', () => {
  describe('validateExistingToken', () => {
    it('should navigate to /auth/login when no token is found', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.validateExistingToken();
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith('No auth token found');
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
      consoleWarnSpy.mockRestore();
    });

    it('should remove token and navigate when token validation response is not ok', async () => {
      localStorage.setItem('auth_token', 'dummy-token');
      // Mock fetch to return a response with ok: false
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
      } as unknown as Response);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.validateExistingToken();
      });

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });

    it('should remove token and navigate when token validation returns invalid data', async () => {
      localStorage.setItem('auth_token', 'dummy-token');
      // Mock fetch to return ok but with invalid data
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ valid: false, user: null }),
      } as unknown as Response);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.validateExistingToken();
      });

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });

    it('should set user and mark as authenticated when token is valid', async () => {
      const userData = { id: 1, name: 'John Doe' };
      localStorage.setItem('auth_token', 'valid-token');
      // Mock fetch to return ok with valid data
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ valid: true, user: userData }),
      } as unknown as Response);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.validateExistingToken();
      });

      expect(mockSetUser).toHaveBeenCalledWith(userData);
      expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
    });
  });

  describe('logout', () => {
    it('should clear token, update auth state, and redirect to login', () => {
      localStorage.setItem('auth_token', 'dummy-token');

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.logout();
      });

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
      expect(mockSetUser).toHaveBeenCalledWith(null);
      expect(window.location.href).toBe('/auth/login');
    });
  });
});
