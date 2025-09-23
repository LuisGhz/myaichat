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
  AttachFileButton: ({ buttonClassName, onSelectFile }: { buttonClassName?: string; onSelectFile?: (f: File) => void }) => (
    <button data-testid="attach" className={buttonClassName} onClick={() => onSelectFile?.(new File([''], 'test.txt'))} />
  ),
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

type TestProps = {
  onTranscription: (transcription: string) => void;
  onSelectFile: (file: File) => void;
};

const renderComponent = (props: Partial<TestProps> = {}) => {
  const defaultProps: TestProps = {
    onTranscription: () => {},
    onSelectFile: () => {},
  };

  return render(<InputActionButtons {...defaultProps} {...props} />);
};

describe('InputActionButtons', () => {
  it('renders settings, current metadata, attach and mic buttons when not recording', () => {
    renderComponent();

    expect(screen.getByTestId('settings')).toBeInTheDocument();
    expect(screen.getByTestId('current-meta')).toBeInTheDocument();
    expect(screen.getByTestId('attach')).toBeInTheDocument();
    expect(screen.getByTestId('mic')).toBeInTheDocument();
  });

  it('forwards onSelectFile to AttachFileButton and calls it when attach clicked', async () => {
    const onSelectFileMock = vi.fn<(file: File) => void>();

    renderComponent({ onSelectFile: onSelectFileMock });

    const attach = screen.getByTestId('attach');
    attach.click();

    expect(onSelectFileMock).toHaveBeenCalledTimes(1);
    const calledWith = onSelectFileMock.mock.calls[0][0] as File;
    expect(calledWith).toBeInstanceOf(File);
    expect(calledWith.name).toBe('test.txt');
  });
});
