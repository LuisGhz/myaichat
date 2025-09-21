import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";

import { RenameChatModal } from "./RenameChatModal";
import * as ChatHook from "core/hooks/useChatContext";

describe("RenameChatModal", () => {
  let renameChatMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // create a fresh mock per test and spy on the hook to return it
    renameChatMock = vi.fn();
    vi
      .spyOn(ChatHook, "useChatContext")
      .mockReturnValue({ renameChat: renameChatMock, deleteChat: vi.fn() });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderComponent(props?: Partial<React.ComponentProps<typeof RenameChatModal>>) {
    const defaultProps: React.ComponentProps<typeof RenameChatModal> = {
      chatId: "chat-1",
      currentChatName: "Initial name",
      isOpen: true,
      setIsOpen: () => {},
    };
    return render(<RenameChatModal {...defaultProps} {...props} />);
  }

  it("renders with current name and allows editing", async () => {
    renderComponent();

    // The input should contain the currentChatName
    const input = screen.getByPlaceholderText(/enter new chat name/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("Initial name");

    // Change the value
    await userEvent.clear(input);
    await userEvent.type(input, "New chat name");
    expect(input.value).toBe("New chat name");
  });

  it("shows validation error for short names and prevents rename", async () => {
    const setIsOpenMock = vi.fn();
    renderComponent({ setIsOpen: setIsOpenMock });

    const input = screen.getByPlaceholderText(/enter new chat name/i) as HTMLInputElement;
    const button = screen.getByRole("button", { name: /rename/i });

    await userEvent.clear(input);
    await userEvent.type(input, "a");
    await userEvent.click(button);

    // validation error should appear (zod message contains '2 characters')
    await waitFor(() => {
      expect(screen.getByText(/2 characters/i)).toBeTruthy();
    });

    expect(renameChatMock).not.toHaveBeenCalled();
    expect(setIsOpenMock).not.toHaveBeenCalled();
  });

  it("calls renameChat and closes modal on valid rename", async () => {
    const setIsOpenMock = vi.fn();
    renameChatMock.mockResolvedValue(undefined);

    renderComponent({ setIsOpen: setIsOpenMock });

    const input = screen.getByPlaceholderText(/enter new chat name/i) as HTMLInputElement;
    const button = screen.getByRole("button", { name: /rename/i });

    await userEvent.clear(input);
    await userEvent.type(input, "Valid name");
    await userEvent.click(button);

    await waitFor(() => {
      expect(renameChatMock).toHaveBeenCalledWith("chat-1", "Valid name");
      expect(setIsOpenMock).toHaveBeenCalledWith(false);
    });
  });
});
