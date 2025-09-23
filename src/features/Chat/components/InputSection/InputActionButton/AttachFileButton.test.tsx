import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, beforeEach, afterEach, expect } from "vitest";

// Mock icons and modal to keep tests focused on AttachFileButton behaviour
vi.mock("icons/PaperClipIcon", () => ({
  PaperClipIcon: ({ className }: { className?: string }) => (
    <svg data-testid="paperclip" className={className} />
  ),
}));

vi.mock("./UploadFromSelection", () => ({
  UploadFromSelection: (props: {
    onSelectFile: (f: File) => void;
    setInfoDialogOpen: (b: boolean) => void;
    optionsRef?: unknown;
  }) => (
    <li>
      <button
        onClick={() =>
          props.onSelectFile(new File(["a"], "a.png", { type: "image/png" }))
        }
      >
        upload
      </button>
      <button onClick={() => props.setInfoDialogOpen(true)}>openInfo</button>
    </li>
  ),
}));

// Provide a simple mock for the lazily-loaded PasteFromClipboard
vi.mock("./PasteFromClipboard", () => ({
  PasteFromClipboard: () => <li>paste</li>,
}));

// Mock InfoModal so we can assert its presence and interact with its onConfirm
vi.mock("core/modals/InfoModal", () => ({
  InfoModal: ({
    isOpen,
    message,
    onConfirm,
  }: {
    isOpen?: boolean;
    message?: string[];
    onConfirm: () => void;
  }) =>
    isOpen ? (
      <div role="dialog">
        <span>{message?.[0]}</span>
        <button onClick={onConfirm}>ok</button>
      </div>
    ) : null,
}));

import * as ChatStore from "store/app/ChatStore";
import * as Antd from "antd";
import { AttachFileButton } from "./AttachFileButton";

describe("AttachFileButton", () => {
  // Helper to render component with configurable mocked hook/grid state
  const renderComponent = async (opts?: {
    isRecording?: boolean;
    isSending?: boolean;
    md?: boolean;
  }) => {
    const isRecording = opts?.isRecording ?? false;
    const isSending = opts?.isSending ?? false;
    const md = opts?.md ?? false;

    // Spy on the chat store hook to control audio states
      vi.spyOn(ChatStore, "useChatStore").mockReturnValue({
        isRecordingAudio: isRecording,
        isSendingAudio: isSending,
      } as unknown as ReturnType<typeof ChatStore.useChatStore>);
    // Spy on antd Grid.useBreakpoint to control isMobile logic
    vi.spyOn(Antd.Grid, "useBreakpoint").mockReturnValue({
      md,
    } as unknown as Record<string, boolean>);
    // AttachFileButton no longer accepts onSelectFile prop; it uses store actions.
    render(<AttachFileButton buttonClassName="btn" />);
    return {};
  };

  beforeEach(() => {
    // ensure clean module mocks/spies between tests
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders the attach button and toggles the options list", async () => {
    await renderComponent({ isRecording: false, isSending: false, md: true });

    const button = screen.getByLabelText("Attach file");
    expect(button).toBeInTheDocument();

    // options list starts hidden (has class 'hidden')
    const list = document.querySelector("ul");
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass("hidden");

    // click button to toggle
    await userEvent.click(button);
    expect(list).not.toHaveClass("hidden");

    // click again hides
    await userEvent.click(button);
    expect(list).toHaveClass("hidden");
  });

  it("hides the button when recording or sending audio", async () => {
    await renderComponent({ isRecording: true, isSending: false, md: true });
    const button = screen.getByLabelText("Attach file");
    expect(button).toHaveClass("hidden");

    // cleanup previous render before rendering again to avoid duplicate elements
    cleanup();

    // sending audio as well
    await renderComponent({ isRecording: false, isSending: true, md: true });
    const button2 = screen.getByLabelText("Attach file");
    expect(button2).toHaveClass("hidden");
  });

  it("calls onSelectFile when UploadFromSelection triggers a file select", async () => {
    // we want to assert that the store action setSelectedFile was called when child triggers selection
    const setSelectedFileMock = vi.fn();
    vi.spyOn(ChatStore, 'useChatStoreActions').mockReturnValue({ setSelectedFile: setSelectedFileMock } as unknown as ReturnType<typeof ChatStore.useChatStoreActions>);

    await renderComponent({ isRecording: false, isSending: false, md: true });

    const button = screen.getByLabelText("Attach file");
    await userEvent.click(button);

    // click the mocked upload child button
    const uploadBtn = screen.getByText("upload");
    await userEvent.click(uploadBtn);

    expect(setSelectedFileMock).toHaveBeenCalled();
    const calledWith = setSelectedFileMock.mock.calls[0][0];
    expect(calledWith).toBeInstanceOf(File);
    expect((calledWith as File).name).toBe("a.png");
  });

  it("opens the InfoModal when child requests and closes on confirm", async () => {
    await renderComponent({ isRecording: false, isSending: false, md: true });

    const button = screen.getByLabelText("Attach file");
    await userEvent.click(button);

    const openInfoBtn = screen.getByText("openInfo");
    await userEvent.click(openInfoBtn);

    // InfoModal mock renders a dialog with the first message
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("File type not supported");

    // click ok to close
    const ok = screen.getByText("ok");
    await userEvent.click(ok);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("renders the PasteFromClipboard lazy child when screen.md is false (desktop)", async () => {
    await renderComponent({ isRecording: false, isSending: false, md: false });

    // toggle menu to cause the lazy import to be mounted
    const button = screen.getByLabelText("Attach file");
    await userEvent.click(button);

    // our mock PasteFromClipboard renders text 'paste'
    const paste = await screen.findByText("paste");
    expect(paste).toBeInTheDocument();
  });
});
