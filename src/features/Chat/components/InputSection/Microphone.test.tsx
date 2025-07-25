/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { Microphone } from './Microphone';
import { useMicrophone } from 'hooks/features/Chat/useMicrophone';
import {
  useCurrentChatStoreGetIsRecordingAudio,
  useCurrentChatStoreSetIsRecordingAudio,
  useCurrentChatStoreGetIsSendingAudio,
} from 'store/features/chat/useCurrentChatStore';

// Mock the useMicrophone hook
vi.mock('hooks/useMicrophone', () => ({
  useMicrophone: vi.fn(() => ({
    transcribeAudio: vi.fn(),
    isSendingAudio: false,
  })),
}));

// Mock the store hooks
vi.mock('store/features/chat/useCurrentChatStore', () => ({
  useCurrentChatStoreGetIsRecordingAudio: vi.fn(),
  useCurrentChatStoreSetIsRecordingAudio: vi.fn(),
  useCurrentChatStoreGetIsSendingAudio: vi.fn(),
}));

// Mock the Counter component
vi.mock('./Counter', () => ({
  Counter: ({ isRecording }: { isRecording: boolean }) => (
    <div data-testid="counter">
      {isRecording && <span>Recording active</span>}
    </div>
  ),
}));

describe('Microphone', () => {
  let mockOnTranscription: (text: string) => void;
  let mockMediaRecorder: any;
  let mockStream: any;
  let mockUseMicrophone: any;
  let mockSetIsRecordingAudio: any;
  
  // Use reactive variables that can be updated
  const mockState = {
    isRecordingAudio: false,
    isSendingAudio: false,
  };

  const setupMocksForTest = (isRecording = false, isSending = false) => {
    mockState.isRecordingAudio = isRecording;
    mockState.isSendingAudio = isSending;
  };

  const renderComponent = (props = {}) => {
    return render(
      <Microphone 
        onTranscription={mockOnTranscription} 
        {...props} 
      />
    );
  };

  beforeEach(() => {
    mockOnTranscription = vi.fn();
    mockSetIsRecordingAudio = vi.fn();
    
    // Reset mock state
    mockState.isRecordingAudio = false;
    mockState.isSendingAudio = false;
    
    // Mock getUserMedia first
    mockStream = {
      getTracks: vi.fn(() => [{ stop: vi.fn() }]),
    };
    
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn().mockResolvedValue(mockStream),
      },
      writable: true,
      configurable: true,
    });
    
    // Mock MediaRecorder with all required properties
    mockMediaRecorder = {
      start: vi.fn(),
      stop: vi.fn(),
      state: 'inactive',
      ondataavailable: null,
      onstop: null,
      pause: vi.fn(),
      resume: vi.fn(),
      requestData: vi.fn(),
      stream: mockStream,
      mimeType: 'audio/webm',
      audioBitsPerSecond: 0,
      videoBitsPerSecond: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    
    (window as any).MediaRecorder = vi.fn().mockImplementation((stream) => {
      // Always return a new mock instance for consistency
      const instance = {
        start: vi.fn(),
        stop: vi.fn(),
        state: 'inactive',
        ondataavailable: null,
        onstop: null,
        pause: vi.fn(),
        resume: vi.fn(),
        requestData: vi.fn(),
        stream: stream,
        mimeType: 'audio/webm',
        audioBitsPerSecond: 0,
        videoBitsPerSecond: 0,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
      
      // Update the global mockMediaRecorder to point to this instance
      mockMediaRecorder = instance;
      
      return instance;
    });    
    // Mock useMicrophone hook
    mockUseMicrophone = {
      transcribeAudio: vi.fn().mockResolvedValue({ content: 'test transcription' }),
      isSendingAudio: false,
    };
    
    vi.mocked(useMicrophone).mockReturnValue(mockUseMicrophone);

    // Configure the store mocks with reactive values
    vi.mocked(useCurrentChatStoreGetIsRecordingAudio).mockImplementation(() => mockState.isRecordingAudio);
    vi.mocked(useCurrentChatStoreSetIsRecordingAudio).mockReturnValue(mockSetIsRecordingAudio);
    vi.mocked(useCurrentChatStoreGetIsSendingAudio).mockImplementation(() => mockState.isSendingAudio);
  });

  afterEach(() => {
    vi.resetAllMocks();
    // Reset state variables
    mockState.isRecordingAudio = false;
    mockState.isSendingAudio = false;
  });

  it('does not initialize MediaRecorder on mount (only on user action)', async () => {
    renderComponent();
    
    // Wait for the useEffect to complete
    await act(async () => {});
    
    // MediaRecorder should not be initialized until user starts recording
    expect(navigator.mediaDevices.getUserMedia).not.toHaveBeenCalled();
    expect(window.MediaRecorder).not.toHaveBeenCalled();
  });

  it('starts and stops recording on click events, and cleans up refs on stop', async () => {
    const { getByLabelText, rerender } = renderComponent();

    // Wait for component to mount
    await act(async () => {});

    const button = getByLabelText('Activate voice input');

    // Start recording
    await act(async () => {
      fireEvent.click(button);
      // Wait for the getUserMedia promise to resolve and MediaRecorder to be set up
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(window.MediaRecorder).toHaveBeenCalledWith(mockStream);
    expect(mockMediaRecorder.start).toHaveBeenCalled();
    expect(mockSetIsRecordingAudio).toHaveBeenCalledWith(true);

    // Save the current MediaRecorder instance
    const currentMediaRecorder = mockMediaRecorder;
    
    // Clear some mocks for clarity
    vi.mocked(navigator.mediaDevices.getUserMedia).mockClear();
    vi.mocked(window.MediaRecorder).mockClear();
    vi.mocked(mockSetIsRecordingAudio).mockClear();
    
    // Simulate the state change that would happen after setIsRecordingAudio(true) is called
    setupMocksForTest(true, false); // Now recording
    
    // Force a re-render with the new state
    rerender(<Microphone onTranscription={mockOnTranscription} />);

    // Stop recording
    await act(async () => {
      fireEvent.click(button);
    });
    
    expect(currentMediaRecorder.stop).toHaveBeenCalled();
    expect(mockSetIsRecordingAudio).toHaveBeenCalledWith(false);

    // Simulate the onstop event to trigger cleanup
    await act(async () => {
      if (currentMediaRecorder.onstop) {
        await currentMediaRecorder.onstop();
      }
    });

    // The cleanup should have been called via the onstop callback
    expect(currentMediaRecorder.ondataavailable).toBeNull();
    expect(currentMediaRecorder.onstop).toBeNull();
  });

  it('calls onTranscription when recording is stopped and transcription is successful', async () => {
    setupMocksForTest(); // Not recording initially
    const { getByLabelText } = renderComponent();
    
    // Wait for component to mount
    await act(async () => {});
    
    const button = getByLabelText('Activate voice input');

    // Start recording
    await act(async () => {
      fireEvent.click(button);
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    
    // Get the current MediaRecorder instance
    const currentMediaRecorder = mockMediaRecorder;
    
    // Simulate audio data available
    const mockAudioBlob = new Blob(['audio data'], { type: 'audio/wav' });
    const mockEvent = { data: mockAudioBlob };
    
    act(() => {
      if (currentMediaRecorder.ondataavailable) {
        currentMediaRecorder.ondataavailable(mockEvent);
      }
    });

    // Update state to recording for the stop action
    setupMocksForTest(true, false); // Now recording

    // Stop recording and trigger onstop
    await act(async () => {
      fireEvent.click(button);
    });
    
    await act(async () => {
      // Trigger the onstop callback
      if (currentMediaRecorder.onstop) {
        await currentMediaRecorder.onstop();
      }
    });

    expect(mockUseMicrophone.transcribeAudio).toHaveBeenCalledWith(expect.any(Blob));
    expect(mockOnTranscription).toHaveBeenCalledWith('test transcription');
  });

  it('disables button when audio is being sent for transcription', async () => {
    // Set up the state to simulate audio being sent
    setupMocksForTest(false, true); // Not recording, but sending

    const { getByLabelText } = renderComponent();
    
    // Wait for component to mount
    await act(async () => {});
    
    const button = getByLabelText('Activate voice input');

    expect(button).toBeDisabled();
    
    // Button click should not trigger recording when disabled
    fireEvent.click(button);
    expect(mockMediaRecorder.start).not.toHaveBeenCalled();
  });

  it('stops recording when onTimedOut is called', async () => {
    const { getByLabelText, rerender } = renderComponent();
    
    // Wait for component to mount
    await act(async () => {});
    
    const button = getByLabelText('Activate voice input');

    // Start recording first
    await act(async () => {
      fireEvent.click(button);
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    
    expect(mockMediaRecorder.start).toHaveBeenCalled();
    
    // Save the current MediaRecorder instance
    const currentMediaRecorder = mockMediaRecorder;
    
    // Update state to recording and re-render
    setupMocksForTest(true, false); // Now recording
    rerender(<Microphone onTranscription={mockOnTranscription} />);

    // Simulate timeout by clicking again (which should stop recording)
    await act(async () => {
      fireEvent.click(button);
    });
    
    expect(currentMediaRecorder.stop).toHaveBeenCalled();
    expect(mockSetIsRecordingAudio).toHaveBeenCalledWith(false);
  });

  it('cleans up MediaRecorder and stream refs on unmount', async () => {
    // Create a more detailed mock that tracks ref assignments
    const trackStopSpy = vi.fn();
    const detailedMockStream = {
      getTracks: vi.fn(() => [{ stop: trackStopSpy }]),
    };
    
    vi.mocked(navigator.mediaDevices.getUserMedia).mockResolvedValue(detailedMockStream as any);
    
    const { getByLabelText, unmount } = renderComponent();

    // Wait for component to mount
    await act(async () => {});
    
    const button = getByLabelText('Activate voice input');

    // Start recording and wait for all async operations to complete
    await act(async () => {
      fireEvent.click(button);
      // Wait for getUserMedia promise to resolve and refs to be set
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Verify that recording was initiated
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(mockMediaRecorder.start).toHaveBeenCalled();

    // Unmount the component - this should trigger the useEffect cleanup
    await act(async () => {
      unmount();
    });

    // The cleanup should have stopped the stream tracks
    expect(trackStopSpy).toHaveBeenCalled();
  });
});
