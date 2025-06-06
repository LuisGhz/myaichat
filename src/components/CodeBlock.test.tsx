import { vi, describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useToast } from "hooks/useToast";
import { CodeBlock } from "./CodeBlock";

vi.mock("hooks/useToast");

describe("CodeBlock", () => {
  const mockWriteText = vi.fn(); // Create a fresh mock for each test
  const mockToast = vi.fn();
  // More robust way to mock navigator.clipboard
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: mockWriteText,
    },
    configurable: true, // Allows re-configuring for other tests if needed
    writable: true, // Allows re-assigning for other tests if needed
  });

  beforeEach(() => {
    vi.mocked(useToast).mockReturnValue({
      toastError: mockToast,
      toastSuccess: () => {},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Copy successfully", async () => {
    vi.useRealTimers();
    mockWriteText.mockResolvedValue(undefined); // Mock successful clipboard write

    render(<CodeBlock>test</CodeBlock>);

    const copyButton = screen.getByRole("button");

    // Check initial state: button text, title, and icon
    expect(copyButton).toHaveAttribute("title", "Copy code");
    expect(screen.getByText("Copy")).toBeInTheDocument();
    const initialIconPath = copyButton.querySelector("svg path");
    expect(initialIconPath).toHaveAttribute(
      "d",
      "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    );

    await userEvent.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith("test");

    await waitFor(() => {
      expect(copyButton).toHaveAttribute("title", "Copied!");
      expect(screen.getByText("Copied!")).toBeInTheDocument();
      const copiedIconPath = copyButton.querySelector("svg path");
      expect(copiedIconPath).toHaveAttribute("d", "M5 13l4 4L19 7");
    });

    await waitFor(
      () => {
        expect(copyButton).toHaveAttribute("title", "Copy code");
        expect(screen.getByText("Copy")).toBeInTheDocument();
        const revertedIconPath = copyButton.querySelector("svg path");
        expect(revertedIconPath).toHaveAttribute(
          "d",
          "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        );
      },
      { timeout: 2100 }
    );
  });

  it("handles clipboard write failures gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockWriteText.mockRejectedValue(new Error("Clipboard not available"));

    render(<CodeBlock>test</CodeBlock>);

    const copyButton = screen.getByRole("button");
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to copy text: ",
        expect.any(Error)
      );
    });

    // Should remain in "Copy" state
    expect(copyButton).toHaveAttribute("title", "Copy code");
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(mockToast).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
