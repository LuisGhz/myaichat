import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { MessageActionButtons } from './MessageActionButtons';

describe('MessageActionButtons', () => {
  const originalConsoleError = console.error;

  type ComponentProps = React.ComponentProps<typeof MessageActionButtons>;

  const renderComponent = (props?: Partial<ComponentProps>) => {
    const defaultProps: ComponentProps = { role: 'Assistant', content: 'Hello world' };
    return render(<MessageActionButtons {...defaultProps} {...(props as Partial<ComponentProps>)} />);
  };

  beforeEach(() => {
    // mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    console.error = vi.fn();
  });

  afterEach(() => {
    // restore console
    console.error = originalConsoleError;
    vi.restoreAllMocks();
  });

  it('renders audio and copy buttons', async () => {
    renderComponent();

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
  });

  it('copies content to clipboard when copy button clicked', async () => {
    renderComponent({ content: 'Copy this' });

    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[1]);

    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copy this'));
  });

  it('shows the check icon briefly after copying and then hides it', async () => {
    // use real timers to avoid interfering with userEvent internals
    renderComponent({ content: 'Short lived' });

    const buttons = screen.getAllByRole('button');
    const initialInner = buttons[1].innerHTML;

    // click synchronously to avoid userEvent timing complexity with fake timers
    buttons[1].click();

    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Short lived'));

    // after click, the innerHTML should change to show the check icon
    expect(buttons[1].innerHTML).not.toBe(initialInner);

    // wait slightly longer than the component timeout (1000ms) for it to reset
    await new Promise((res) => setTimeout(res, 1100));

  expect(buttons[1].innerHTML).toBe(initialInner);
  });

  it('applies correct alignment class based on role prop', () => {
    const { container, rerender } = renderComponent({ role: 'Assistant' });
    // assistant should have left-2 class on the section
    const section = container.querySelector('section');
    expect(section).toBeTruthy();
    if (section) {
      expect(section.className).toContain('left-2');
    }

    rerender(<MessageActionButtons role="User" content="x" />);
    const sectionUser = container.querySelector('section');
    expect(sectionUser).toBeTruthy();
    if (sectionUser) {
      expect(sectionUser.className).toContain('right-2');
    }
  });

  it('logs an error when clipboard write fails', async () => {
    // make clipboard reject
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('nope')),
      },
    });

  renderComponent({ content: 'Bad' });
  const buttons = screen.getAllByRole('button');
  // use direct click to avoid any userEvent timing with fake timers
  buttons[1].click();

  await waitFor(() => expect(console.error).toHaveBeenCalled());
  });
});
