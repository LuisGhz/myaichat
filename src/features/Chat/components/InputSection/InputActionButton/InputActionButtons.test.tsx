import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mocks
vi.mock('features/Chat/hooks/useChatParams', () => ({
  useChatParams: () => ({ id: 'chat-1' }),
}));

vi.mock('./SettingsChatButton', () => ({
  SettingsChatButton: ({ buttonClassName }: { buttonClassName?: string }) => <button data-testid="settings" className={buttonClassName} />,
}));

vi.mock('./CurrentChatMetadata', () => ({
  CurrentChatMetadata: ({ buttonClassName }: { buttonClassName?: string }) => <button data-testid="current-meta" className={buttonClassName} />,
}));

vi.mock('./AttachFileButton', () => ({
  AttachFileButton: ({ buttonClassName }: { buttonClassName?: string }) => <button data-testid="attach" className={buttonClassName} />,
}));

vi.mock('./MicrophoneButton', () => ({
  MicrophoneButton: ({ buttonClassName, onTranscription }: { buttonClassName?: string; onTranscription?: (t: string) => void }) => (
    <button data-testid="mic" className={buttonClassName} onClick={() => onTranscription?.('hi')} />
  ),
}));

vi.mock('store/app/ChatStore', () => ({
  useChatStore: () => ({ isRecordingAudio: false, isSendingAudio: false }),
}));

import { InputActionButtons } from './InputActionButtons';

const renderComponent = (props = { onTranscription: () => {} }) => render(<InputActionButtons {...props} />);

describe('InputActionButtons', () => {
  it('renders settings, current metadata, attach and mic buttons when not recording', () => {
    renderComponent();

    expect(screen.getByTestId('settings')).toBeInTheDocument();
    expect(screen.getByTestId('current-meta')).toBeInTheDocument();
    expect(screen.getByTestId('attach')).toBeInTheDocument();
    expect(screen.getByTestId('mic')).toBeInTheDocument();
  });
});
