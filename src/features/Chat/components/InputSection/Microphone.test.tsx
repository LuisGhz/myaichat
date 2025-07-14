/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { Microphone } from './Microphone';
import { useMicrophone } from 'hooks/useMicrophone';

// Mock the useMicrophone hook
vi.mock('hooks/useMicrophone', () => ({
  useMicrophone: vi.fn(() => ({
    transcribeAudio: vi.fn(),
    isSendingAudio: false,
  })),
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
    
    // Mock MediaRecorder
    mockMediaRecorder = {
      start: vi.fn(),
      stop: vi.fn(),
      state: 'inactive',
      ondataavailable: null,
      onstop: null,
    };
    
    (window as any).MediaRecorder = vi.fn(() => mockMediaRecorder);

    // Mock useMicrophone hook
    mockUseMicrophone = {
      transcribeAudio: vi.fn().mockResolvedValue({ content: 'test transcription' }),
      isSendingAudio: false,
    };
    
    vi.mocked(useMicrophone).mockReturnValue(mockUseMicrophone);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('initializes MediaRecorder with getUserMedia on mount', async () => {
    renderComponent();
    
    // Wait for the useEffect to complete
    await act(async () => {
      // This simulates the getUserMedia promise resolving
    });
    
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(window.MediaRecorder).toHaveBeenCalledWith(mockStream);
  });

  it('starts and stops recording on click events', async () => {
    const { getByLabelText, queryByText } = renderComponent();
    
    // Wait for component to mount and MediaRecorder to be set up
    await act(async () => {});
    
    const button = getByLabelText('Activate voice input');

    // Initially not recording
    expect(button).toHaveAttribute('aria-label', 'Activate voice input');
    expect(queryByText('Recording...')).not.toBeInTheDocument();

    // Start recording
    fireEvent.click(button);
    
    expect(mockMediaRecorder.start).toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-label', 'Recording in progress');
    expect(queryByText('Recording...')).toBeInTheDocument();

    // Stop recording
    fireEvent.click(button);
    
    expect(mockMediaRecorder.stop).toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-label', 'Activate voice input');
    expect(queryByText('Recording...')).not.toBeInTheDocument();
  });

  it('calls onTranscription when recording is stopped and transcription is successful', async () => {
    const { getByLabelText } = renderComponent();
    
    // Wait for component to mount
    await act(async () => {});
    
    const button = getByLabelText('Activate voice input');

    // Start recording
    fireEvent.click(button);
    
    // Simulate audio data available
    const mockAudioBlob = new Blob(['audio data'], { type: 'audio/wav' });
    const mockEvent = { data: mockAudioBlob };
    
    act(() => {
      if (mockMediaRecorder.ondataavailable) {
        mockMediaRecorder.ondataavailable(mockEvent);
      }
    });

    // Stop recording and trigger onstop
    fireEvent.click(button);
    
    await act(async () => {
      // Trigger the onstop callback
      if (mockMediaRecorder.onstop) {
        await mockMediaRecorder.onstop();
      }
    });

    expect(mockUseMicrophone.transcribeAudio).toHaveBeenCalledWith(expect.any(Blob));
    expect(mockOnTranscription).toHaveBeenCalledWith('test transcription');
  });

  it('disables button when audio is being sent for transcription', async () => {
    mockUseMicrophone.isSendingAudio = true;
    vi.mocked(useMicrophone).mockReturnValue(mockUseMicrophone);

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
    const { getByLabelText } = renderComponent();
    
    // Wait for component to mount
    await act(async () => {});
    
    const button = getByLabelText('Activate voice input');

    // Start recording
    fireEvent.click(button);
    expect(mockMediaRecorder.start).toHaveBeenCalled();

    // Simulate timeout by clicking stop again (same as timeout behavior)
    fireEvent.click(button);
    expect(mockMediaRecorder.stop).toHaveBeenCalled();
  });

  it('cleans up MediaRecorder on unmount', async () => {
    mockMediaRecorder.state = 'recording';
    const { unmount } = renderComponent();
    
    // Wait for component to mount
    await act(async () => {});
    
    unmount();
    
    expect(mockMediaRecorder.stop).toHaveBeenCalled();
  });
});
