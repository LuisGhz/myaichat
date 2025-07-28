
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatConfig } from "./ChatConfig";
import { useParams } from "react-router";
import { useChats } from "hooks/features/Chat/useChats";
import {
  useCurrentChatStoreGetMaxOutputTokens,
  useCurrentChatStoreGetIsWebSearchMode,
} from "store/features/chat/useCurrentChatStore";

// Mocks
vi.mock("react-router", () => ({ useParams: vi.fn() }));
vi.mock("hooks/features/Chat/useChats", () => ({ useChats: vi.fn() }));
vi.mock("store/features/chat/useCurrentChatStore", () => ({
  useCurrentChatStoreGetMaxOutputTokens: vi.fn(),
  useCurrentChatStoreGetIsWebSearchMode: vi.fn(),
}));
vi.mock("assets/icons/CogSixToothIcon", () => ({
  CogSixToothIcon: ({ className, onClick }: { className?: string; onClick?: () => void }) => (
    <div data-testid="cog-icon" className={className} onClick={onClick} role="img" aria-label="Cog icon" />
  ),
}));
type MockChatConfigModalProps = {
  onClose: (config: { maxOutputTokens: number; isWebSearchMode: boolean }) => void;
  currentMaxOutputTokens: number;
  currentIsWebSearchMode: boolean;
};
vi.mock("../modals/ChatConfigModal/ChatConfigModal", () => ({
  ChatConfigModal: (props: MockChatConfigModalProps) => {
    return (
      <div data-testid="chat-config-modal">
        <span>Max Tokens: {props.currentMaxOutputTokens}</span>
        <span>Web Search: {props.currentIsWebSearchMode ? "On" : "Off"}</span>
        <button onClick={() => props.onClose({ maxOutputTokens: 2000, isWebSearchMode: false })}>Save</button>
        <button onClick={() => props.onClose({ maxOutputTokens: 1000, isWebSearchMode: true })}>Same Value</button>
      </div>
    );
  },
}));

