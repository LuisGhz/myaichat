/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, describe, it, expect, Mock } from "vitest";
import { render, screen, waitFor, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessagesForm } from "./MessagesForm";
import { useForm, useFieldArray } from "react-hook-form";
import { PromptForm, promptSchema } from "../PromptSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import { useParams } from "react-router";
import { usePrompts } from "hooks/usePrompts";

// Mock necessary dependencies
vi.mock("react-hook-form", async () => {
  const actual = (await vi.importActual("react-hook-form")) as any;
  return {
    ...actual,
    useFieldArray: vi.fn(),
  };
});
const useFieldArrayMock = useFieldArray as unknown as Mock<any>;

vi.mock("uuid");
const v4Mock = v4 as unknown as Mock<any>;

vi.mock("react-router");
const useParamsMock = useParams as unknown as Mock<any>;

vi.mock("components/Dialogs/ConfirmDialog", () => ({
  ConfirmDialog: ({
    isOpen,
    onConfirm,
    onCancel,
    message,
  }: {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string[];
  }) =>
    isOpen ? (
      <div data-testid="confirm-dialog">
        <div>{message[0]}</div>
        <div>{message[1]}</div>
        <button onClick={onConfirm} data-testid="confirm-button">
          Confirm
        </button>
        <button onClick={onCancel} data-testid="cancel-button">
          Cancel
        </button>
      </div>
    ) : null,
}));

vi.mock("assets/icons/XMarkIcon", () => ({
  XMarkIcon: () => <div>XMarkIcon</div>,
}));

vi.mock("hooks/usePrompts");
const usePromptsMock = usePrompts as unknown as Mock<any>;

vi.mock("assets/icons/PlusIcon", () => ({
  PlusIcon: () => <div>PlusIcon</div>,
}));

