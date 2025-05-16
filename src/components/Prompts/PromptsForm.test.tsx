/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { PromptsForm } from "./PromptsForm";
import * as reactRouter from "react-router";
import * as usePromptFormHook from "hooks/usePromptForm";
import * as usePromptsHook from "hooks/usePrompts";
import { PromptForm } from "./PromptSchema";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

vi.mock("react-hook-form");
const mockUseForm = useForm as unknown as Mock;

// Mock child components
vi.mock("./inputs/InputName", () => ({
  InputName: () => <div data-testid="input-name">InputName Component</div>,
}));

vi.mock("./inputs/InputContent", () => ({
  InputContent: () => (
    <div data-testid="input-content">InputContent Component</div>
  ),
}));

vi.mock("./inputs/MessagesForm", () => ({
  MessagesForm: () => (
    <div data-testid="messages-form">MessagesForm Component</div>
  ),
}));

vi.mock("./inputs/ParamsForm", () => ({
  ParamsForm: () => <div data-testid="params-form">ParamsForm Component</div>,
}));

// Mock react-router hooks
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
    Link: ({ to, children, className }: any) => (
      <a href={to} className={className} data-testid="router-link">
        {children}
      </a>
    ),
  };
});

describe("PromptsForm", () => {
  const mockNavigate = vi.fn();
  const mockOnPromptFormSubmit = vi.fn();
  const mockOnPromptUpdateFormSubmit = vi.fn();
  const mockGetPromptById = vi.fn();
  const mockFormData: PromptForm = {
    name: "Test Prompt",
    content: "Test content",
    messages: [],
    params: [],
  };

  const mockingUseForm = (formState: { errors: any; isValid: boolean }) => {
    mockUseForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: (cb: any) => (data: any) => cb(data),
      setValue: vi.fn(),
      control: {},
      formState,
      getValues: vi.fn(),
      reset: vi.fn(),
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup react-router mocks
    vi.mocked(reactRouter.useNavigate).mockReturnValue(mockNavigate);

    // Setup custom hooks mocks
    vi.spyOn(usePromptFormHook, "usePromptForm").mockReturnValue({
      onPromptFormSubmit: mockOnPromptFormSubmit,
      onPromptUpdateFormSubmit: mockOnPromptUpdateFormSubmit,
    });

    vi.spyOn(usePromptsHook, "usePrompts").mockReturnValue({
      prompts: [],
      getPromptById: mockGetPromptById,
      loading: false,
      deletePromptParam: vi.fn(),
      deletePromptMessage: vi.fn(),
      getPrompts: vi.fn(),
      deletePrompt: vi.fn(),
    });

    mockingUseForm({ errors: {}, isValid: true });
  });

  it("renders form in create mode when no ID is provided", () => {
    vi.mocked(reactRouter.useParams).mockReturnValue({});

    render(<PromptsForm />);

    expect(screen.getByText("Create a prompt here.")).toBeInTheDocument();
    expect(screen.queryByText("loading")).not.toBeInTheDocument();
    expect(screen.getByText("Save Prompt")).toBeInTheDocument();
    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-content")).toBeInTheDocument();
    expect(screen.getByTestId("messages-form")).toBeInTheDocument();
    expect(screen.getByTestId("params-form")).toBeInTheDocument();
  });

  it("renders form in edit mode when ID is provided and shows loading state", () => {
    vi.mocked(reactRouter.useParams).mockReturnValue({ id: "123" });
    vi.spyOn(usePromptsHook, "usePrompts").mockReturnValue({
      prompts: [],
      getPromptById: mockGetPromptById,
      loading: true,
      deletePromptParam: vi.fn(),
      deletePromptMessage: vi.fn(),
      getPrompts: vi.fn(),
      deletePrompt: vi.fn(),
    });

    render(<PromptsForm />);

    expect(screen.getByText("loading")).toBeInTheDocument();
    expect(screen.getByText("Edit your prompt here.")).toBeInTheDocument();
  });

  it("fetches prompt data when ID is provided", async () => {
    vi.mocked(reactRouter.useParams).mockReturnValue({ id: "123" });
    mockGetPromptById.mockResolvedValue(mockFormData);

    render(<PromptsForm />);

    await waitFor(() => {
      expect(mockGetPromptById).toHaveBeenCalledWith("123");
    });
  });

  it("submits form to create a new prompt when no ID is provided", async () => {
    vi.mocked(reactRouter.useParams).mockReturnValue({});
    mockOnPromptFormSubmit.mockResolvedValue(true);

    render(<PromptsForm />);

    const submitButton = screen.getByText("Save Prompt");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnPromptFormSubmit).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/prompts");
    });
  });

  it("submits form to update an existing prompt when ID is provided", async () => {
    vi.mocked(reactRouter.useParams).mockReturnValue({ id: "123" });
    mockOnPromptUpdateFormSubmit.mockResolvedValue(true);

    render(<PromptsForm />);

    const submitButton = screen.getByText("Save Prompt");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnPromptUpdateFormSubmit).toHaveBeenCalledWith(
        "123",
        expect.anything()
      );
      expect(mockNavigate).toHaveBeenCalledWith("/prompts");
    });
  });

  it("does not navigate when form submission returns false", async () => {
    vi.mocked(reactRouter.useParams).mockReturnValue({});
    mockOnPromptFormSubmit.mockResolvedValue(false);

    render(<PromptsForm />);

    const submitButton = screen.getByText("Save Prompt");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnPromptFormSubmit).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("does not submit form when form is invalid", async () => {
    mockingUseForm({
      errors: { name: { message: "Name is required" } },
      isValid: false,
    });
    vi.mocked(reactRouter.useParams).mockReturnValue({});

    render(<PromptsForm />);

    const submitButton = screen.getByText("Save Prompt");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnPromptFormSubmit).not.toHaveBeenCalled();
    });
  });

  it("navigates back to prompts page when back button is clicked", () => {
    vi.mocked(reactRouter.useParams).mockReturnValue({});

    render(<PromptsForm />);

    const backLink = screen.getByTestId("router-link");
    expect(backLink.getAttribute("href")).toBe("/prompts");
  });
});
