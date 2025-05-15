/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as api from "api";
import {
  getPromptsService,
  getPromptByIdService,
  createPromptService,
  updatePromptService,
  deletePromptService,
  deletePromptParamService,
  deletePromptMessageService,
} from "./prompts.service";

vi.mock("api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    del: vi.fn(),
  },
}));

const apiClient = api.apiClient;

describe("prompts.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getPromptsService calls apiClient.get with correct endpoint", () => {
    getPromptsService();
    expect(apiClient.get).toHaveBeenCalledWith("/custom-prompts/all");
  });

  it("getPromptByIdService calls apiClient.get with correct endpoint", () => {
    getPromptByIdService("123");
    expect(apiClient.get).toHaveBeenCalledWith("/custom-prompts/123");
  });

  it("createPromptService calls apiClient.post with correct endpoint and data", () => {
    const req = { name: "test" };
    createPromptService(req as any);
    expect(apiClient.post).toHaveBeenCalledWith("/custom-prompts", req);
  });

  it("updatePromptService calls apiClient.patch with correct endpoint and data", () => {
    const req = { id: "123", name: "updated" };
    updatePromptService(req as any);
    expect(apiClient.patch).toHaveBeenCalledWith(
      "/custom-prompts/123/update",
      { name: "updated" }
    );
  });

  it("deletePromptService calls apiClient.del with correct endpoint", () => {
    deletePromptService("123");
    expect(apiClient.del).toHaveBeenCalledWith("/custom-prompts/123/delete");
  });

  it("deletePromptParamService calls apiClient.del with correct endpoint", () => {
    deletePromptParamService("123", "456");
    expect(apiClient.del).toHaveBeenCalledWith("/custom-prompts/123/456/delete-param");
  });

  it("deletePromptMessageService calls apiClient.del with correct endpoint", () => {
    deletePromptMessageService("123", "789");
    expect(apiClient.del).toHaveBeenCalledWith("/custom-prompts/123/789/delete-message");
  });
});