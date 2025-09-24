import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodeBlock } from './CodeBlock';

// Helper to render the component. Tests should call renderComponent() to avoid repetition.
const renderComponent = (children: string, className?: string) => {
  return render(<CodeBlock className={className}>{children}</CodeBlock>);
};

describe('CodeBlock', () => {
  let user: ReturnType<typeof userEvent.setup>;
  type NavWithClipboard = Navigator & {
    clipboard?: {
      writeText: (...args: unknown[]) => Promise<void> | void;
    };
  };
  const nav = globalThis.navigator as NavWithClipboard;
  const originalClipboard = nav.clipboard;

  beforeEach(() => {
    user = userEvent.setup();
    // Provide a mock clipboard if not present and ensure writeText is mocked
    if (!nav.clipboard) {
      Object.defineProperty(nav, 'clipboard', {
        value: { writeText: vi.fn() },
        configurable: true,
      });
    } else {
      nav.clipboard.writeText = vi.fn();
    }
  });

  afterEach(() => {
    // restore clipboard if original existed
    try {
      if (originalClipboard === undefined) {
        // remove the property if we added it
        // some environments disallow delete; guard with try/catch
        try {
          // delete is used on global navigator for cleanup in tests
          delete (nav as Partial<NavWithClipboard>).clipboard;
        } catch {
          // ignore delete failures in some runtimes
        }
      } else {
        Object.defineProperty(nav, 'clipboard', { value: originalClipboard, configurable: true });
      }
    } catch {
      // ignore in environments where reassignment is restricted
    }
    vi.restoreAllMocks();
  });

  it('renders children inside a code block', () => {
    renderComponent('const a = 1;');
    expect(screen.getByText('const a = 1;')).toBeDefined();
  });

  it('copies code to clipboard when copy button is clicked', async () => {
    renderComponent('line1\nline2');

    const button = screen.getByRole('button', { name: /copy/i });
    await user.click(button);

  // Expect writeText to be called with the code's text
  expect(nav.clipboard?.writeText).toHaveBeenCalledWith('line1\nline2');

    // After successful copy, the button shows Copied! text
    await waitFor(() => expect(screen.getByText(/copied!/i)).toBeTruthy());
  });

  it('shows error path when clipboard writeText rejects', async () => {
  // Make writeText reject
  Object.defineProperty(nav, 'clipboard', {
    value: { writeText: vi.fn().mockRejectedValue(new Error('No access')) },
    configurable: true,
  });

    // Spy on console.error to assert it's called
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderComponent('some code');
    const button = screen.getByRole('button', { name: /copy/i });
    await user.click(button);

  await waitFor(() => expect(consoleErrorMock).toHaveBeenCalled());

    consoleErrorMock.mockRestore();
  });

  it('trims a trailing newline before copying', async () => {
    renderComponent('abc\n');
    const button = screen.getByRole('button', { name: /copy/i });
    await user.click(button);

  expect(nav.clipboard?.writeText).toHaveBeenCalledWith('abc');
  });
});
