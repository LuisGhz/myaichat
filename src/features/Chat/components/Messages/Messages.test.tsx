/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Messages } from "./Messages";
import { Message } from "types/chat/Message.type";
import { SingleMessage } from "./SingleMessage";
import { ImageViewer } from "../ImageViewer";
import { AssistantTyping } from "./AssistantTyping";

// filepath: src/components/Messages/Messages.test.tsx

// Mock the required components
vi.mock("./SingleMessage", () => ({
  SingleMessage: vi.fn(() => (
    <div data-testid="single-message">Mocked SingleMessage</div>
  )),
}));

vi.mock("../ImageViewer", () => ({
  ImageViewer: vi.fn(() => (
    <div data-testid="image-viewer">Mocked ImageViewer</div>
  )),
}));

vi.mock("./AssistantTyping", () => ({
  AssistantTyping: vi.fn(() => (
    <div data-testid="assistant-typing">Mocked AssistantTyping</div>
  )),
}));

// Mock de useRef
const scrollIntoViewMock = vi.fn();
vi.mock("react", async () => {
  const originalModule = await vi.importActual("react");
  return {
    ...originalModule,
    useRef: vi.fn(() => ({
      current: {
        scrollIntoView: scrollIntoViewMock, // Simulamos el método focus
      },
    })),
  };
});

describe("Messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset component mocks
    (SingleMessage as any).mockClear();
    (ImageViewer as any).mockClear();
    (AssistantTyping as any).mockClear();
  });

  it("renders messages correctly", () => {
    const messages: Message[] = [
      { role: "User", content: "Hello" },
      { role: "Assistant", content: "Hi there" },
    ];

    render(
      <Messages
        messages={messages}
        isUpdatingMessagesFromScroll={false}
        isSending={false}
      />
    );

    // Should render 2 messages
    expect(SingleMessage).toHaveBeenCalledTimes(2);
    expect(screen.getAllByTestId("single-message")).toHaveLength(2);

    // Check specific properties passed to SingleMessage, including the ref
    expect(SingleMessage).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        message: messages[0],
        idx: 0,
        arr: messages,
        messagesEndRef: {
          current: {
            scrollIntoView: expect.any(Function),
          },
        },
      }),
      undefined
    );
    expect(SingleMessage).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        message: messages[1],
        idx: 1,
        arr: messages,
        messagesEndRef: {
          current: {
            scrollIntoView: expect.any(Function),
          },
        },
      }),
      undefined
    );
  });

  it("applies correct alignment classes for different message roles", () => {
    const messages: Message[] = [
      { role: "User", content: "Hello" },
      { role: "Assistant", content: "Hi there" },
    ];

    const { container } = render(
      <Messages
        messages={messages}
        isUpdatingMessagesFromScroll={false}
        isSending={false}
      />
    );

    const listItems = container.querySelectorAll("li");
    expect(listItems[0]).toHaveClass("items-end"); // User message should be aligned to end
    expect(listItems[1]).not.toHaveClass("items-end"); // Assistant message should not have this class
  });

  it("renders ImageViewer for messages with files", () => {
    const messages: Message[] = [
      { role: "User", content: "Hello", file: "user-file-data" },
      { role: "Assistant", content: "Hi there", file: "assistant-file-data" },
    ];

    render(
      <Messages
        messages={messages}
        isUpdatingMessagesFromScroll={false}
        isSending={false}
      />
    );

    // Both messages should have ImageViewer
    expect(ImageViewer).toHaveBeenCalledTimes(2);
    expect(screen.getAllByTestId("image-viewer")).toHaveLength(2);

    // Check file props were passed correctly
    expect(ImageViewer).toHaveBeenNthCalledWith(
      1,
      { file: "user-file-data" },
      undefined
    );
    expect(ImageViewer).toHaveBeenNthCalledWith(
      2,
      { file: "assistant-file-data" },
      undefined
    );
  });

  it("does not render ImageViewer for messages without files", () => {
    const messages: Message[] = [
      { role: "User", content: "Hello" },
      { role: "Assistant", content: "Hi there" },
    ];

    render(
      <Messages
        messages={messages}
        isUpdatingMessagesFromScroll={false}
        isSending={false}
      />
    );

    // No ImageViewer should be rendered
    expect(ImageViewer).not.toHaveBeenCalled();
    expect(screen.queryByTestId("image-viewer")).not.toBeInTheDocument();
  });

  it("renders AssistantTyping when isSending is true", () => {
    const messages: Message[] = [];

    render(
      <Messages
        messages={messages}
        isUpdatingMessagesFromScroll={false}
        isSending={true}
      />
    );

    expect(AssistantTyping).toHaveBeenCalled();
    expect(screen.getByTestId("assistant-typing")).toBeInTheDocument();
  });

  it("does not render AssistantTyping when isSending is false", () => {
    const messages: Message[] = [];

    render(
      <Messages
        messages={messages}
        isUpdatingMessagesFromScroll={false}
        isSending={false}
      />
    );

    expect(AssistantTyping).not.toHaveBeenCalled();
    expect(screen.queryByTestId("assistant-typing")).not.toBeInTheDocument();
  });

  it("handles empty messages array", () => {
    const { container } = render(
      <Messages
        messages={[]}
        isUpdatingMessagesFromScroll={false}
        isSending={false}
      />
    );

    const listItems = container.querySelectorAll("li");
    expect(listItems).toHaveLength(0);
    expect(SingleMessage).not.toHaveBeenCalled();
  });

  it("scrolls to bottom when messages change and isUpdatingMessagesFromScroll is false", () => {
    const messages: Message[] = [{ role: "User", content: "Hello" }];

    const { rerender } = render(
      <Messages
        messages={messages}
        isUpdatingMessagesFromScroll={false}
        isSending={false}
      />
    );

    // Initial render should call scrollIntoView
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: "smooth",
    });

    // Reset mock to check if it's called again
    scrollIntoViewMock.mockClear();

    // Update messages to trigger the effect
    rerender(
      <Messages
        messages={[...messages, { role: "Assistant", content: "Hi there" }]}
        isUpdatingMessagesFromScroll={false}
        isSending={false}
      />
    );

    // Should be called again after messages update
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: "smooth",
    });
  });

  it("doesn't scroll to bottom when isUpdatingMessagesFromScroll is true", () => {
    const messages: Message[] = [{ role: "User", content: "Hello" }];

    const { rerender } = render(
      <Messages
        messages={messages}
        isUpdatingMessagesFromScroll={true}
        isSending={false}
      />
    );

    // Initial render should not call scrollIntoView since isUpdatingMessagesFromScroll is true
    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    // Reset mock to check if it's called
    scrollIntoViewMock.mockClear();

    // Update messages but keep isUpdatingMessagesFromScroll true
    rerender(
      <Messages
        messages={[...messages, { role: "Assistant", content: "Hi there" }]}
        isUpdatingMessagesFromScroll={true}
        isSending={false}
      />
    );

    // Should still not be called
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });
});
