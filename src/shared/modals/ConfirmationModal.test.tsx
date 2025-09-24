import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmationModal } from './ConfirmationModal';

type Props = {
  message?: string[];
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
};

function renderComponent(props: Props = {}) {
  const defaultProps = {
    message: ['Are you sure?'],
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
  } as Required<Props>;

  return render(<ConfirmationModal {...defaultProps} {...props} />);
}

describe('ConfirmationModal', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders the provided message lines when open', () => {
    renderComponent({ message: ['Line 1', 'Line 2'], isOpen: true });

    expect(screen.getByText('Line 1')).toBeDefined();
    expect(screen.getByText('Line 2')).toBeDefined();
  });

  it('does not render content when closed', () => {
    renderComponent({ isOpen: false, message: ['Hidden'] });

    // The modal title should not be in the document when not open
    expect(screen.queryByText('Confirm Action')).toBeNull();
    expect(screen.queryByText('Hidden')).toBeNull();
  });

  it('calls onConfirm when OK is clicked', async () => {
    const onConfirmMock = vi.fn();
    renderComponent({ onConfirm: onConfirmMock });

    // Antd renders buttons with text like "OK" and "Cancel" by default
    const okButton = await screen.findByRole('button', { name: /ok/i });
    await user.click(okButton);

    await waitFor(() => expect(onConfirmMock).toHaveBeenCalledTimes(1));
  });

  it('calls onClose when Cancel is clicked', async () => {
    const onCloseMock = vi.fn();
    renderComponent({ onClose: onCloseMock });

    const cancelButton = await screen.findByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));
  });

  it('updates when message prop changes', async () => {
    const { rerender } = renderComponent({ message: ['First'], isOpen: true });

    expect(screen.getByText('First')).toBeDefined();

    rerender(<ConfirmationModal message={['Second']} isOpen={true} onClose={() => {}} onConfirm={() => {}} />);

    await waitFor(() => expect(screen.getByText('Second')).toBeDefined());
  });

  it('handles empty message array gracefully', () => {
    renderComponent({ message: [], isOpen: true });

    // Should render the modal but no message paragraphs
    // The modal title should be present
    expect(screen.getByText('Confirm action.')).toBeDefined();
  });
});
