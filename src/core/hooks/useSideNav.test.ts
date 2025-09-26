import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

// Mock the AppStore hooks
const setChatsSummaryMock = vi.fn();
type ChatSummary = { id: string; fav: boolean };
let fakeChatsSummary: ChatSummary[] = [];

vi.mock("store/app/AppStore", () => ({
  useAppStore: () => ({ chatsSummary: fakeChatsSummary }),
  useAppStoreActions: () => ({ setChatsSummary: setChatsSummaryMock }),
}));

// Mock the SideNavService functions
const getChatSummaryServiceMock = vi.fn();
const toggleFavoriteServiceMock = vi.fn();

vi.mock("../services/SideNavService", () => ({
  getChatSummaryService: () => getChatSummaryServiceMock(),
  toggleFavoriteService: (chatId: string) => toggleFavoriteServiceMock(chatId),
}));

const errorMessageMock = vi.fn();
vi.mock("shared/hooks/useAppMessage", () => ({
  useAppMessage: () => ({
    errorMessage: errorMessageMock,
  }),
}));

import { useSideNav } from "./useSideNav";
describe("useSideNav hook", () => {
  beforeEach(() => {
    fakeChatsSummary = [];
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("should fetch and update chats summary", async () => {
    const fakeChats = [{ id: "1", fav: false }];
    getChatSummaryServiceMock.mockResolvedValue({ chats: fakeChats });

    const { result } = renderHook(() => useSideNav());

    await act(async () => {
      await result.current.getChatsSummary();
    });

    expect(setChatsSummaryMock).toHaveBeenCalledWith(fakeChats);
  });

  it("should handle error when fetching chats summary", async () => {
    getChatSummaryServiceMock.mockRejectedValue(new Error("Service Error"));
    const { result } = renderHook(() => useSideNav());

    let caughtError;
    await act(async () => {
      try {
        await result.current.getChatsSummary();
      } catch (error) {
        caughtError = error;
      }
    });

    expect(caughtError).toBeDefined();
    expect(errorMessageMock).toHaveBeenCalledWith(
      "Failed to fetch menu chats. Please try again later."
    );
  });

  it("should toggle favorite optimistically and call service successfully", async () => {
    // Initial state
    fakeChatsSummary = [{ id: "1", fav: false }];

    toggleFavoriteServiceMock.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSideNav());

    await act(async () => {
      await result.current.toggleFavorite("1");
    });

    expect(setChatsSummaryMock).toHaveBeenCalledWith([{ id: "1", fav: true }]);
    expect(toggleFavoriteServiceMock).toHaveBeenCalledWith("1");
  });

  it("should revert favorite toggle on service error", async () => {
    fakeChatsSummary = [{ id: "1", fav: false }];

    toggleFavoriteServiceMock.mockRejectedValue(new Error("Service Error"));
    const { result } = renderHook(() => useSideNav());

    let caughtError;
    await act(async () => {
      try {
        await result.current.toggleFavorite("1");
      } catch (error) {
        caughtError = error;
      }
    });

    expect(setChatsSummaryMock.mock.calls[0][0]).toEqual([
      { id: "1", fav: true },
    ]);
    expect(setChatsSummaryMock.mock.calls[1][0]).toEqual([
      { id: "1", fav: false },
    ]);
    expect(caughtError).toBeDefined();
    expect(errorMessageMock).toHaveBeenCalled();
  });

  it("should not toggle favorite if chatId not found", async () => {
    fakeChatsSummary = [{ id: "1", fav: false }];
    const { result } = renderHook(() => useSideNav());

    await act(async () => {
      await result.current.toggleFavorite("99");
    });

    expect(setChatsSummaryMock).not.toHaveBeenCalled();
    expect(toggleFavoriteServiceMock).not.toHaveBeenCalled();
  });
});
