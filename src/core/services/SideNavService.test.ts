import { getChatSummaryService, toggleFavoriteService } from "./SideNavService";

// Mock apiClient
const mockGet = vi.fn();
const mockPatch = vi.fn();

vi.mock("api", () => ({
  apiClient: {
    get: mockGet,
    patch: mockPatch,
  },
}));

describe("SideNavService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getChatSummaryService", () => {
    it("should call apiClient.get with correct endpoint", async () => {
      const mockResponse = { data: [{ id: "1", title: "Chat 1" }] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await getChatSummaryService();

      expect(mockGet).toHaveBeenCalledWith("/chat/all");
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it("should return the response from apiClient.get", async () => {
      const mockResponse = { data: [] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await getChatSummaryService();

      expect(result).toEqual(mockResponse);
    });
  });

  describe("toggleFavoriteService", () => {
    it("should call apiClient.patch with correct endpoint and chatId", async () => {
      const chatId = "test-chat-123";
      const mockResponse = { success: true };
      mockPatch.mockResolvedValueOnce(mockResponse);

      const result = await toggleFavoriteService(chatId);

      expect(mockPatch).toHaveBeenCalledWith(`/chat/${chatId}/toggle-chat-fav`);
      expect(mockPatch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it("should handle different chatId values", async () => {
      const chatId = "another-chat-456";
      const mockResponse = { success: true };
      mockPatch.mockResolvedValueOnce(mockResponse);

      await toggleFavoriteService(chatId);

      expect(mockPatch).toHaveBeenCalledWith(`/chat/${chatId}/toggle-chat-fav`);
    });

    it("should return the response from apiClient.patch", async () => {
      const mockResponse = { success: false, error: "Not found" };
      mockPatch.mockResolvedValueOnce(mockResponse);

      const result = await toggleFavoriteService("any-id");

      expect(result).toEqual(mockResponse);
    });
  });
});
