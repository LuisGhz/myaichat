import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as MicrophoneService from 'services/Microphone.service';
import * as ChatStore from 'store/features/chat/useCurrentChatStore';
import * as ToastHook from '../../useToast';
import { useMicrophone } from './useMicrophone';

describe('useMicrophone', () => {
  let mockTranscribeAudioService: ReturnType<typeof vi.fn>;
  let mockSetIsSendingAudio: ReturnType<typeof vi.fn>;
  let mockToastError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockTranscribeAudioService = vi.fn();
    mockSetIsSendingAudio = vi.fn();
    mockToastError = vi.fn();

    vi.spyOn(MicrophoneService, 'transcribeAudioService').mockImplementation(mockTranscribeAudioService);
    vi.spyOn(ChatStore, 'useCurrentChatStoreSetIsSendingAudio').mockReturnValue(mockSetIsSendingAudio);
    vi.spyOn(ToastHook, 'useToast').mockReturnValue({
      toastError: mockToastError,
      toastSuccess: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call transcribeAudioService and setIsSendingAudio correctly on success', async () => {
    const mockBlob = new Blob(['test'], { type: 'audio/wav' });
    const mockResult = { text: 'transcribed text' };
    mockTranscribeAudioService.mockResolvedValueOnce(mockResult);

    const { result } = renderHook(() => useMicrophone());

    let returned;
    await act(async () => {
      returned = await result.current.transcribeAudio(mockBlob);
    });

    expect(mockSetIsSendingAudio).toHaveBeenCalledTimes(2);
    expect(mockSetIsSendingAudio).toHaveBeenNthCalledWith(1, true);
    expect(mockTranscribeAudioService).toHaveBeenCalledWith(mockBlob);
    expect(mockSetIsSendingAudio).toHaveBeenNthCalledWith(2, false);
    expect(returned).toBe(mockResult);
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('should handle errors and call toastError on failure', async () => {
    const mockBlob = new Blob(['test'], { type: 'audio/wav' });
    const mockError = new Error('fail');
    mockTranscribeAudioService.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useMicrophone());
    let returned;
    await act(async () => {
      returned = await result.current.transcribeAudio(mockBlob);
    });

    expect(mockSetIsSendingAudio).toHaveBeenCalledTimes(2);
    expect(mockSetIsSendingAudio).toHaveBeenNthCalledWith(1, true);
    expect(mockSetIsSendingAudio).toHaveBeenNthCalledWith(2, false);
    expect(mockTranscribeAudioService).toHaveBeenCalledWith(mockBlob);
    expect(mockToastError).toHaveBeenCalledWith(
      'Error transcribing audio. Please try again or try later.'
    );
    expect(returned).toBeUndefined();
  });
});
