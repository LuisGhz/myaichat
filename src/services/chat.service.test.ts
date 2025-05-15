import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import * as chatService from "./chat.service";
import { apiClient } from "api";

vi.mock("api", () => ({
  apiClient: {
    get: vi.fn(),
    postFormData: vi.fn(),
    del: vi.fn(),
  },
}));

describe("chat.service", () => {
  (apiClient.get as Mock).mockResolvedValue("mocked");
  (apiClient.postFormData as Mock).mockResolvedValue("mocked");
  (apiClient.del as Mock).mockResolvedValue("mocked");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllChatsService calls apiClient.get with /chat/all", async () => {
    const res = await chatService.getAllChatsService();
    expect(apiClient.get).toHaveBeenCalledWith("/chat/all");
    expect(res).toBe("mocked");
  });

  it("getChatMessagesService calls apiClient.get with correct url", async () => {
    const res = await chatService.getChatMessagesService("123", 2);
    expect(apiClient.get).toHaveBeenCalledWith("/chat/123/messages?page=2");
    expect(res).toBe("mocked");
  });

  it("getChatMessagesService uses default page 0", async () => {
    await chatService.getChatMessagesService("abc");
    expect(apiClient.get).toHaveBeenCalledWith("/chat/abc/messages?page=0");
  });

  it("sendNewMessageService calls apiClient.postFormData with correct args", async () => {
    const formData = new FormData();
    const res = await chatService.sendNewMessageService(formData);
    expect(apiClient.postFormData).toHaveBeenCalledWith(
      "/chat/send-message",
      formData
    );
    expect(res).toBe("mocked");
  });

  it("deleteChatService calls apiClient.del with correct url", async () => {
    const res = await chatService.deleteChatService("xyz");
    expect(apiClient.del).toHaveBeenCalledWith("/chat/xyz/delete");
    expect(res).toBe("mocked");
  });
});
