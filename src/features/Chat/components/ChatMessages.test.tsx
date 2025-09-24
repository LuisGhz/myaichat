import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// Mock child components
vi.mock("./AssistantTyping", () => ({
  AssistantTyping: () => <div>AssistantTyping</div>,
}));
vi.mock("./MessageActionButtons", () => ({
  MessageActionButtons: (props: { content: string }) => (
    <div>Actions-{props.content}</div>
  ),
}));

vi.mock("../hooks/useMarkdown", () => ({
  useMarkDown: () => ({
    formatToMarkDown: (text: string) => text, // Simple passthrough for testing
  }),
}));

import { ChatMessages } from "./ChatMessages";

describe("ChatMessages", () => {
  it("renders assistant typing when assistant message with empty content", () => {
    const msgs: ChatMessage[] = [{ role: "Assistant", content: "   " }];
    render(<ChatMessages messages={msgs} />);
    expect(screen.getByText("AssistantTyping")).toBeInTheDocument();
  });

  it("renders messages and tokens and action buttons", () => {
    const messages: ChatMessage[] = [
      { role: "User", content: "Hello", promptTokens: 5 },
      { role: "Assistant", content: "Hi there", completionTokens: 10 },
    ];
    render(<ChatMessages messages={messages} />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
    const tokens = screen.getAllByText(/Tokens:/);
    expect(tokens.length).toBe(2);
    expect(screen.getByText("Actions-Hello")).toBeInTheDocument();
    expect(screen.getByText("Actions-Hi there")).toBeInTheDocument();
  });

  it("renders tokens and action buttons only in user messages", () => {
    const messages: ChatMessage[] = [
      { role: "User", content: "Hello", promptTokens: 5 },
      { role: "Assistant", content: "Hi there" },
    ];
    render(<ChatMessages messages={messages} />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
    const tokens = screen.getAllByText(/Tokens:/);
    expect(tokens.length).toBe(1);
    expect(screen.getByText("Actions-Hello")).toBeInTheDocument();
    expect(screen.queryByText("Actions-Hi there")).not.toBeInTheDocument();
  });
});
