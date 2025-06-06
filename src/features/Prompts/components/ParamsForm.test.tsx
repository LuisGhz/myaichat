/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  renderHook,
} from "@testing-library/react";
import { ParamsForm } from "./ParamsForm";
import { PromptForm, promptSchema } from "../PromptSchema";
import { useForm, useFieldArray } from "react-hook-form";
import { v4 } from "uuid";
import { usePrompts } from "hooks/usePrompts";
import { useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

vi.mock("uuid");
vi.mock("hooks/usePrompts");
vi.mock("react-router");
vi.mock("react-hook-form", async () => {
  const actual = (await vi.importActual("react-hook-form")) as any;
  return {
    ...actual,
    useFieldArray: vi.fn(),
  };
});

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
  XMarkIcon: () => <div data-testid="x-mark-icon" />,
}));

vi.mock("assets/icons/PlusIcon", () => ({
  PlusIcon: () => <div data-testid="plus-icon" />,
}));

describe("ParamsForm", () => {
  const mockV4 = v4 as unknown as Mock<any>;
  const mockDeletePromptParam = vi.fn();
  const mockUsePrompts = usePrompts as unknown as Mock<any>;
  const mockUseParams = useParams as unknown as Mock<any>;
  const mockUseFieldArray = useFieldArray as unknown as Mock<any>;
  const mockRegister = vi.fn();
  const mockGetValues = vi.fn();
  const mockAppend = vi.fn();
  const mockRemove = vi.fn();
  let mockErrors: any = [];
  mockV4.mockReturnValue("mock-uuid");
  mockUsePrompts.mockReturnValue({
    deletePromptParam: mockDeletePromptParam,
  });
  mockUseParams.mockReturnValue({ id: "mock-prompt-id" });
  const { result: useFormResult } = renderHook(() =>
    useForm<PromptForm>({
      resolver: zodResolver(promptSchema),
      defaultValues: { params: [], messages: [] },
    })
  );

  const mockuseFieldArrayForTest = (fields: any) => {
    mockUseFieldArray.mockReturnValue({
      fields,
      append: mockAppend,
      remove: mockRemove,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockuseFieldArrayForTest([]);
  });

  const renderComponent = () => {
    render(
      <ParamsForm
        register={mockRegister}
        errors={mockErrors}
        control={useFormResult.current.control}
        getValues={mockGetValues}
      />
    );
  };

  it("should render correctly with no params", () => {
    renderComponent();
    expect(screen.getByText("Params")).toBeInTheDocument();
    expect(screen.getByText("No params added.")).toBeInTheDocument();
    expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
  });

  it("should render correctly with existing params", () => {
    const mockFieldsData = [
      { id: "id1", name: "param1", value: "value1" },
      { id: "id2", name: "param2", value: "value2" },
    ];
    mockuseFieldArrayForTest(mockFieldsData);
    renderComponent();

    expect(screen.getAllByPlaceholderText("Param name")).toHaveLength(2);
    expect(screen.getAllByPlaceholderText("Default value")).toHaveLength(2);
    expect(
      screen.getAllByRole("button", { name: "Delete param" })
    ).toHaveLength(2);

    expect(mockRegister).toHaveBeenCalledWith("params.0.name");
    expect(mockRegister).toHaveBeenCalledWith("params.0.value");
    expect(mockRegister).toHaveBeenCalledWith("params.1.name");
    expect(mockRegister).toHaveBeenCalledWith("params.1.value");
  });

  it("should call append when add param button is clicked", () => {
    mockuseFieldArrayForTest([]);
    renderComponent();

    const plusIconButton = screen.getByTestId("plus-icon").closest("button");
    expect(plusIconButton).toBeInTheDocument();
    if (plusIconButton) {
      fireEvent.click(plusIconButton);
    }

    expect(mockAppend).toHaveBeenCalledWith({
      id: "mock-uuid-default",
      name: "",
      value: "",
    });
  });

  describe("handleRemoveParam", () => {
    const paramIndex = 0;
    const paramIdDefault = "mock-uuid-default";
    const paramIdExisting = "mock-uuid";

    it('should call remove directly for a new param (id includes "-default")', async () => {
      const fieldsData = [{ id: paramIdDefault, name: "p1", value: "v1" }];
      mockuseFieldArrayForTest(fieldsData);
      mockGetValues.mockImplementation((name: string) => {
        if (name === "params") {
          return [{ id: paramIdDefault, name: "p1", value: "v1" }];
        }
        return undefined;
      });

      renderComponent();
      fireEvent.click(screen.getByRole("button", { name: "Delete param" }));

      await waitFor(() => {
        expect(mockRemove).toHaveBeenCalledWith(paramIndex);
        expect(mockDeletePromptParam).not.toHaveBeenCalled();
        expect(screen.queryByTestId("confirm-dialog")).not.toBeInTheDocument();
        expect(mockDeletePromptParam).not.toHaveBeenCalled();
      });
    });

    it("should call deletePromptParam and remove when confirm dialog is confirmed", async () => {
      const fieldsData = [{ id: paramIdExisting, name: "p1", value: "v1" }];
      mockUseFieldArray.mockReturnValue({
        fields: fieldsData,
        append: mockAppend,
        remove: mockRemove,
      });
      mockGetValues.mockReturnValue([
        { id: paramIdExisting, name: "p1", value: "v1" },
      ]);

      renderComponent();
      fireEvent.click(screen.getByRole("button", { name: "Delete param" }));

      await waitFor(() => {
        expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId("confirm-button"));

      await waitFor(() => {
        expect(mockDeletePromptParam).toHaveBeenCalled();
        expect(mockRemove).toHaveBeenCalled();
      });
    });

    it("should not call deletePromptParam or remove when confirm dialog is cancelled", async () => {
      const fieldsData = [{ id: paramIdExisting, name: "p1", value: "v1" }];
      mockuseFieldArrayForTest(fieldsData);
      mockGetValues.mockReturnValue([
        { id: paramIdExisting, name: "p1", value: "v1" },
      ]);

      renderComponent();
      fireEvent.click(screen.getByRole("button", { name: "Delete param" }));

      await waitFor(() => {
        expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId("cancel-button"));

      await waitFor(() => {
        expect(mockDeletePromptParam).not.toHaveBeenCalled();
        expect(mockRemove).not.toHaveBeenCalled();
      });
    });
  });

  it("should display field array errors correctly", () => {
    mockErrors = {
      params: [
        { name: { message: "Name error 1" } },
        { value: { message: "Value error 2" } },
        {
          name: { message: "Name error 3" },
          value: { message: "Value error 3" },
        },
      ],
    };

    const fieldsData = [
      { id: "uuid-1", name: "p1", value: "v1" },
      { id: "uuid-2", name: "p2", value: "v2" },
    ];
    mockuseFieldArrayForTest(fieldsData);

    renderComponent();

    expect(screen.getByText("Param 1 name: Name error 1")).toBeInTheDocument();
    expect(
      screen.getByText("Param 2 value: Value error 2")
    ).toBeInTheDocument();
    expect(screen.getByText("Param 3 name: Name error 3")).toBeInTheDocument();
    expect(
      screen.getByText("Param 3 value: Value error 3")
    ).toBeInTheDocument();
  });

  it("should display root errors for params correctly", () => {
    mockErrors = {
      params: {
        root: { message: "Root error for params" },
      },
    };
    mockuseFieldArrayForTest([]);
    renderComponent();
    expect(screen.getByText("Root error for params")).toBeInTheDocument();
  });
});
