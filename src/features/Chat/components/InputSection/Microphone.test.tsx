/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, fireEvent, act } from '@testing-library/react';
import { Microphone } from './Microphone';

describe('Microphone', () => {
  let mockRecognition: any;
  let mockOnTranscription: any;

  beforeEach(() => {
    mockOnTranscription = vi.fn();
    mockRecognition = {
      start: vi.fn(),
      stop: vi.fn(),
      abort: vi.fn(),
      continuous: false,
      interimResults: false,
      onresult: () => {},
      onerror: () => {},
    };
    window.SpeechRecognition = vi.fn(() => mockRecognition);
    window.webkitSpeechRecognition = vi.fn(() => mockRecognition);
  });

  afterEach(() => {
    vi.resetAllMocks();
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;
  });

  it('alerts when speech recognition is not supported', () => {
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const { getByRole } = render(<Microphone onTranscription={mockOnTranscription} />);
    const button = getByRole('button');
    fireEvent.mouseDown(button);

    expect(alertSpy).toHaveBeenCalledWith(
      'Speech recognition is not supported in your browser.'
    );
    alertSpy.mockRestore();
  });

  it('starts and stops recording on mouse events', () => {
    const { getByRole, queryByText } = render(<Microphone onTranscription={mockOnTranscription} />);
    const button = getByRole('button');

    // Start recording
    fireEvent.mouseDown(button);
    expect(mockRecognition.start).toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-label', 'Recording in progress');
    expect(queryByText('Recording...')).toBeInTheDocument();

    // Stop recording
    fireEvent.mouseUp(button);
    expect(mockRecognition.stop).toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-label', 'Activate voice input');
    expect(queryByText('Recording...')).not.toBeInTheDocument();
  });

  it('calls onTranscription when final result is received', () => {
    render(<Microphone onTranscription={mockOnTranscription} />);
    const event = {
      results: [
        { 0: { transcript: 'hello world' }, isFinal: true }
      ]
    } as any;

    act(() => {
      mockRecognition.onresult(event);
    });

    expect(mockOnTranscription).toHaveBeenCalledWith('hello world');
  });

  it('sets continuous and interimResults flags to true', () => {
    render(<Microphone onTranscription={mockOnTranscription} />);
    expect(mockRecognition.continuous).toBe(true);
    expect(mockRecognition.interimResults).toBe(true);
  });
});
