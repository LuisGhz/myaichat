/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { SingleMessage } from "./SingleMessage";
import { useMarkDown } from "hooks/useMarkdown";
import { Message } from "types/chat/Message.type";

// Mock the useMarkDown hook
vi.mock("hooks/useMarkdown", () => ({
  useMarkDown: vi.fn(),
}));

vi.mock("assets/icons/CheckIcon", () => ({
  CheckIcon: () => <p>Copy</p>,
}));

vi.mock("assets/icons/DocumentDuplicateIcon", () => ({
  DocumentDuplicateIcon: () => <p>Copied!</p>,
}));

describe("SingleMessage", () => {
  const mockFormatToMarkdown = vi.fn();
  const mockWriteText = vi.fn();
  
  // Mock navigator.clipboard
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: mockWriteText,
    },
    configurable: true,
    writable: true,
  });

  beforeEach(() => {
    // Clear mock call history
    mockFormatToMarkdown.mockClear();
    mockWriteText.mockClear();
    
    // Mock the useMarkDown hook to return a function that renders content
    (useMarkDown as any).mockReturnValue(mockFormatToMarkdown);
    mockFormatToMarkdown.mockImplementation((content: string) => content);
  });

  afterEach(() => {
    vi.clearAllTimers();
    // Clear mocks but don't restore them
    mockFormatToMarkdown.mockClear();
    mockWriteText.mockClear();
  });

  const renderComponent = (
    message: Message,
    idx: number = 0,
    arr: Message[] = [message],
    messagesEndRef: React.RefObject<HTMLElement | null> = { current: null }
  ) => {
    return render(
      <SingleMessage
        message={message}
        idx={idx}
        messagesEndRef={messagesEndRef}
        arr={arr}
      />
    );
  };

  it("renders user message with correct styling", () => {
    const message: Message = { role: "User", content: "Hello there" };

    renderComponent(message);

    expect(screen.getByText("Hello there")).toBeInTheDocument();
    expect(mockFormatToMarkdown).toHaveBeenCalledWith("Hello there");
  });

  it("renders non-user message without user-specific styling", () => {
    const message: Message = {
      role: "Assistant",
      content: "I can help with that",
    };

    const { container } = renderComponent(message);

    const article = container.querySelector("article");
    expect(article).not.toHaveClass("user-message");
    expect(article).not.toHaveClass("bg-cop-1");
    expect(screen.getByText("I can help with that")).toBeInTheDocument();
    expect(mockFormatToMarkdown).toHaveBeenCalledWith("I can help with that");
  });

  it("sets ref for the last message in the array", () => {
    const messages: Message[] = [
      { role: "User", content: "Question" },
      { role: "Assistant", content: "Answer" },
    ];
    const messagesEndRef = { current: null };

    renderComponent(messages[1], 1, messages, messagesEndRef);

    expect(messagesEndRef.current).not.toBeNull();
    expect(messagesEndRef.current).toContainHTML("Answer");
  });

  it("displays promptTokens when available", () => {
    const message: Message = {
      role: "User",
      content: "Hello",
      promptTokens: 10,
    };

    renderComponent(message);

    expect(screen.getByText("Tokens: 10")).toBeInTheDocument();
  });

  it("displays completionTokens when available", () => {
    const message: Message = {
      role: "Assistant",
      content: "Hello back",
      completionTokens: 15,
    };

    renderComponent(message);

    expect(screen.getByText("Tokens: 15")).toBeInTheDocument();
  });

  it("does not display token spans when tokens are not present", () => {
    const message: Message = {
      role: "User",
      content: "Hello",
    };

    renderComponent(message);

    expect(screen.queryByText(/Tokens:/)).not.toBeInTheDocument();
  });

  describe("Clipboard functionality", () => {

    it("copies message content to clipboard when copy button is clicked", async () => {
      mockWriteText.mockResolvedValue(undefined);
      const message: Message = {
        role: "Assistant",
        content: "This is a test message to copy",
      };

      renderComponent(message);

      const copyButton = screen.getByRole("button", { name: /copy message to clipboard/i });
      
      // Use fireEvent.click instead of userEvent for debugging
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith("This is a test message to copy");
      });
    });

    it("shows 'Copied!' feedback after successful copy", async () => {
      mockWriteText.mockResolvedValue(undefined);
      const message: Message = {
        role: "User",
        content: "Message to copy",
      };

      renderComponent(message);

      const copyButton = screen.getByRole("button", { name: /copy message to clipboard/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(copyButton).toHaveTextContent("Copied!");
      });
    });

    it("resets copy feedback after timeout", async () => {
      mockWriteText.mockResolvedValue(undefined);
      const message: Message = {
        role: "User",
        content: "Message to copy",
      };

      renderComponent(message);

      const copyButton = screen.getByRole("button", { name: /copy message to clipboard/i });
      fireEvent.click(copyButton);

      // Check that it shows "Copied!" initially
      await waitFor(() => {
        expect(copyButton).toHaveTextContent("Copied!");
      });

      // Wait for the timeout and check it resets to "Copy"
      await waitFor(
        () => {
          expect(copyButton).toHaveTextContent("Copy");
        },
        { timeout: 3000 }
      );
    });
  });
});
