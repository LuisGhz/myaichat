import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { usePromptForm } from "./usePromptForm";
import type { PromptForm } from "../components/Prompts/PromptSchema"; // Adjusted path
import {
  createPromptService,
  updatePromptService,
} from "../services/prompts.service"; // Adjusted path

// Mock dependencies
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock("./useToast", () => ({
  useToast: () => ({
    toastSuccess: mockToastSuccess,
    toastError: mockToastError,
  }),
}));

vi.mock("../services/prompts.service", () => ({
  // Adjusted path
  createPromptService: vi.fn(),
  updatePromptService: vi.fn(),
}));

describe("usePromptForm", () => {
  const mockedCreatePromptService = createPromptService as Mock;
  const mockedUpdatePromptService = updatePromptService as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("onPromptFormSubmit", () => {
    const baseFormData: PromptForm = {
      name: "Test Prompt",
      content: "Test content",
    };

    it("should call createPromptService with mapped data and show success toast", async () => {
      const formData: PromptForm = {
        ...baseFormData,
        messages: [
          { id: "msg-default-1", role: "User", content: "Hello" },
          { id: "msg-2", role: "Assistant", content: "Hi there" },
        ],
        params: [
          { id: "param-default-1", name: "p1", value: "v1" },
          { id: "param-2", name: "p2", value: "v2" },
        ],
      };
      const mockResponse = { id: "new-prompt-id", ...formData };
      mockedCreatePromptService.mockResolvedValue(mockResponse);

      const { onPromptFormSubmit } = usePromptForm();
      const result = await onPromptFormSubmit(formData);

      expect(mockedCreatePromptService).toHaveBeenCalledWith({
        name: "Test Prompt",
        content: "Test content",
        messages: [
          { role: "User", content: "Hello" },
          { role: "Assistant", content: "Hi there" },
        ],
        params: [
          { id: "", name: "p1", value: "v1" }, // default id cleaned
          { id: "param-2", name: "p2", value: "v2" },
        ],
      });
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Prompt created successfully!"
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle undefined messages and params", async () => {
      const formData: PromptForm = {
        ...baseFormData,
        messages: undefined,
        params: undefined,
      };
      const mockResponse = { id: "new-prompt-id", ...formData };
      mockedCreatePromptService.mockResolvedValue(mockResponse);

      const { onPromptFormSubmit } = usePromptForm();
      await onPromptFormSubmit(formData);

      expect(mockedCreatePromptService).toHaveBeenCalledWith({
        name: "Test Prompt",
        content: "Test content",
        messages: undefined,
        params: undefined,
      });
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Prompt created successfully!"
      );
    });

    it("should handle empty messages and params arrays", async () => {
      const formData: PromptForm = {
        ...baseFormData,
        messages: [],
        params: [],
      };
      const mockResponse = { id: "new-prompt-id", ...formData };
      mockedCreatePromptService.mockResolvedValue(mockResponse);

      const { onPromptFormSubmit } = usePromptForm();
      await onPromptFormSubmit(formData);

      expect(mockedCreatePromptService).toHaveBeenCalledWith({
        name: "Test Prompt",
        content: "Test content",
        messages: [],
        params: [],
      });
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Prompt created successfully!"
      );
    });

    it("should call toastError on createPromptService failure", async () => {
      const formData: PromptForm = { ...baseFormData };
      const errorMessage = "Failed to create";
      mockedCreatePromptService.mockRejectedValue(new Error(errorMessage));

      const { onPromptFormSubmit } = usePromptForm();
      const result = await onPromptFormSubmit(formData);

      expect(mockedCreatePromptService).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith(`Error: ${errorMessage}`);
      expect(mockToastSuccess).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("onPromptUpdateFormSubmit", () => {
    const promptId = "existing-prompt-123";
    const baseFormData: PromptForm = {
      name: "Updated Prompt",
      content: "Updated content",
    };

    it("should call updatePromptService with mapped data and show success toast", async () => {
      const formData: PromptForm = {
        ...baseFormData,
        messages: [
          { id: "msg-upd-default-1", role: "User", content: "Hello Updated" },
          { id: "msg-upd-2", role: "Assistant", content: "Hi there Updated" },
        ],
        params: [
          { id: "param-upd-default-1", name: "p1_upd", value: "v1_upd" },
          { id: "param-upd-2", name: "p2_upd", value: "v2_upd" },
        ],
      };
      const mockResponse = { id: promptId, ...formData };
      mockedUpdatePromptService.mockResolvedValue(mockResponse);

      const { onPromptUpdateFormSubmit } = usePromptForm();
      const result = await onPromptUpdateFormSubmit(promptId, formData);

      expect(mockedUpdatePromptService).toHaveBeenCalledWith({
        id: promptId,
        name: "Updated Prompt",
        content: "Updated content",
        messages: [
          { id: "", role: "User", content: "Hello Updated" }, // default id cleaned
          { id: "msg-upd-2", role: "Assistant", content: "Hi there Updated" },
        ],
        params: [
          { id: "", name: "p1_upd", value: "v1_upd" }, // default id cleaned
          { id: "param-upd-2", name: "p2_upd", value: "v2_upd" },
        ],
      });
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Prompt updated successfully!"
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle undefined messages and params for update", async () => {
      const formData: PromptForm = {
        ...baseFormData,
        messages: undefined,
        params: undefined,
      };
      const mockResponse = { id: promptId, ...formData };
      mockedUpdatePromptService.mockResolvedValue(mockResponse);

      const { onPromptUpdateFormSubmit } = usePromptForm();
      await onPromptUpdateFormSubmit(promptId, formData);

      expect(mockedUpdatePromptService).toHaveBeenCalledWith({
        id: promptId,
        name: "Updated Prompt",
        content: "Updated content",
        messages: undefined,
        params: undefined,
      });
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Prompt updated successfully!"
      );
    });

    it("should handle empty messages and params arrays for update", async () => {
      const formData: PromptForm = {
        ...baseFormData,
        messages: [],
        params: [],
      };
      const mockResponse = { id: promptId, ...formData };
      mockedUpdatePromptService.mockResolvedValue(mockResponse);

      const { onPromptUpdateFormSubmit } = usePromptForm();
      await onPromptUpdateFormSubmit(promptId, formData);

      expect(mockedUpdatePromptService).toHaveBeenCalledWith({
        id: promptId,
        name: "Updated Prompt",
        content: "Updated content",
        messages: [],
        params: [],
      });
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Prompt updated successfully!"
      );
    });

    it("should call toastError on updatePromptService failure", async () => {
      const formData: PromptForm = { ...baseFormData };
      const errorMessage = "Failed to update";
      mockedUpdatePromptService.mockRejectedValue(new Error(errorMessage));

      const { onPromptUpdateFormSubmit } = usePromptForm();
      const result = await onPromptUpdateFormSubmit(promptId, formData);

      expect(mockedUpdatePromptService).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith(`Error: ${errorMessage}`);
      expect(mockToastSuccess).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
