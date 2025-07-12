import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PasteFromClipboard } from "./PasteFromClipboard";
import { useAttachedFilesValidator } from "hooks/useAttachedFilesValidator";

vi.mock("hooks/useAttachedFilesValidator", () => ({
  useAttachedFilesValidator: vi.fn(),
}));

describe("PasteFromClipboard", () => {
  let mockClipboardRead: ReturnType<typeof vi.fn>;
  const onSelectImageMock = vi.fn();
  const setInfoDialogOpenMock = vi.fn();
  let optionsRef: React.RefObject<HTMLUListElement>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClipboardRead = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        read: mockClipboardRead,
      },
    });
    optionsRef = { current: document.createElement("ul") };
    optionsRef.current.classList.add("hidden");
    vi.mocked(useAttachedFilesValidator).mockReturnValue({
      validateFiles: vi.fn().mockReturnValue(true),
    });
  });

  const renderComponent = () => {
    return render(
      <ul ref={optionsRef as React.RefObject<HTMLUListElement>}>
        <PasteFromClipboard
          optionsRef={optionsRef as React.RefObject<HTMLUListElement>}
          setInfoDialogOpen={setInfoDialogOpenMock}
          onSelectImage={onSelectImageMock}
        />
      </ul>
    );
  };

  it("handles successful clipboard paste with valid image", async () => {
    const mockBlob = new Blob(["fake image data"], { type: "image/png" });
    const mockClipboardItem = {
      types: ["image/png"],
      getType: vi.fn().mockResolvedValue(mockBlob),
    };
    mockClipboardRead.mockResolvedValue([mockClipboardItem]);

    renderComponent();
    fireEvent.click(screen.getByTestId("paste-from-clipboard"));

    await vi.waitFor(() => {
      expect(onSelectImageMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "clipboard-image.png",
          type: "image/png",
        })
      );
    });
    expect(optionsRef.current).not.toBeNull();
    expect(optionsRef.current?.classList.contains("hidden")).toBe(true);
  });

  it("handles clipboard paste with invalid image", async () => {
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
    fireEvent.click(screen.getByTestId("paste-from-clipboard"));

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
      getType: vi
        .fn()
        .mockResolvedValue(new Blob(["text content"], { type: "text/plain" })),
    };
    mockClipboardRead.mockResolvedValue([mockClipboardItem]);
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    renderComponent();
    fireEvent.click(screen.getByTestId("paste-from-clipboard"));

    await vi.waitFor(() => {
      expect(onSelectImageMock).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith("No image found in clipboard.");
    });
    consoleSpy.mockRestore();
  });

  it("handles clipboard read error", async () => {
    mockClipboardRead.mockRejectedValue(new Error("Clipboard access denied"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderComponent();
    fireEvent.click(screen.getByTestId("paste-from-clipboard"));

    await vi.waitFor(() => {
      expect(onSelectImageMock).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to read clipboard contents:",
        expect.any(Error)
      );
    });
    consoleSpy.mockRestore();
  });

});
