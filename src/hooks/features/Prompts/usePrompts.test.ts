import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { usePrompts } from "./usePrompts";
import * as promptsService from "services/prompts.service";
import * as toastHook from "../../useToast";
import { CustomPrompt } from "types/prompts/CustomPrompt.type";

vi.mock("./useToast");

const mockToastError = vi.fn();

describe("usePrompts", () => {
  (toastHook.useToast as Mock).mockReturnValue({
    toastError: mockToastError,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getPrompts sets prompts on success", async () => {
    const prompts = [{ id: "1", name: "B 1" }, { id: "1", name: "A 1" }];
    vi.spyOn(promptsService, "getPromptsService").mockResolvedValue({
      prompts: prompts,
    });
    const { result } = renderHook(() => usePrompts());
    await act(async () => {
      await result.current.getPrompts();
    });
    expect(result.current.prompts).toEqual(prompts.sort((a, b) => a.name.localeCompare(b.name)));
  });

  it("getPrompts calls toastError on error", async () => {
    vi.spyOn(promptsService, "getPromptsService").mockRejectedValue(
      new Error("fail")
    );
    const { result } = renderHook(() => usePrompts());
    await act(async () => {
      await result.current.getPrompts();
    });
    expect(mockToastError).toHaveBeenCalledWith(
      "Failed to fetch prompts. Please try again later."
    );
  });

  it("getPromptById sets prompt on success", async () => {
    const customPrompt: CustomPrompt = {
      id: "1",
      name: "Prompt 1",
      content: "Description 1",
      createdAt: new Date(),
      messages: [],
      updatedAt: new Date(),
    };
    vi.spyOn(promptsService, "getPromptByIdService").mockResolvedValue(
      customPrompt
    );
    const { result } = renderHook(() => usePrompts());
    let prompt;
    await act(async () => {
      prompt = await result.current.getPromptById("1");
    });
    expect(prompt).toEqual(customPrompt);
    expect(result.current.loading).toBe(false);
  });

  it("getPromptById calls toastError on error", async () => {
    vi.spyOn(promptsService, "getPromptByIdService").mockRejectedValue(
      new Error("fail")
    );
    const { result } = renderHook(() => usePrompts());
    await act(async () => {
      await result.current.getPromptById("1");
    });
    expect(mockToastError).toHaveBeenCalledWith(
      "Failed to fetch prompt. Please try again later."
    );
    expect(result.current.loading).toBe(false);
  });

  it("deletePromptMessage calls service and sets loading", async () => {
    const spy = vi
      .spyOn(promptsService, "deletePromptMessageService")
      .mockResolvedValue(undefined);
    const { result } = renderHook(() => usePrompts());
    await act(async () => {
      await result.current.deletePromptMessage("pid", "mid");
    });
    expect(spy).toHaveBeenCalledWith("pid", "mid");
    expect(result.current.loading).toBe(false);
  });

  it("deletePromptMessage calls toastError on error", async () => {
    vi.spyOn(promptsService, "deletePromptMessageService").mockRejectedValue(
      new Error("fail")
    );
    const { result } = renderHook(() => usePrompts());
    await act(async () => {
      await result.current.deletePromptMessage("pid", "mid");
    });
    expect(mockToastError).toHaveBeenCalledWith(
      "Failed to delete prompt message. Please try again later."
    );
    expect(result.current.loading).toBe(false);
  });

  it("deletePrompt calls service and sets loading", async () => {
    const spy = vi
      .spyOn(promptsService, "deletePromptService")
      .mockResolvedValue(undefined);
    const { result } = renderHook(() => usePrompts());
    await act(async () => {
      await result.current.deletePrompt("pid");
    });
    expect(spy).toHaveBeenCalledWith("pid");
    expect(result.current.loading).toBe(false);
  });

  it("deletePrompt calls toastError on error", async () => {
    vi.spyOn(promptsService, "deletePromptService").mockRejectedValue(
      new Error("fail")
    );
    const { result } = renderHook(() => usePrompts());
    await act(async () => {
      await result.current.deletePrompt("pid");
    });
    expect(mockToastError).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });
});
