/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatConfig } from "./ChatConfig";
import { useParams } from "react-router";
import { useChats } from "hooks/useChats";
import {
  useCurrentChatStoreGetMaxOutputTokens,
  useCurrentChatStoreSetMaxOutputTokens,
} from "store/features/chat/useCurrentChatStore";

// Mock dependencies
vi.mock("react-router", () => ({
  useParams: vi.fn(),
}));

vi.mock("hooks/useChats", () => ({
  useChats: vi.fn(),
}));

vi.mock("store/features/chat/useCurrentChatStore", () => ({
  useCurrentChatStoreGetMaxOutputTokens: vi.fn(),
  useCurrentChatStoreSetMaxOutputTokens: vi.fn(),
  useCurrentChatStoreGetIsWebSearchMode: vi.fn(),
  useCurrentChatStoreSetIsWebSearchMode: vi.fn(),
}));

vi.mock("assets/icons/CogSixToothIcon", () => ({
  CogSixToothIcon: ({ className, onClick }: any) => (
    <div data-testid="cog-icon" className={className} onClick={onClick} />
  ),
}));

vi.mock("../modals/ChatConfigModal/ChatConfigModal", () => ({
  ChatConfigModal: ({ isOpen, maxOutputTokens, onCancel }: any) => (
    <div data-testid="chat-config-modal">
      {isOpen && (
        <div>
          <span>Max Tokens: {maxOutputTokens}</span>
          <button onClick={() => onCancel(2000)}>Cancel</button>
          <button onClick={() => onCancel(1000)}>Same Value</button>
        </div>
      )}
    </div>
  ),
}));

describe("ChatConfig", () => {
  const mockUseParams = vi.mocked(useParams);
  const mockUseChats = vi.mocked(useChats);
  const mockUseCurrentChatStoreGetMaxOutputTokens = vi.mocked(
    useCurrentChatStoreGetMaxOutputTokens
  );
  const mockUseCurrentChatStoreSetMaxOutputTokens = vi.mocked(
    useCurrentChatStoreSetMaxOutputTokens
  );
  const mockChangeMaxOutputTokens = vi.fn();
  const mockSetMaxOutputTokens = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({});
    const p = useChats();
    mockUseChats.mockReturnValue({
      ...p,
      changeMaxOutputTokens: mockChangeMaxOutputTokens,
    });
    mockUseCurrentChatStoreGetMaxOutputTokens.mockReturnValue(1000);
    mockUseCurrentChatStoreSetMaxOutputTokens.mockReturnValue(
      mockSetMaxOutputTokens
    );
  });

  it("renders chat config button with correct attributes", () => {
    render(<ChatConfig />);

    const button = screen.getByRole("button", { name: "Chat configuration" });
    const modal = screen.getByTestId("chat-config-modal");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
    expect(modal).toBeInTheDocument();
  });

  it("opens modal when cog icon is clicked", () => {
    render(<ChatConfig />);

    const cogIcon = screen.getByTestId("cog-icon");
    expect(screen.queryByText("Max Tokens: 1000")).not.toBeInTheDocument();
    expect(cogIcon).not.toHaveClass("rotate-180");

    fireEvent.click(cogIcon);

    expect(screen.getByText("Max Tokens: 1000")).toBeInTheDocument();
    expect(cogIcon).toHaveClass("rotate-180");
  });

  it("closes modal and updates tokens for new chat without ID", async () => {
    render(<ChatConfig />);

    const cogIcon = screen.getByTestId("cog-icon");
    fireEvent.click(cogIcon);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Max Tokens: 1000")).not.toBeInTheDocument();
    });

    expect(mockSetMaxOutputTokens).toHaveBeenCalledWith(2000);
    expect(mockChangeMaxOutputTokens).not.toHaveBeenCalled();
  });

  it("updates existing chat when ID is present", async () => {
    mockUseParams.mockReturnValue({ id: "chat-123" });
    mockChangeMaxOutputTokens.mockResolvedValue(undefined);

    render(<ChatConfig />);

    const cogIcon = screen.getByTestId("cog-icon");
    fireEvent.click(cogIcon);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockChangeMaxOutputTokens).toHaveBeenCalledWith("chat-123", 2000);
      expect(mockSetMaxOutputTokens).toHaveBeenCalledWith(2000);
    });
  });

  it("handles error when updating existing chat fails", async () => {
    mockUseParams.mockReturnValue({ id: "chat-123" });
    mockChangeMaxOutputTokens.mockRejectedValue(new Error("API Error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<ChatConfig />);

    const cogIcon = screen.getByTestId("cog-icon");
    fireEvent.click(cogIcon);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to change max output tokens."
      );
    });

    expect(mockSetMaxOutputTokens).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("does not update when new value equals current value", async () => {
    render(<ChatConfig />);

    const cogIcon = screen.getByTestId("cog-icon");
    fireEvent.click(cogIcon);

    const sameValueButton = screen.getByText("Same Value");
    fireEvent.click(sameValueButton);

    await waitFor(() => {
      expect(screen.queryByText("Max Tokens: 1000")).not.toBeInTheDocument();
    });

    expect(mockSetMaxOutputTokens).not.toHaveBeenCalled();
    expect(mockChangeMaxOutputTokens).not.toHaveBeenCalled();
  });
});
