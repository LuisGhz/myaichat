import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { vi } from "vitest";

// Static mocks for hooks and child components that don't change per-test
vi.mock("features/Chat/hooks/useMicrophone", () => ({
  useMicrophone: () => ({
    transcribeAudio: vi.fn().mockResolvedValue({ content: "transcribed" }),
  }),
}));

vi.mock("features/Chat/hooks/useAudioLevel", () => ({
  useAudioLevel: () => 0.5,
}));

vi.mock("./AudioWave", () => ({
  AudioWave: ({ level }: { level: number }) => (
    <div data-testid="audio-wave">level:{level}</div>
  ),
}));

vi.mock("icons/Microphone20SolidIcon", () => ({
  Microphone20SolidIcon: ({ className }: { className?: string }) => (
    <svg data-testid="mic-icon" className={className} />
  ),
}));
vi.mock("icons/SendAltFilledIcon", () => ({
  SendAltFilledIcon: ({ className }: { className?: string }) => (
    <svg data-testid="send-icon" className={className} />
  ),
}));
vi.mock("icons/TrashOutlineIcon", () => ({
  TrashOutlineIcon: ({ className }: { className?: string }) => (
    <svg data-testid="trash-icon" className={className} />
  ),
}));

describe("MicrophoneButton", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
    vi.resetModules();
    vi.clearAllMocks();
  });
  // helper to render component with a fresh store mock
  const renderComponent = async (
    storeMock: { isRecordingAudio: boolean; isSendingAudio: boolean },
    actionsMock?: Partial<{
      setIsRecordingAudio: (...args: unknown[]) => void;
      setIsSendingAudio: (...args: unknown[]) => void;
    }>,
    onTranscription?: (t: string) => void
  ) => {
    vi.doMock("store/app/ChatStore", () => ({
      useChatStore: () => ({
        isRecordingAudio: storeMock.isRecordingAudio,
        isSendingAudio: storeMock.isSendingAudio,
      }),
      useChatStoreActions: () => ({
        setIsRecordingAudio: actionsMock?.setIsRecordingAudio ?? vi.fn(),
        setIsSendingAudio: actionsMock?.setIsSendingAudio ?? vi.fn(),
      }),
    }));

    const { MicrophoneButton } = await import("./MicrophoneButton");
    return render(
      <MicrophoneButton
        buttonClassName="btn"
        onTranscription={onTranscription ?? (() => {})}
      />
    );
  };

  it("renders microphone icon when idle", async () => {
    await renderComponent({ isRecordingAudio: false, isSendingAudio: false });
    expect(screen.getByTestId("mic-icon")).toBeInTheDocument();
  });

  it("shows cancel button and audio wave when recording", async () => {
    await renderComponent({ isRecordingAudio: true, isSendingAudio: false });
    expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
    expect(screen.getByTestId("audio-wave")).toBeInTheDocument();
    expect(screen.getByTestId("send-icon")).toBeInTheDocument();
  });

  it("starts recording when clicked (calls getUserMedia, MediaRecorder.start and setIsRecordingAudio)", async () => {
    const stream = {
      getTracks: () => [{ stop: vi.fn() }],
    } as unknown as MediaStream;

    const startSpy = vi.fn();
    // Minimal mock MediaRecorder class
    class MockMediaRecorder {
      ondataavailable: ((e: BlobEvent) => void) | null = null;
      onstop: (() => void) | null = null;
      constructor(public _stream: MediaStream) {}
      start() {
        startSpy();
      }
      stop() {
        // noop: tests will call onstop manually
      }
    }

    // mock navigator.mediaDevices.getUserMedia and global MediaRecorder
    // assign on globalThis to be safe in test environment
    Object.defineProperty(globalThis, "MediaRecorder", {
      value: MockMediaRecorder,
      configurable: true,
    });
    Object.defineProperty(globalThis, "navigator", {
      value: {
        mediaDevices: { getUserMedia: vi.fn().mockResolvedValue(stream) },
        clipboard: { writeText: vi.fn(), readText: vi.fn() },
      },
      configurable: true,
    });

    const setIsRecordingAudio = vi.fn();
    await renderComponent(
      { isRecordingAudio: false, isSendingAudio: false },
      { setIsRecordingAudio }
    );

    const btn = screen.getByRole("button", { name: /voice input/i });
    fireEvent.click(btn);

    await waitFor(() =>
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        audio: true,
      })
    );
    await waitFor(() => expect(startSpy).toHaveBeenCalled());
    expect(setIsRecordingAudio).toHaveBeenCalledWith(true);

    // cleanup
    Reflect.deleteProperty(globalThis, "MediaRecorder");
    Reflect.deleteProperty(globalThis, "navigator");
  });

  it("transcribes audio after stop and calls onTranscription", async () => {
    const stream = {
      getTracks: () => [{ stop: vi.fn() }],
    } as unknown as MediaStream;

    const instances: unknown[] = [];

    class MockMediaRecorder {
      ondataavailable: ((e: BlobEvent) => void) | null = null;
      onstop: (() => void) | null = null;
      constructor(public _stream: MediaStream) {
        // store created instances for test to access
        instances.push(this);
      }
      start() {}
      stop() {}
    }
    Object.defineProperty(globalThis, "MediaRecorder", {
      value: MockMediaRecorder,
      configurable: true,
    });
    Object.defineProperty(globalThis, "navigator", {
      value: {
        mediaDevices: { getUserMedia: vi.fn().mockResolvedValue(stream) },
        clipboard: { writeText: vi.fn(), readText: vi.fn() },
      },
      configurable: true,
    });

    const onTranscriptionMock = vi.fn();
    // transcribeAudio mock from top-level vi.mock will be used; override to spy
    const transcribeMock = vi
      .fn()
      .mockResolvedValue({ content: "transcribed" });
    // re-mock useMicrophone to return our spy
    vi.doMock("features/Chat/hooks/useMicrophone", () => ({
      useMicrophone: () => ({ transcribeAudio: transcribeMock }),
    }));

    await renderComponent(
      { isRecordingAudio: false, isSendingAudio: false },
      { setIsRecordingAudio: vi.fn() },
      onTranscriptionMock
    );

    const btn = screen.getByRole("button", { name: /voice input/i });
    fireEvent.click(btn);

    // wait for MediaRecorder instance to be created
    await waitFor(() => expect(instances.length).toBeGreaterThan(0));
    const created = instances[0] as {
      ondataavailable: ((e: BlobEvent) => void) | null;
      onstop?: () => void;
    };

    // wait for handlers to be attached
    await waitFor(() => created.ondataavailable !== null);

    // simulate dataavailable events
    const blob = new Blob(["audio"], { type: "audio/wav" });
    if (created.ondataavailable) {
      created.ondataavailable({ data: blob } as unknown as BlobEvent);
    }

    // wait for onstop to be attached and call it
    await waitFor(() => typeof created.onstop === "function");
    await created.onstop?.();

    await waitFor(() => expect(transcribeMock).toHaveBeenCalled());
    await waitFor(() =>
      expect(onTranscriptionMock).toHaveBeenCalledWith("transcribed")
    );

    // cleanup
    Reflect.deleteProperty(globalThis, "MediaRecorder");
    Reflect.deleteProperty(globalThis, "navigator");
  });

  it("hides microphone/send icon when sending audio", async () => {
    await renderComponent({ isRecordingAudio: false, isSendingAudio: true });
    // main button should render nothing for icons when sending
    expect(screen.queryByTestId("mic-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("send-icon")).not.toBeInTheDocument();
  });
});
