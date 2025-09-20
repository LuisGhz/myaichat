import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSideNav } from './useSideNav';

// Mock the AppStore hooks
const fakeSetChatsSummary = vi.fn();
type ChatSummary = { id: string; fav: boolean };
let fakeChatsSummary: ChatSummary[] = [];

vi.mock('store/app/AppStore', () => ({
  useAppStore: () => ({ chatsSummary: fakeChatsSummary }),
  useAppStoreActions: () => ({ setChatsSummary: fakeSetChatsSummary }),
}));

// Mock the SideNavService functions
const getChatSummaryServiceMock = vi.fn();
const toggleFavoriteServiceMock = vi.fn();

vi.mock('../services/SideNavService', () => ({
  getChatSummaryService: () => getChatSummaryServiceMock(),
  toggleFavoriteService: (chatId: string) => toggleFavoriteServiceMock(chatId),
}));

describe('useSideNav hook', () => {
  beforeEach(() => {
    fakeChatsSummary = [];
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('should fetch and update chats summary', async () => {
    const fakeChats = [{ id: '1', fav: false }];
    getChatSummaryServiceMock.mockResolvedValue({ chats: fakeChats });

    const { result } = renderHook(() => useSideNav());

    await act(async () => {
      await result.current.getChatsSummary();
    });

    expect(fakeSetChatsSummary).toHaveBeenCalledWith(fakeChats);
  });

  it('should toggle favorite optimistically and call service successfully', async () => {
    // Initial state
    fakeChatsSummary = [{ id: '1', fav: false }];

    toggleFavoriteServiceMock.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSideNav());

    await act(async () => {
      await result.current.toggleFavorite('1');
    });

    // Optimistic update should toggle fav to true
    expect(fakeSetChatsSummary).toHaveBeenCalledWith([{ id: '1', fav: true }]);
    expect(toggleFavoriteServiceMock).toHaveBeenCalledWith('1');
  });

  it('should revert favorite toggle on service error', async () => {
    // Initial state
    fakeChatsSummary = [{ id: '1', fav: false }];

    toggleFavoriteServiceMock.mockRejectedValue(new Error('Service Error'));
    const { result } = renderHook(() => useSideNav());

    let caughtError;
    await act(async () => {
      try {
        await result.current.toggleFavorite('1');
      } catch (error) {
        caughtError = error;
      }
    });

    // First call: optimistic update toggles fav to true
    expect(fakeSetChatsSummary.mock.calls[0][0]).toEqual([{ id: '1', fav: true }]);
    // Second call: revert to original state
    expect(fakeSetChatsSummary.mock.calls[1][0]).toEqual([{ id: '1', fav: false }]);
    expect(caughtError).toBeDefined();
  });

  it('should not toggle favorite if chatId not found', async () => {
    fakeChatsSummary = [{ id: '1', fav: false }];
    const { result } = renderHook(() => useSideNav());

    await act(async () => {
      await result.current.toggleFavorite('99');
    });

    // setChatsSummary should not be called if chat is not found
    expect(fakeSetChatsSummary).not.toHaveBeenCalled();
    expect(toggleFavoriteServiceMock).not.toHaveBeenCalled();
  });
});
