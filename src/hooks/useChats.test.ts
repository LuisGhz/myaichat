import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { useChats } from "./useChats";
import * as toastHook from "hooks/useToast";
import * as chatService from "services/chat.service";
import * as useAppStore from "store/useAppStore";
import { ChatMessagesRes } from "types/chat/ChatMessagesRes.type";
import { NewMessageRes } from "types/chat/NewMessageRes.type";
import { NewMessageReq } from "types/chat/NewMessageReq.type";

vi.mock("hooks/useToast");

vi.mock("store/useAppStore");

const mockToastError = vi.fn();
const mockAppStore = vi.mocked(useAppStore.useAppSetChatsStore);
const mockAppDeleteChatByIdStore = vi.mocked(
  useAppStore.useAppDeleteChatByIdStore
);
const setChatsMock = vi.fn();
const mockDeleteChatById = vi.fn();

describe("useChats", () => {
  (toastHook.useToast as Mock).mockReturnValue({
    toastError: mockToastError,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockAppStore.mockReturnValue(setChatsMock);
    mockAppDeleteChatByIdStore.mockReturnValue(mockDeleteChatById);
  });

  it("getAllChats returns chats", async () => {
    const chatsRes = [{ id: "1", title: "Chat 1" }];
    vi.spyOn(chatService, "getAllChatsService").mockResolvedValue({
      chats: chatsRes,
    });
    const { result } = renderHook(() => useChats());
    await result.current.getAllChats();
    expect(setChatsMock).toHaveBeenCalledWith(chatsRes);
  });

  it("getAllChats calls toastError on error", async () => {
    vi.spyOn(chatService, "getAllChatsService").mockRejectedValue(
      new Error("fail")
    );
    const { result } = renderHook(() => useChats());
    await act(async () => {
      await result.current.getAllChats();
    });
    expect(mockToastError).toHaveBeenCalledWith(
      "Error fetching chats, please try again later."
    );
  });

  it("getChatMessages returns messages and sets loading", async () => {
    const mockRes: ChatMessagesRes = {
      historyMessages: [
        {
          content: "Content",
          role: "User",
          completionTokens: 100,
          promptTokens: 100,
        },
      ],
      model: "model",
      totalCompletionTokens: 100,
      totalPromptTokens: 100,
      maxOutputTokens: 2000,
    };
    vi.spyOn(chatService, "getChatMessagesService").mockResolvedValue(mockRes);
    const { result } = renderHook(() => useChats());
    let res;
    await act(async () => {
      res = await result.current.getChatMessages("chat1");
    });
    expect(res).toEqual(mockRes);
    expect(result.current.isChatLoading).toBe(false);
  });

  it("getChatMessages sets isEmptyPage if no messages on next page", async () => {
    vi.spyOn(chatService, "getChatMessagesService").mockResolvedValue({
      historyMessages: [],
      model: "model",
      totalCompletionTokens: 100,
      totalPromptTokens: 100,
      maxOutputTokens: 2000,
    });
    const { result } = renderHook(() => useChats());
    await act(async () => {
      await result.current.getChatMessages("chat1", 2);
    });
    expect(result.current.isEmptyPage).toBe(true);
  });

  it("getChatMessages calls toastError on error", async () => {
    vi.spyOn(chatService, "getChatMessagesService").mockRejectedValue(
      new Error("fail")
    );
    const { result } = renderHook(() => useChats());
    await act(async () => {
      await result.current.getChatMessages("chat1");
    });
    expect(mockToastError).toHaveBeenCalledWith(
      "Error fetching chat messages, please try again later."
    );
  });

  it("sendNewMessage calls service", async () => {
    const res: NewMessageRes = {
      completionTokens: 100,
      content: "Content",
      promptTokens: 100,
      totalChatCompletionTokens: 100,
      totalChatPromptTokens: 100,
      totalTokens: 100,
      chatId: "chat1",
    };
    vi.spyOn(chatService, "sendNewMessageService").mockResolvedValue(res);
    const { result } = renderHook(() => useChats());
    const req: NewMessageReq = {
      prompt: "hi",
      chatId: "chat1",
      maxOutputTokens: 2000,
    };
    let ress;
    await act(async () => {
      ress = await result.current.sendNewMessage(req);
    });
    expect(ress).not.toBeUndefined();
    expect(ress).toEqual(res);
  });

  it("sendNewMessage calls toastError on error", async () => {
    vi.spyOn(chatService, "sendNewMessageService").mockRejectedValue(
      new Error("fail")
    );
    const { result } = renderHook(() => useChats());
    const req: NewMessageReq = {
      prompt: "hi",
      chatId: "chat1",
      maxOutputTokens: 2000,
    };
    await act(async () => {
      await result.current.sendNewMessage(req);
    });
    expect(mockToastError).toHaveBeenCalledWith(
      "Error sending message, please try again later."
    );
    expect(result.current.isSending).toBe(false);
  });

  it("deleteChat calls service", async () => {
    const spy = vi
      .spyOn(chatService, "deleteChatService")
      .mockResolvedValue(undefined);
    const { result } = renderHook(() => useChats());
    await act(async () => {
      await result.current.deleteChat("chat1");
    });
    expect(spy).toHaveBeenCalledWith("chat1");
    expect(mockDeleteChatById).toHaveBeenCalledWith("chat1");
  });

  it("deleteChat calls toastError on error", async () => {
    vi.spyOn(chatService, "deleteChatService").mockRejectedValue(
      new Error("fail")
    );
    const { result } = renderHook(() => useChats());
    await act(async () => {
      await result.current.deleteChat("chat1");
    });
    expect(mockToastError).toHaveBeenCalledWith(
      "Error deleting chat, please try again later."
    );
  });
});
