import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  const defaultProps = {
    message: "Are you sure?",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    isOpen: true,
  };

  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  })

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders dialog with string message", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("renders dialog with array message", () => {
    const messages = ["Line 1", "Line 2"];
    render(<ConfirmDialog {...defaultProps} message={messages} />);
    messages.forEach(msg => {
      expect(screen.getByText(msg)).toBeInTheDocument();
    });
  });

  it("calls onConfirm when Confirm is clicked", () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByText("Confirm"));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when Cancel is clicked", () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});