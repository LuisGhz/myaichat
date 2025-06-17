import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { RenameChatModal } from "./RenameChatModal";
import { ChatSummary } from "types/chat/ChatSummary.type";

const mockChat: ChatSummary = {
  id: "chat-1",
  title: "Original Chat Title",
};

const mockOnOk = vi.fn();
const mockOnCancel = vi.fn();

describe("RenameChatModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with initial chat title", () => {
    render(
      <RenameChatModal
        chat={mockChat}
        onOk={mockOnOk}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByDisplayValue("Original Chat Title")).toBeInTheDocument();
    expect(screen.getByText("Rename Chat")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(
      <RenameChatModal
        chat={mockChat}
        onOk={mockOnOk}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onOk with chat id and new title when ok button is clicked", () => {
    render(
      <RenameChatModal
        chat={mockChat}
        onOk={mockOnOk}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByDisplayValue("Original Chat Title");
    fireEvent.change(input, { target: { value: "New Chat Title" } });
    fireEvent.click(screen.getByRole("button", { name: "OK" }));

    expect(mockOnOk).toHaveBeenCalledWith("chat-1", "New Chat Title");
  });

  it("disables ok button when title is empty or only contains whitespaces", async () => {
    render(
      <RenameChatModal
        chat={mockChat}
        onOk={mockOnOk}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByDisplayValue("Original Chat Title");
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getByRole("button", { name: "OK" })).toBeDisabled();
    fireEvent.change(input, { target: { value: "   " } });
    expect(screen.getByRole("button", { name: "OK" })).toBeDisabled();
  });
});
