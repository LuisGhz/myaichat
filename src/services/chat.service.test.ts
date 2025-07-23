import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import * as chatService from "./chat.service";
import { authenticatedApiClient } from "api/auth.api";

vi.mock("api/auth.api", () => ({
  authenticatedApiClient: {
    get: vi.fn(),
    postFormData: vi.fn(),
    del: vi.fn(),
  },
}));

describe("chat.service", () => {
  (authenticatedApiClient.get as Mock).mockResolvedValue("mocked");
  (authenticatedApiClient.postFormData as Mock).mockResolvedValue("mocked");
  (authenticatedApiClient.del as Mock).mockResolvedValue("mocked");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllChatsService calls authenticatedApiClient.get with /chat/all", async () => {
    const res = await chatService.getAllChatsService();
    expect(authenticatedApiClient.get).toHaveBeenCalledWith("/chat/all");
    expect(res).toBe("mocked");
  });

  it("getChatMessagesService calls authenticatedApiClient.get with correct url", async () => {
    const res = await chatService.getChatMessagesService("123", 2);
    expect(authenticatedApiClient.get).toHaveBeenCalledWith("/chat/123/messages?page=2");
    expect(res).toBe("mocked");
  });

  it("getChatMessagesService uses default page 0", async () => {
    await chatService.getChatMessagesService("abc");
    expect(authenticatedApiClient.get).toHaveBeenCalledWith("/chat/abc/messages?page=0");
  });

  it("sendNewMessageService calls authenticatedApiClient.postFormData with correct args", async () => {
    const formData = new FormData();
    const res = await chatService.sendNewMessageService(formData);
    expect(authenticatedApiClient.postFormData).toHaveBeenCalledWith(
      "/chat/send-message",
      formData
    );
    expect(res).toBe("mocked");
  });

  it("deleteChatService calls authenticatedApiClient.del with correct url", async () => {
    const res = await chatService.deleteChatService("xyz");
    expect(authenticatedApiClient.del).toHaveBeenCalledWith("/chat/xyz/delete");
    expect(res).toBe("mocked");
  });
});
