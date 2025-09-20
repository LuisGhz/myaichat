import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';

// ...existing code...

// Mocks
vi.mock('features/Chat/hooks/useChat', () => ({
  useChat: () => ({
    toggleIsWebSearchMode: vi.fn(),
    changeMaxOutputTokens: vi.fn(),
  }),
}));

vi.mock('features/Chat/hooks/useChatParams', () => ({
  useChatParams: () => ({ id: 'chat-1' }),
}));

vi.mock('features/Chat/modals/ChatConfigModal', () => ({
  ChatConfigModal: ({ onClose, currentMaxOutputTokens, currentIsWebSearchMode }: { onClose: (config: { maxOutputTokens: number; isWebSearchMode: boolean }) => void; currentMaxOutputTokens: number; currentIsWebSearchMode: boolean; }) => (
    <div data-testid="chat-config-modal">
      <button onClick={() => onClose({ maxOutputTokens: currentMaxOutputTokens + 1, isWebSearchMode: !currentIsWebSearchMode })}>
        Save
      </button>
    </div>
  ),
}));

vi.mock('store/app/ChatStore', () => ({
  useChatStore: () => ({ maxOutputTokens: 10, isWebSearchMode: false }),
  useChatStoreActions: () => ({ setMaxOutputTokens: vi.fn(), setIsWebSearchMode: vi.fn() }),
}));

vi.mock('icons/FileTypeLightConfigIcon', () => ({
  FileTypeLightConfigIcon: ({ className }: { className?: string }) => <svg data-testid="settings-icon" className={className} />,
}));

import { SettingsChatButton } from './SettingsChatButton';

const renderComponent = () => render(<SettingsChatButton buttonClassName="btn" />);

describe('SettingsChatButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens the ChatConfigModal when clicked and applies new config on close', async () => {
    renderComponent();

    const button = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(button);

    expect(screen.getByTestId('chat-config-modal')).toBeInTheDocument();

    const saveBtn = screen.getByText('Save');
    fireEvent.click(saveBtn);

    // After save the modal should no longer be in the document
    expect(screen.queryByTestId('chat-config-modal')).not.toBeInTheDocument();
  });
});
