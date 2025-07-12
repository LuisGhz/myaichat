import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AttachFile } from "./AttachFile";
import { useAttachedFilesValidator } from "hooks/useAttachedFilesValidator";

// Mock dependencies
vi.mock("assets/icons/PaperClipIcon", () => ({
  PaperClipIcon: () => <div data-testid="paper-clip-icon" />,
}));

vi.mock("hooks/useAttachedFilesValidator", () => ({
  useAttachedFilesValidator: vi.fn(),
}));

vi.mock("components/Dialogs/InfoDialog", () => ({
  InfoDialog: ({
    message,
    isOpen,
    onConfirm,
  }: {
    message: string[];
    isOpen: boolean;
    onConfirm: () => void;
  }) =>
    isOpen && (
      <div
        data-testid="info-dialog"
        style={{ display: isOpen ? "block" : "none" }}
      >
        {message.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
        <button onClick={onConfirm}>Ok</button>
      </div>
    ),
}));

vi.mock("./PasteFromClipboard", () => {
  return {
    PasteFromClipboard: () => (
      <li data-testid="paste-from-clipboard">Paste from Clipboard</li>
    ),
  };
});

describe("AttachFile", () => {
  const onSelectImageMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the validator hook to return a validateFiles function
    vi.mocked(useAttachedFilesValidator).mockReturnValue({
      validateFiles: vi.fn().mockReturnValue(true),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without crashing", () => {
    render(<AttachFile onSelectImage={onSelectImageMock} />);
    expect(screen.getByLabelText("Attach file")).toBeInTheDocument();
    expect(screen.getByTestId("paper-clip-icon")).toBeInTheDocument();
  });

  it("shows options menu when button is clicked", () => {
    render(<AttachFile onSelectImage={onSelectImageMock} />);

    const button = screen.getByLabelText("Attach file");
    fireEvent.click(button);

    expect(screen.getByText("Upload")).toBeVisible();
  });

  it("hides options menu when clicking outside", () => {
    const { container } = render(
      <AttachFile onSelectImage={onSelectImageMock} />
    );

    // First show the menu
    const button = screen.getByLabelText("Attach file");
    fireEvent.click(button);

    // Then click outside
    fireEvent.click(document.body);

    // Menu should now be hidden
    const menu = container.querySelector("ul");
    expect(menu).toHaveClass("hidden");
  });

  it("handles valid file selection correctly", () => {
    render(<AttachFile onSelectImage={onSelectImageMock} />);

    // Create a mock file
    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input");

    // Simulate file selection
    fireEvent.change(input, { target: { files: [file] } });

    // Check if onSelectImage was called with the file
    expect(onSelectImageMock).toHaveBeenCalledWith(file);
  });

  it("handles invalid file selection correctly", () => {
    // Mock validateFiles to return false for this test
    vi.mocked(useAttachedFilesValidator).mockReturnValue({
      validateFiles: vi.fn().mockReturnValue(false),
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<AttachFile onSelectImage={onSelectImageMock} />);

    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input");

    fireEvent.change(input, {
      target: { files: [file] },
    });

    // onSelectImage should not have been called
    expect(onSelectImageMock).not.toHaveBeenCalled();
    // Error should have been logged
    expect(consoleSpy).toHaveBeenCalledWith(
      "Invalid file type or size exceeded."
    );

    consoleSpy.mockRestore();
  });

  it("triggers file input click when Upload is clicked", () => {
    render(<AttachFile onSelectImage={onSelectImageMock} />);

    // Show the menu first
    fireEvent.click(screen.getByLabelText("Attach file"));

    // Get and mock the input
    const input = screen.getByTestId("file-input");
    const clickSpy = vi.spyOn(input, "click").mockImplementation(() => {});

    // Click Upload
    fireEvent.click(screen.getByText("Upload"));

    // Check if input.click() was called
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("does nothing when no file is selected", () => {
    render(<AttachFile onSelectImage={onSelectImageMock} />);

    const input = screen.getByTestId("file-input");

    // Simulate empty file selection
    fireEvent.change(input, { target: { files: [] } });

    expect(onSelectImageMock).not.toHaveBeenCalled();
  });

  it("toggles menu visibility on button click", () => {
    const { container } = render(
      <AttachFile onSelectImage={onSelectImageMock} />
    );
    const menu = container.querySelector("ul");
    const button = screen.getByLabelText("Attach file");

    // Menu should be hidden initially
    expect(menu).toHaveClass("hidden");

    // Click to show menu
    fireEvent.click(button);
    expect(menu).not.toHaveClass("hidden");

    // Click again to hide menu
    fireEvent.click(button);
    expect(menu).toHaveClass("hidden");
  });
});
