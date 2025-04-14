/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SingleMessage } from "./SingleMessage";
import { useMarkDown } from "hooks/useMarkdown";
import { Message } from "types/chat/Message.type";

// Mock the useMarkDown hook
vi.mock("hooks/useMarkdown", () => ({
  useMarkDown: vi.fn(),
}));

describe("SingleMessage", () => {
  const markdownTestId = "markdown-test";
  const mockFormatToMarkdown = vi
    .fn()
    .mockImplementation((content) => (
      <div data-testid={`${markdownTestId}`}>{content}</div>
    ));

  beforeEach(() => {
    vi.clearAllMocks();
    (useMarkDown as any).mockReturnValue(mockFormatToMarkdown);
  });

  it("renders user message with correct styling", () => {
    const message: Message = { role: "User", content: "Hello there" };
    const messagesEndRef = { current: null };

    render(
      <SingleMessage
        message={message}
        idx={0}
        messagesEndRef={messagesEndRef}
        arr={[message]}
      />
    );

    expect(screen.getByTestId(markdownTestId)).toHaveTextContent("Hello there");
    expect(screen.getByText("Hello there")).toBeInTheDocument();
  });

  it("renders non-user message without user-specific styling", () => {
    const message: Message = {
      role: "Assistant",
      content: "I can help with that",
    };
    const messagesEndRef = { current: null };

    const { container } = render(
      <SingleMessage
        message={message}
        idx={0}
        messagesEndRef={messagesEndRef}
        arr={[message]}
      />
    );

    const article = container.querySelector("article");
    expect(article).not.toHaveClass("user-message");
    expect(article).not.toHaveClass("bg-cop-10");
    expect(screen.getByTestId(markdownTestId)).toHaveTextContent(
      "I can help with that"
    );
  });

  it("sets ref for the last message in the array", () => {
    const messages: Message[] = [
      { role: "User", content: "Question" },
      { role: "Assistant", content: "Answer" },
    ];
    const messagesEndRef = { current: null };

    render(
      <SingleMessage
        message={messages[1]}
        idx={1}
        messagesEndRef={messagesEndRef}
        arr={messages}
      />
    );

    expect(messagesEndRef.current).not.toBeNull();
    expect(messagesEndRef.current).not.toHaveTextContent("Question");
    expect(messagesEndRef.current).toHaveTextContent("Answer");
  });

  it("displays promptTokens when available", () => {
    const message: Message = {
      role: "User",
      content: "Hello",
      promptTokens: 10,
    };
    const messagesEndRef = { current: null };

    render(
      <SingleMessage
        message={message}
        idx={0}
        messagesEndRef={messagesEndRef}
        arr={[message]}
      />
    );

    expect(screen.getByText("Tokens: 10")).toBeInTheDocument();
  });

  it("displays completionTokens when available", () => {
    const message: Message = {
      role: "Assistant",
      content: "Hello back",
      completionTokens: 15,
    };
    const messagesEndRef = { current: null };

    render(
      <SingleMessage
        message={message}
        idx={0}
        messagesEndRef={messagesEndRef}
        arr={[message]}
      />
    );

    expect(screen.getByText("Tokens: 15")).toBeInTheDocument();
  });

  it("does not display token spans when tokens are not present", () => {
    const message: Message = {
      role: "User",
      content: "Hello",
    };
    const messagesEndRef = { current: null };

    render(
      <SingleMessage
        message={message}
        idx={0}
        messagesEndRef={messagesEndRef}
        arr={[message]}
      />
    );

    expect(screen.queryByText(/Tokens:/)).not.toBeInTheDocument();
  });
});
