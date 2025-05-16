import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import { AppContextProvider } from "./AppContextProvider";
import { AppContext } from "./AppContext";
import { useContext } from "react";
import { ChatSummary } from "types/chat/ChatSummary.type";

// Mock useChats
const mockGetAllChats = vi.fn();
const mockDeleteChat = vi.fn();

vi.mock("hooks/useChats", () => ({
  useChats: () => ({
    getAllChats: mockGetAllChats,
    deleteChat: mockDeleteChat,
  }),
}));

// Helper component to access context values
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let capturedContextValue: any;
const ContextReader = () => {
  capturedContextValue = useContext(AppContext);
  return null;
};

const renderTestProvider = () => {
  return render(
    <AppContextProvider>
      <ContextReader />
    </AppContextProvider>
  );
};

// Mock chat data
const chat1: ChatSummary = {
  id: "1",
  title: "Chat 1",
};
const chat2: ChatSummary = {
  id: "2",
  title: "Chat 2",
};
const chat3: ChatSummary = {
  id: "3",
  title: "Chat 3",
};

describe("AppContextProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedContextValue = null;
  });

  it("should initialize with isMenuOpen as true and load chats on mount", async () => {
    const initialChats: ChatSummary[] = [chat1, chat2];
    mockGetAllChats.mockResolvedValue([...initialChats]);

    await act(async () => {
      renderTestProvider();
    });

    expect(mockGetAllChats).toHaveBeenCalledTimes(1);
    expect(capturedContextValue.isMenuOpen).toBe(true);
    expect(capturedContextValue.chats).toEqual([chat2, chat1]); // Reversed
  });

  it("should not set chats if getAllChats returns undefined on mount", async () => {
    mockGetAllChats.mockResolvedValue(undefined);

    await act(async () => {
      renderTestProvider();
    });

    expect(mockGetAllChats).toHaveBeenCalledTimes(1);
    expect(capturedContextValue.chats).toEqual([]);
  });

  describe("getAllChatsForList", () => {
    it("should fetch and set chats in reverse order when called explicitly", async () => {
      mockGetAllChats.mockResolvedValueOnce([]); // For initial mount
      await act(async () => {
        renderTestProvider();
      });
      expect(capturedContextValue.chats).toEqual([]); // Initial state after mount

      const newChats: ChatSummary[] = [chat1, chat3];
      mockGetAllChats.mockResolvedValue([...newChats]); // For explicit call

      await act(async () => {
        await capturedContextValue.getAllChatsForList();
      });

      expect(mockGetAllChats).toHaveBeenCalledTimes(2); // Once on mount, once explicitly
      expect(capturedContextValue.chats).toEqual([chat3, chat1]); // Reversed
    });

    it("should not update chats if getAllChats returns undefined when called explicitly", async () => {
      const initialSetupChats: ChatSummary[] = [chat1];
      mockGetAllChats.mockResolvedValueOnce([...initialSetupChats]); // For initial mount
      await act(async () => {
        renderTestProvider();
      });
      expect(capturedContextValue.chats).toEqual([chat1]); // Reversed (single item)

      mockGetAllChats.mockResolvedValue(undefined); // For explicit call

      await act(async () => {
        await capturedContextValue.getAllChatsForList();
      });

      expect(mockGetAllChats).toHaveBeenCalledTimes(2);
      expect(capturedContextValue.chats).toEqual([chat1]); // Should remain unchanged
    });
  });

  describe("deleteChatById", () => {
    it("should call deleteChat and remove the chat from the list, maintaining reverse order", async () => {
      const initialChats: ChatSummary[] = [chat1, chat2, chat3]; // Original order: 1, 2, 3
      mockGetAllChats.mockResolvedValue([...initialChats]);
      mockDeleteChat.mockResolvedValue(undefined);

      await act(async () => {
        renderTestProvider();
      });
      // Initial state in context: 3, 2, 1 (reversed)
      expect(capturedContextValue.chats).toEqual([chat3, chat2, chat1]);

      const idToDelete = chat2.id; // '2'

      await act(async () => {
        await capturedContextValue.deleteChatById(idToDelete);
      });

      expect(mockDeleteChat).toHaveBeenCalledWith(idToDelete);
      // Expected: [chat3, chat1] (chat2 removed, order maintained from [chat3, chat2, chat1])
      expect(capturedContextValue.chats).toEqual([chat3, chat1]);
      expect(
        capturedContextValue.chats.find((c: ChatSummary) => c.id === idToDelete)
      ).toBeUndefined();
    });
  });

  describe("setIsMenuOpen", () => {
    it("should update isMenuOpen state", async () => {
      mockGetAllChats.mockResolvedValue([]); // For initial mount
      await act(async () => {
        renderTestProvider();
      });

      expect(capturedContextValue.isMenuOpen).toBe(true);

      act(() => {
        capturedContextValue.setIsMenuOpen(false);
      });
      expect(capturedContextValue.isMenuOpen).toBe(false);

      act(() => {
        capturedContextValue.setIsMenuOpen(true);
      });
      expect(capturedContextValue.isMenuOpen).toBe(true);
    });
  });
});
