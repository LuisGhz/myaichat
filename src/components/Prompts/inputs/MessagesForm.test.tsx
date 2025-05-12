/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { v4 } from "uuid";
import { usePrompts } from "hooks/usePrompts";
import { MessagesForm } from "./MessagesForm";

// Mock necessary dependencies
vi.mock("react-hook-form", () => {
  return {
    useFieldArray: vi.fn(),
    UseFormRegister: vi.fn(),
    FieldErrors: vi.fn(),
    UseFormSetValue: vi.fn(),
    Control: vi.fn(),
    UseFormGetValues: vi.fn(),
  };
});

vi.mock("uuid", () => {
  return {
    v4: vi.fn().mockReturnValue("test-uuid"),
  };
});

vi.mock("react", () => {
  return {
    ...vi.importActual("react"),
    useState: vi.fn(),
  };
})

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

vi.mock("hooks/usePrompts", () => ({
  usePrompts: vi.fn(),
}));

vi.mock("react-router", () => ({
  useParams: vi.fn(),
}));

vi.mock("assets/icons/PlusIcon", () => ({
  PlusIcon: () => <div>PlusIcon</div>,
}));

describe("MessagesForm Component", () => {
  let mockRegister: any;
  let mockErrors: any;
  let mockSetValue: any;
  let mockControl: any;
  let mockGetValues: any;
  let mockUseFieldArray: any;
  let mockUsePromptsHook: any;
  let mockForm: any;

  beforeEach(() => {
    // Mock react-hook-form functions
    mockForm = {
      register: vi.fn(),
      handleSubmit: vi.fn(),
      setValue: vi.fn(),
      getValues: vi.fn(),
      control: {},
      formState: { errors: {} },
      reset: vi.fn(),
      watch: vi.fn(),
      clearErrors: vi.fn(),
      unregister: vi.fn(),
      setError: vi.fn(),
      trigger: vi.fn(),
    };
    mockRegister = mockForm.register;
    mockSetValue = mockForm.setValue;
    mockControl = mockForm.control;
    mockGetValues = mockForm.getValues;
    mockErrors = mockForm.formState.errors;

    // Mock useFieldArray hook
    mockUseFieldArray = vi.fn().mockReturnValue({
      fields: [],
      append: vi.fn(),
      remove: vi.fn(),
    });

    // Mock usePrompts hook
    mockUsePromptsHook = {
      deletePromptMessage: vi.fn(),
    };
    (usePrompts as any).mockReturnValue(mockUsePromptsHook);

    // Mock uuid
    (v4 as any).mockReturnValue("test-uuid");
  });

  const renderComponent = () => {
    return render(
      <MessagesForm
        register={mockRegister}
        errors={mockErrors}
        setValue={mockSetValue}
        control={mockControl}
        getValues={mockGetValues}
      />
    );
  };

  it("renders without crashing", () => {
    renderComponent();
    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  it("displays 'No messages added' when there are no messages", () => {
    renderComponent();
    expect(screen.getByText("No messages added.")).toBeInTheDocument();
  });

  it("appends a new message when the add message button is clicked", async () => {
    const { append } = mockUseFieldArray();
    renderComponent();
    const addButton = screen.getByRole("button", { name: /plusicon/i });
    await userEvent.click(addButton);
    expect(append).toHaveBeenCalledWith({
      id: "test-uuid-default",
      role: "User",
      content: "",
    });
  });

  it("renders existing messages", () => {
    mockUseFieldArray.mockReturnValue({
      fields: [{ id: "1", role: "User", content: "Test Message" }],
      append: vi.fn(),
      remove: vi.fn(),
    });
    renderComponent();
    expect(screen.getByText("Test Message")).toBeInTheDocument();
  });

  describe("Removing messages", () => {
    it("opens the confirmation dialog when remove button is clicked for a message with an id", async () => {
      mockUseFieldArray.mockReturnValue({
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
      mockUseFieldArray.mockReturnValue({
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
      mockUseFieldArray.mockReturnValue({
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

      const confirmButton = screen.getByTestId("confirm-button");
      await userEvent.click(confirmButton);

      expect(mockUsePromptsHook.deletePromptMessage).toHaveBeenCalledWith(
        "test-prompt-id",
        "123"
      );
      expect(removeMock).toHaveBeenCalledWith(0);
    });

    it("closes the dialog and does not delete the message on cancel", async () => {
      const removeMock = vi.fn();
      mockUseFieldArray.mockReturnValue({
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

      expect(mockUsePromptsHook.deletePromptMessage).not.toHaveBeenCalled();
      expect(removeMock).not.toHaveBeenCalled();
    });
  });

  it("displays field-level errors for messages", () => {
    mockUseFieldArray.mockReturnValue({
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
    mockUseFieldArray.mockReturnValue({
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
    mockUseFieldArray.mockReturnValue({
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
