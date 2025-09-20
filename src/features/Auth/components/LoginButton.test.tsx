import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { LoginButton } from './LoginButton';

// render helper to follow project testing guidelines
const renderComponent = () => render(<LoginButton />);

describe('LoginButton', () => {
  const setWindowLocation = (hrefSpy: (val: string) => void) => {
    // Try to override window.location.href via defineProperty; if it fails, mock assign
    try {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'location');
  const original = descriptor?.value as unknown;
  Object.defineProperty(window, 'location', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: {
          get href() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (original as any)?.href ?? '';
          },
          set href(val: string) {
            hrefSpy(val);
          },
        },
      });
      return () => {
        // restore
        if (descriptor) Object.defineProperty(window, 'location', descriptor);
      };
    } catch {
      // fallback: spy on assign (ts-ignore to avoid strict typing issues in tests)
  // @ts-expect-error - mocking assign for test fallback
  const assignSpy = vi.spyOn(window.location, 'assign').mockImplementation((u: string) => hrefSpy(u));
      return () => {
        assignSpy.mockRestore();
      };
    }
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('navigates to oauth endpoint using VITE_API_URL as-is', async () => {
    // Setup env
    vi.stubEnv('VITE_API_URL', 'https://example.com');

    // replace window.location with a spyable href setter
  const hrefSpy = vi.fn();
  const restore = setWindowLocation(hrefSpy);

    const { getByRole } = renderComponent();
    await userEvent.click(getByRole('button', { name: /continue with github/i }));

  expect(hrefSpy).toHaveBeenCalledWith('https://example.com/oauth2/authorization/github');
  restore();
  });

  test('removes trailing /api from VITE_API_URL', async () => {
    vi.stubEnv('VITE_API_URL', 'https://example.com/api');

  const hrefSpy = vi.fn();
  const restore = setWindowLocation(hrefSpy);

  const { getByRole } = renderComponent();
  await userEvent.click(getByRole('button', { name: /continue with github/i }));

  expect(hrefSpy).toHaveBeenCalledWith('https://example.com/oauth2/authorization/github');
  restore();
  });

  test('replaces /myaichat/api with /myaichat', async () => {
    vi.stubEnv('VITE_API_URL', 'https://example.com/myaichat/api');

  const hrefSpy = vi.fn();
  const restore = setWindowLocation(hrefSpy);

  const { getByRole } = renderComponent();
  await userEvent.click(getByRole('button', { name: /continue with github/i }));

  expect(hrefSpy).toHaveBeenCalledWith('https://example.com/myaichat/oauth2/authorization/github');
  restore();
  });
});