describe("MessagesForm Component", () => {
  let mockErrors: any = [];
  const mockSetValue = vi.fn();
  const mockGetValues = vi.fn();
  const mockRegister = vi.fn();
  const { result: useFormResult } = renderHook(() =>
    useForm<PromptForm>({
      resolver: zodResolver(promptSchema),
      defaultValues: { params: [], messages: [] },
    })
  );

  beforeEach(() => {
    vi.resetAllMocks();
    v4Mock.mockReturnValue("test-uuid");
  });

  const renderComponent = () => {
    return render(
      <MessagesForm
        register={mockRegister}
        errors={mockErrors}
        setValue={mockSetValue}
        control={useFormResult.current.control}
        getValues={mockGetValues}
      />
    );
  };

  it("renders without crashing", () => {
    usePromptsMock.mockReturnValue({
      deletePromptMessage: vi.fn(),
    });
    renderComponent();
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("No messages added.")).toBeInTheDocument();
  });

  it("appends a new message when the add message button is clicked", async () => {
    usePromptsMock.mockReturnValue({
      deletePromptMessage: vi.fn(),
    });
    const append = vi.fn();
    useFieldArrayMock.mockReturnValue({
      fields: [],
      append,
      remove: vi.fn(),
    });
    renderComponent();
    const addButton = screen.getByRole("button", { name: /Add message/i });
    expect(addButton).toBeInTheDocument();
    await userEvent.click(addButton);
    expect(append).toHaveBeenCalledWith({
      id: "test-uuid-default",
      role: "User",
      content: "",
    });
  });

  it("renders existing messages", () => {
    usePromptsMock.mockReturnValue({
      deletePromptMessage: vi.fn(),
    });
    useFieldArrayMock.mockReturnValue({
      fields: [{ id: "1", role: "User", content: "Test Message" }],
      append: vi.fn(),
      remove: vi.fn(),
    });
    renderComponent();
    const combobox = screen.getByRole("combobox", {
      name: /role/i,
    });
    expect(combobox).toBeInTheDocument();
    expect(mockRegister).toHaveBeenCalled();
    expect(screen.queryByText("No messages added.")).not.toBeInTheDocument();
  });

  describe("Removing messages", () => {
    it("opens the confirmation dialog when remove button is clicked for a message with an id", async () => {
      usePromptsMock.mockReturnValue({
        deletePromptMessage: vi.fn(),
      });
      useFieldArrayMock.mockReturnValue({
        fields: [{ id: "123", role: "User", content: "Test Message" }],
        append: vi.fn(),
        remove: vi.fn(),
      });
      mockGetValues.mockReturnValue([
        { id: "123", role: "User", content: "Test Message" },
      ]);
      renderComponent();
      const removeButton = screen.getByRole("button", {
        name: /delete message/i,
      });
      await userEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.getByTestId("confirm-dialog")).toBeVisible();
      });
    });

    it("removes the message immediately if it's a default message (newly added)", async () => {
      const removeMock = vi.fn();
      usePromptsMock.mockReturnValue({
        deletePromptMessage: vi.fn(),
      });
      useFieldArrayMock.mockReturnValue({
        fields: [
          { id: "test-uuid-default", role: "User", content: "Test Message" },
        ],
        append: vi.fn(),
        remove: removeMock,
      });
      mockGetValues.mockReturnValue([
        { id: "test-uuid-default", role: "User", content: "Test Message" },
      ]);

      renderComponent();
      const removeButton = screen.getByRole("button", {
        name: /delete message/i,
      });
      await userEvent.click(removeButton);

      expect(removeMock).toHaveBeenCalledWith(0);
    });

    it("calls deletePromptMessage and removes the message on confirm", async () => {
      const removeMock = vi.fn();
      useFieldArrayMock.mockReturnValue({
        fields: [{ id: "123", role: "User", content: "Test Message" }],
        append: vi.fn(),
        remove: removeMock,
      });
      mockGetValues.mockReturnValue([
        { id: "123", role: "User", content: "Test Message" },
      ]);
      useParamsMock.mockReturnValue({ id: "test-prompt-id" });
      const deletePromptMessage = vi.fn();
      usePromptsMock.mockReturnValue({
        deletePromptMessage,
      });
      renderComponent();
      const removeButton = screen.getByRole("button", {
        name: /delete message/i,
      });
      await userEvent.click(removeButton);

      await waitFor(async () => {
        expect(screen.getByTestId("confirm-dialog")).toBeVisible();
      });
      const confirmButton = screen.getByTestId("confirm-button");
      expect(confirmButton).toBeInTheDocument();
      await userEvent.click(confirmButton);
      expect(mockGetValues).toHaveBeenCalledWith("messages");
      expect(removeMock).toHaveBeenCalled();
      expect(deletePromptMessage).toHaveBeenCalledWith("test-prompt-id", "123");
    });

    it("closes the dialog and does not delete the message on cancel", async () => {
      const removeMock = vi.fn();
      useFieldArrayMock.mockReturnValue({
        fields: [{ id: "123", role: "User", content: "Test Message" }],
        append: vi.fn(),
        remove: removeMock,
      });
      mockGetValues.mockReturnValue([
        { id: "123", role: "User", content: "Test Message" },
      ]);

      renderComponent();
      const removeButton = screen.getByRole("button", {
        name: /delete message/i,
      });
      await userEvent.click(removeButton);

      const cancelButton = screen.getByTestId("cancel-button");
      await userEvent.click(cancelButton);

      expect(usePromptsMock).not.toHaveBeenCalled();
      expect(removeMock).not.toHaveBeenCalled();
    });
  });

  it("displays field-level errors for messages", () => {
    useFieldArrayMock.mockReturnValue({
      fields: [{ id: "1", role: "User", content: "Test Message" }],
      append: vi.fn(),
      remove: vi.fn(),
    });
    mockErrors = {
      messages: [
        {
          content: {
            message: "Content is required",
          },
        },
      ],
    };
    renderComponent();
    expect(
      screen.getByText("Message 1 content: Content is required")
    ).toBeInTheDocument();
  });

  it("registers the role and content fields", () => {
    renderComponent();
    expect(mockRegister).toHaveBeenCalledWith("messages.0.role");
    expect(mockRegister).toHaveBeenCalledWith("messages.0.content");
  });

  it("updates the role when the select value changes", async () => {
    useFieldArrayMock.mockReturnValue({
      fields: [{ id: "1", role: "User", content: "Test Message" }],
      append: vi.fn(),
      remove: vi.fn(),
    });
    renderComponent();
    const selectElement = screen.getByRole("combobox");
    userEvent.selectOptions(selectElement, "Assistant");
    expect(selectElement).toHaveValue("Assistant");
  });

  it("updates the content when the textarea value changes", async () => {
    useFieldArrayMock.mockReturnValue({
      fields: [{ id: "1", role: "User", content: "Test Message" }],
      append: vi.fn(),
      remove: vi.fn(),
    });
    renderComponent();
    const textareaElement = screen.getByPlaceholderText("Message content");
    await userEvent.type(textareaElement, "New Content");
    expect(textareaElement).toHaveValue("New Content");
  });
});
