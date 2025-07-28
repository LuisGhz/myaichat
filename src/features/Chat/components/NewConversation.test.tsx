import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewConversation } from "./NewConversation";

// Mock the usePrompts hook
vi.mock("hooks/features/Prompts/usePrompts", () => {
  return {
    usePrompts: () => ({
      prompts: [
        { id: "prompt-1", name: "Prompt 1" },
        { id: "prompt-2", name: "Prompt 2" },
      ],
      getPrompts: vi.fn(),
    }),
  };
});

// Mock the MODELS constant
vi.mock("consts/Models", () => ({
  MODELS: [
    { name: "Model A", value: "gpt-4o-mini" },
    { name: "Model B", value: "gemini-2.0-flash-lite" },
  ],
}));

describe("NewConversation Component", () => {
  const mockSetModel = vi.fn();
  const mockSetPromptId = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockSetModel.mockClear();
    mockSetPromptId.mockClear();
  });

  // Helper to render the component
  function renderComponent(props?: Partial<Parameters<typeof NewConversation>[0]>) {
    return render(
      <NewConversation
        model={props?.model ?? "gpt-4o-mini"}
        setModel={props?.setModel ?? mockSetModel}
        promptId={props?.promptId ?? ""}
        setPromptId={props?.setPromptId ?? mockSetPromptId}
      />
    );
  }

  it("renders the component with the correct elements", () => {
    renderComponent();
    expect(screen.getByText("Hello, what can assist you today?")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "model" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "prompt" })).toBeInTheDocument();
  });

  it("populates the model select with options from MODELS", () => {
    renderComponent();
    expect(screen.getByRole("option", { name: "Model A" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Model B" })).toBeInTheDocument();
  });

  it("populates the prompt select with options from usePrompts", () => {
    renderComponent();
    expect(screen.getByRole("option", { name: "Select a prompt if you wish" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Prompt 1" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Prompt 2" })).toBeInTheDocument();
  });

  it("calls setModel when the model select changes", async () => {
    const user = userEvent.setup();
    renderComponent();
    const modelSelect = screen.getByRole("combobox", { name: "model" });
    await user.selectOptions(modelSelect, "gemini-2.0-flash-lite");
    expect(mockSetModel).toHaveBeenCalledWith("gemini-2.0-flash-lite");
  });

  it("calls setPromptId when the prompt select changes", async () => {
    const user = userEvent.setup();
    renderComponent();
    const promptSelect = screen.getByRole("combobox", { name: "prompt" });
    await user.selectOptions(promptSelect, "prompt-1");
    expect(mockSetPromptId).toHaveBeenCalledWith("prompt-1");
  });


  // No test for setIsWelcomeLoaded, as the prop is not present in the component

  it("selects the correct model based on the initial prop", () => {
    renderComponent({ model: "gpt-4o-mini" });
    const modelSelect = screen.getByRole("combobox", { name: "model" });
    expect((modelSelect as HTMLSelectElement).value).toBe("gpt-4o-mini");
  });

  it("selects the correct prompt based on the initial prop", () => {
    renderComponent({ promptId: "prompt-2" });
    const promptSelect = screen.getByRole("combobox", { name: "prompt" });
    expect((promptSelect as HTMLSelectElement).value).toBe("prompt-2");
  });
});