describe("ChatConfig", () => {
  let mockChangeMaxOutputTokens: ReturnType<typeof vi.fn>;
  let mockChangeIsWebSearchMode: ReturnType<typeof vi.fn>;
  let mockUseParams: ReturnType<typeof vi.mocked<typeof useParams>>;
  let mockUseChats: ReturnType<typeof vi.mocked<typeof useChats>>;
  let mockUseCurrentChatStoreGetMaxOutputTokens: ReturnType<typeof vi.mocked<typeof useCurrentChatStoreGetMaxOutputTokens>>;
  let mockUseCurrentChatStoreGetIsWebSearchMode: ReturnType<typeof vi.mocked<typeof useCurrentChatStoreGetIsWebSearchMode>>;

  beforeEach(() => {
    mockChangeMaxOutputTokens = vi.fn();
    mockChangeIsWebSearchMode = vi.fn();
    mockUseParams = vi.mocked(useParams);
    mockUseChats = vi.mocked(useChats);
    mockUseCurrentChatStoreGetMaxOutputTokens = vi.mocked(useCurrentChatStoreGetMaxOutputTokens);
    mockUseCurrentChatStoreGetIsWebSearchMode = vi.mocked(useCurrentChatStoreGetIsWebSearchMode);

    vi.clearAllMocks();
    mockUseParams.mockReturnValue({});
    mockUseChats.mockReturnValue({
      getAllChats: vi.fn(),
      getChatMessages: vi.fn(),
      sendNewMessage: vi.fn(),
      deleteChat: vi.fn(),
      changeMaxOutputTokens: mockChangeMaxOutputTokens,
      changeIsWebSearchMode: mockChangeIsWebSearchMode,
      isChatLoading: false,
      renameChatTitle: vi.fn(),
      toggleChatFav: vi.fn(),
      isSending: false,
      isEmptyPage: false,
      setIsEmptyPage: vi.fn(),
    });
    mockUseCurrentChatStoreGetMaxOutputTokens.mockReturnValue(1000);
    mockUseCurrentChatStoreGetIsWebSearchMode.mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  function renderComponent() {
    return render(<ChatConfig />);
  }

  it("renders button with correct attributes and is accessible", () => {
    renderComponent();
    const button = screen.getByRole("button", { name: /chat configuration/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
    // Modal should not be visible initially
    expect(screen.queryByTestId("chat-config-modal")).not.toBeInTheDocument();
  });

  it("opens modal when cog icon is clicked and shows config values", async () => {
    renderComponent();
    const cogIcon = screen.getByTestId("cog-icon");
    expect(screen.queryByTestId("chat-config-modal")).not.toBeInTheDocument();
    await userEvent.click(cogIcon);
    expect(screen.getByTestId("chat-config-modal")).toBeInTheDocument();
    expect(screen.getByText("Max Tokens: 1000")).toBeInTheDocument();
    expect(screen.getByText("Web Search: On")).toBeInTheDocument();
    expect(cogIcon).toHaveClass("rotate-180");
  });

  it("closes modal and updates config for new chat (no id)", async () => {
    renderComponent();
    await userEvent.click(screen.getByTestId("cog-icon"));
    const saveButton = screen.getByText("Save");
    await userEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.queryByTestId("chat-config-modal")).not.toBeInTheDocument();
    });
    expect(mockChangeMaxOutputTokens).not.toHaveBeenCalled();
    expect(mockChangeIsWebSearchMode).not.toHaveBeenCalled();
  });

  it("updates config for existing chat (with id)", async () => {
    mockUseParams.mockReturnValue({ id: "chat-123" });
    mockChangeMaxOutputTokens.mockResolvedValue(undefined);
    mockChangeIsWebSearchMode.mockResolvedValue(undefined);
    renderComponent();
    await userEvent.click(screen.getByTestId("cog-icon"));
    const saveButton = screen.getByText("Save");
    await userEvent.click(saveButton);
    await waitFor(() => {
      expect(mockChangeMaxOutputTokens).toHaveBeenCalledWith("chat-123", 1000, 2000);
      expect(mockChangeIsWebSearchMode).toHaveBeenCalledWith("chat-123", true, false);
      expect(screen.queryByTestId("chat-config-modal")).not.toBeInTheDocument();
    });
  });

  it("handles error when updating config fails", async () => {
    mockUseParams.mockReturnValue({ id: "chat-123" });
    mockChangeMaxOutputTokens.mockRejectedValue(new Error("API Error"));
    mockChangeIsWebSearchMode.mockRejectedValue(new Error("API Error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderComponent();
    await userEvent.click(screen.getByTestId("cog-icon"));
    const saveButton = screen.getByText("Save");
    await userEvent.click(saveButton);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to change max output tokens.");
      expect(consoleSpy).toHaveBeenCalledWith("Failed to change web search mode.");
    });
    consoleSpy.mockRestore();
  });

  it("does not update when new values equal current values", async () => {
    renderComponent();
    await userEvent.click(screen.getByTestId("cog-icon"));
    const sameValueButton = screen.getByText("Same Value");
    await userEvent.click(sameValueButton);
    await waitFor(() => {
      expect(screen.queryByTestId("chat-config-modal")).not.toBeInTheDocument();
    });
    expect(mockChangeMaxOutputTokens).not.toHaveBeenCalled();
    expect(mockChangeIsWebSearchMode).not.toHaveBeenCalled();
  });

  it("is keyboard accessible (open/close modal)", async () => {
    renderComponent();
    const button = screen.getByRole("button", { name: /chat configuration/i });
    button.focus();
    expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByTestId("chat-config-modal")).toBeInTheDocument();
    // Simulate closing modal
    await userEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(screen.queryByTestId("chat-config-modal")).not.toBeInTheDocument();
    });
  });
});
