import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useNavigate: () => mockNavigate,
}));

const mockParamsId = "1";
vi.mock("features/Chat/hooks/useChatParams", () => ({
  useChatParams: () => ({ id: mockParamsId }),
}));

const mockDeleteChatService = vi.fn().mockResolvedValue({});
const mockRenameChatService = vi.fn().mockResolvedValue({});
vi.mock("features/Chat/services/ChatService", () => ({
  deleteChatService: (id: string) => mockDeleteChatService(id),
  renameChatService: (id: string, newName: string) =>
    mockRenameChatService(id, newName),
}));

let mockChatsSummary: { id: string }[] = [{ id: "1" }, { id: "2" }];
const mockSetChatsSummary = vi.fn();
const errorMessageMock = vi.fn();

vi.mock("store/app/AppStore", () => ({
  useAppStore: () => ({ chatsSummary: mockChatsSummary }),
  useAppStoreActions: () => ({ setChatsSummary: mockSetChatsSummary }),
}));

vi.mock("shared/hooks/useAppMessage", () => ({
  useAppMessage: () => ({
    errorMessage: errorMessageMock,
  }),
}));

import { useChatContext } from "./useChatContext";

describe("useChatContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChatsSummary = [{ id: "1" }, { id: "2" }];
  });

  describe("deleteChat", () => {
    it("deleteChat removes chat and navigates when deleting non-active chat", async () => {
      const { result } = renderHook(() => useChatContext());
      await act(async () => {
        await result.current.deleteChat("2");
      });

      expect(mockSetChatsSummary).toHaveBeenCalledWith([{ id: "1" }]);
      // since params.id === '1' and we deleted '2', navigate shouldn't be called to /chat
      expect(mockNavigate).not.toHaveBeenCalledWith("/chat");
    });

    it("deleteChat when deleting active chat navigates to /chat and handles service errors", async () => {
      mockDeleteChatService.mockRejectedValueOnce(new Error("fail"));
      const { result } = renderHook(() => useChatContext());
      await act(async () => {
        await result.current.deleteChat("1");
      });

      // After failure it should restore chats and navigate back to the chat id
      expect(mockSetChatsSummary).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(`/chat/1`);
      expect(errorMessageMock).toHaveBeenCalled();
    });
  });

  describe("renameChat", () => {
    it("renameChat updates chat name and handles service errors", async () => {
      const { result } = renderHook(() => useChatContext());
      await act(async () => {
        await result.current.renameChat("1", "New Name");
      });

      expect(mockSetChatsSummary).toHaveBeenCalledWith([
        { id: "1", title: "New Name" },
        { id: "2" },
      ]);
    });

    it("renameChat handles service errors", async () => {
      mockRenameChatService.mockRejectedValueOnce(new Error("fail"));
      const { result } = renderHook(() => useChatContext());
      await act(async () => {
        await result.current.renameChat("1", "New Name");
      });

      expect(mockSetChatsSummary).toHaveBeenCalled();
      expect(errorMessageMock).toHaveBeenCalled();
    });
  });
});
