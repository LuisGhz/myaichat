import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ...existing code...
import { InputSection } from "./InputSection";

// Mocks for hooks and child components used inside InputSection
vi.mock("features/Chat/hooks/useChatParams", () => ({
  useChatParams: () => ({ id: "chat-1" }),
}));

const sendNewMessageMock = vi.fn();
vi.mock("features/Chat/hooks/useChat", () => ({
  useChat: () => ({ sendNewMessage: sendNewMessageMock }),
}));

vi.mock("store/app/ChatStore", () => ({
  useChatStore: () => ({
    model: "gpt-test",
    maxOutputTokens: 16,
    isWebSearchMode: false,
    promptId: undefined,
    isRecordingAudio: false,
    isSendingAudio: false,
  }),
}));

vi.mock("features/Chat/hooks/useStreamAssistantMessage", () => ({
  useStreamAssistantMessage: () => ({ startStreaming: vi.fn() }),
}));

vi.mock("store/app/AppStore", () => ({
  useAppStoreActions: () => ({ setIsGettingNewChat: vi.fn() }),
}));

vi.mock("icons/SendAltFilledIcon", () => ({
  SendAltFilledIcon: () => <svg data-testid="send-icon" />,
}));
vi.mock("./InputActionButton/InputActionButtons", () => ({
  // The real component receives onTranscription and onSelectFile props. Expose them via buttons in the mock
  InputActionButtons: ({
    onTranscription,
    onSelectFile,
  }: {
    onTranscription: (t: string) => void;
    onSelectFile: (f: File) => void;
  }) => (
    <div>
      <button
        data-testid="input-actions"
        onClick={() => onTranscription("transcribed text")}
      >
        trigger-transcription
      </button>
      <button
        data-testid="select-file"
        onClick={() => onSelectFile(new File(["content"], "test.txt"))}
      >
        select-file
      </button>
    </div>
  ),
}));
// Mock the lazily imported SelectedFilePreview so Suspense resolves in tests
vi.mock("./SelectedFilePreview", () => ({
  SelectedFilePreview: ({
    selectedFile,
    removeSelectedFile,
  }: {
    selectedFile: File;
    removeSelectedFile: () => void;
  }) => (
    <div data-testid="selected-file">
      {selectedFile.name}
      <button onClick={removeSelectedFile}>remove</button>
    </div>
  ),
}));
vi.mock("./AudioSendingLoader", () => ({
  AudioSendingLoader: () => <div data-testid="audio-loader" />,
}));

describe("InputSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(<InputSection />);
  };

  it("renders textarea and input action buttons", () => {
    renderComponent();
    expect(screen.getByLabelText(/Type a message/i)).toBeInTheDocument();
    expect(screen.getByTestId("input-actions")).toBeInTheDocument();
  });

  it("shows send button when text is entered and calls sendNewMessage on click", async () => {
    sendNewMessageMock.mockResolvedValue("chat-1");
    renderComponent();

    const textarea = screen.getByLabelText(/Type a message/i);
    await userEvent.type(textarea, "hello world");

    const sendButton = screen.getByRole("button", { name: /Send message/i });
    expect(sendButton).toBeInTheDocument();

    await userEvent.click(sendButton);

    await waitFor(() => {
      expect(sendNewMessageMock).toHaveBeenCalled();
    });
  });

  it("sends message on Ctrl+Enter", async () => {
    sendNewMessageMock.mockResolvedValue("chat-1");
    renderComponent();

    const textarea = screen.getByLabelText(/Type a message/i);
    await userEvent.type(textarea, "line1");

    // Simulate Ctrl+Enter
    await userEvent.keyboard("{Control>}{Enter}{/Control}");

    await waitFor(() => expect(sendNewMessageMock).toHaveBeenCalled());
  });

  it("appends transcription text via onTranscription", async () => {
    sendNewMessageMock.mockResolvedValue("chat-1");
    renderComponent();

    const textarea = screen.getByLabelText(
      /Type a message/i
    ) as HTMLTextAreaElement;
    // Start empty
    expect(textarea.value).toBe("");

    // Trigger the mocked child's button which calls the onTranscription prop
    const trigger = screen.getByTestId("input-actions");
    await userEvent.click(trigger);

    // The onTranscription adds the transcription text to the textarea
    expect(textarea.value).toBe("transcribed text");
  });
});
