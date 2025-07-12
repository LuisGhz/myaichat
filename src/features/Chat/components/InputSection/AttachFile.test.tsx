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

  describe("Clipboard functionality", () => {
    let mockClipboardRead: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      // Mock navigator.clipboard.read
      mockClipboardRead = vi.fn();
      Object.assign(navigator, {
        clipboard: {
          read: mockClipboardRead,
        },
      });
    });

    const renderComponent = () => {
      return render(<AttachFile onSelectImage={onSelectImageMock} />);
    };

    it("renders paste from clipboard option", () => {
      renderComponent();
      
      // Show the menu first
      fireEvent.click(screen.getByLabelText("Attach file"));
      
      expect(screen.getByText("Paste from Clipboard")).toBeInTheDocument();
      expect(screen.getByTestId("paste-from-clipboard")).toBeInTheDocument();
    });

    it("handles successful clipboard paste with valid image", async () => {
      const mockBlob = new Blob(["fake image data"], { type: "image/png" });
      const mockClipboardItem = {
        types: ["image/png"],
        getType: vi.fn().mockResolvedValue(mockBlob),
      };
      
      mockClipboardRead.mockResolvedValue([mockClipboardItem]);

      renderComponent();
      
      // Show menu and click paste option
      fireEvent.click(screen.getByLabelText("Attach file"));
      fireEvent.click(screen.getByTestId("paste-from-clipboard"));

      // Wait for async operation
      await vi.waitFor(() => {
        expect(onSelectImageMock).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "clipboard-image.png",
            type: "image/png"
          })
        );
      });
    });

    it("handles clipboard paste with invalid image", async () => {
      // Mock validateFiles to return false for this test
      vi.mocked(useAttachedFilesValidator).mockReturnValue({
        validateFiles: vi.fn().mockReturnValue(false),
      });

      const mockBlob = new Blob(["fake large image data"], { type: "image/png" });
      const mockClipboardItem = {
        types: ["image/png"],
        getType: vi.fn().mockResolvedValue(mockBlob),
      };
      
      mockClipboardRead.mockResolvedValue([mockClipboardItem]);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      renderComponent();
      
      // Show menu and click paste option
      fireEvent.click(screen.getByLabelText("Attach file"));
      fireEvent.click(screen.getByTestId("paste-from-clipboard"));

      // Wait for async operation
      await vi.waitFor(() => {
        expect(onSelectImageMock).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith(
          "Invalid file type or size exceeded."
        );
      });

      consoleSpy.mockRestore();
    });

    it("handles clipboard with no image content", async () => {
      const mockClipboardItem = {
        types: ["text/plain"],
        getType: vi.fn().mockResolvedValue(new Blob(["text content"], { type: "text/plain" })),
      };
      
      mockClipboardRead.mockResolvedValue([mockClipboardItem]);
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      renderComponent();
      
      // Show menu and click paste option
      fireEvent.click(screen.getByLabelText("Attach file"));
      fireEvent.click(screen.getByTestId("paste-from-clipboard"));

      // Wait for async operation
      await vi.waitFor(() => {
        expect(onSelectImageMock).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith("No image found in clipboard");
      });

      consoleSpy.mockRestore();
    });

    it("handles clipboard read error", async () => {
      mockClipboardRead.mockRejectedValue(new Error("Clipboard access denied"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      renderComponent();
      
      // Show menu and click paste option
      fireEvent.click(screen.getByLabelText("Attach file"));
      fireEvent.click(screen.getByTestId("paste-from-clipboard"));

      // Wait for async operation
      await vi.waitFor(() => {
        expect(onSelectImageMock).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to read clipboard:",
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });

    it("hides menu when paste from clipboard is clicked", () => {
      const { container } = renderComponent();
      const menu = container.querySelector("ul");
      
      // Mock clipboard to reject immediately (simulating error)
      mockClipboardRead.mockRejectedValue(new Error("Test error"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      // Show menu first
      fireEvent.click(screen.getByLabelText("Attach file"));
      expect(menu).not.toHaveClass("hidden");

      // Click paste option - menu should hide immediately regardless of clipboard result
      fireEvent.click(screen.getByTestId("paste-from-clipboard"));

      // Menu should be hidden immediately (synchronous operation)
      expect(menu).toHaveClass("hidden");

      consoleSpy.mockRestore();
    });
  });
});
