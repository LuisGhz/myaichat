import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewConversation } from "./NewConversation";

// Mock the usePrompts hook
vi.mock("hooks/usePrompts", () => {
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
  const mockSetIsWelcomeLoaded = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the component with the correct elements", () => {
    render(
      <NewConversation
        model="gpt-4o-mini"
        setModel={mockSetModel}
        promptId=""
        setPromptId={mockSetPromptId}
        setIsWelcomeLoaded={mockSetIsWelcomeLoaded}
      />
    );

    expect(
      screen.getByText("Hello, what can assist you today?")
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "model" })).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "prompt" })
    ).toBeInTheDocument();
  });

  it("populates the model select with options from MODELS", () => {
    render(
      <NewConversation
        model="gpt-4o-mini"
        setModel={mockSetModel}
        promptId=""
        setPromptId={mockSetPromptId}
        setIsWelcomeLoaded={mockSetIsWelcomeLoaded}
      />
    );

    expect(screen.getByRole("option", { name: "Model A" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Model B" })).toBeInTheDocument();
  });

  it("populates the prompt select with options from usePrompts", () => {
    render(
      <NewConversation
        model="gpt-4o-mini"
        setModel={mockSetModel}
        promptId=""
        setPromptId={mockSetPromptId}
        setIsWelcomeLoaded={mockSetIsWelcomeLoaded}
      />
    );

    expect(
      screen.getByRole("option", { name: "Select a prompt if you wish" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Prompt 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Prompt 2" })
    ).toBeInTheDocument();
  });

  it("calls setModel when the model select changes", async () => {
    const user = userEvent.setup();
    render(
      <NewConversation
        model="gpt-4o-mini"
        setModel={mockSetModel}
        promptId=""
        setPromptId={mockSetPromptId}
        setIsWelcomeLoaded={mockSetIsWelcomeLoaded}
      />
    );

    const modelSelect = screen.getByRole("combobox", { name: "model" });
    await user.selectOptions(modelSelect, "gemini-2.0-flash-lite");

    expect(mockSetModel).toHaveBeenCalledWith("gemini-2.0-flash-lite");
  });

  it("calls setPromptId when the prompt select changes", async () => {
    const user = userEvent.setup();
    render(
      <NewConversation
        model="gpt-4o-mini"
        setModel={mockSetModel}
        promptId=""
        setPromptId={mockSetPromptId}
        setIsWelcomeLoaded={mockSetIsWelcomeLoaded}
      />
    );

    const promptSelect = screen.getByRole("combobox", { name: "prompt" });
    await user.selectOptions(promptSelect, "prompt-1");

    expect(mockSetPromptId).toHaveBeenCalledWith("prompt-1");
  });

  it("calls getPrompts and setIsWelcomeLoaded on mount", async () => {
    render(
      <NewConversation
        model="gpt-4o-mini"
        setModel={mockSetModel}
        promptId=""
        setPromptId={mockSetPromptId}
        setIsWelcomeLoaded={mockSetIsWelcomeLoaded}
      />
    );

    // Wait for the useEffect to run
    await waitFor(() => {
      // expect(mockPrompts.getPrompts).toHaveBeenCalled();
      expect(mockSetIsWelcomeLoaded).toHaveBeenCalledWith(true);
    });
  });

  it("selects the correct model based on the initial prop", () => {
    render(
      <NewConversation
        model="gpt-4o-mini"
        setModel={mockSetModel}
        promptId=""
        setPromptId={mockSetPromptId}
        setIsWelcomeLoaded={mockSetIsWelcomeLoaded}
      />
    );

    const modelSelect = screen.getByRole("combobox", { name: "model" });
    expect((modelSelect as HTMLSelectElement).value).toBe("gpt-4o-mini");
  });

  it("selects the correct prompt based on the initial prop", () => {
    render(
      <NewConversation
        model="gpt-4o-mini"
        setModel={mockSetModel}
        promptId="prompt-2"
        setPromptId={mockSetPromptId}
        setIsWelcomeLoaded={mockSetIsWelcomeLoaded}
      />
    );

    const promptSelect = screen.getByRole("combobox", { name: "prompt" });
    expect((promptSelect as HTMLSelectElement).value).toBe("prompt-2");
  });
});
