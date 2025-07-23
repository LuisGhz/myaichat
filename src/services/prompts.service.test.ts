/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authApi from "api/auth.api";
import {
  getPromptsService,
  getPromptByIdService,
  createPromptService,
  updatePromptService,
  deletePromptService,
  deletePromptMessageService,
} from "./prompts.service";

vi.mock("api/auth.api", () => ({
  authenticatedApiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    del: vi.fn(),
  },
}));

const authenticatedApiClient = authApi.authenticatedApiClient;

describe("prompts.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getPromptsService calls apiClient.get with correct endpoint", () => {
    getPromptsService();
    expect(authenticatedApiClient.get).toHaveBeenCalledWith("/custom-prompts/all");
  });

  it("getPromptByIdService calls apiClient.get with correct endpoint", () => {
    getPromptByIdService("123");
    expect(authenticatedApiClient.get).toHaveBeenCalledWith("/custom-prompts/123");
  });

  it("createPromptService calls apiClient.post with correct endpoint and data", () => {
    const req = { name: "test" };
    createPromptService(req as any);
    expect(authenticatedApiClient.post).toHaveBeenCalledWith("/custom-prompts", req);
  });

  it("updatePromptService calls apiClient.patch with correct endpoint and data", () => {
    const req = { id: "123", name: "updated" };
    updatePromptService(req as any);
    expect(authenticatedApiClient.patch).toHaveBeenCalledWith(
      "/custom-prompts/123/update",
      { name: "updated" }
    );
  });

  it("deletePromptService calls apiClient.del with correct endpoint", () => {
    deletePromptService("123");
    expect(authenticatedApiClient.del).toHaveBeenCalledWith("/custom-prompts/123/delete");
  });

  it("deletePromptMessageService calls apiClient.del with correct endpoint", () => {
    deletePromptMessageService("123", "789");
    expect(authenticatedApiClient.del).toHaveBeenCalledWith("/custom-prompts/123/789/delete-message");
  });
});