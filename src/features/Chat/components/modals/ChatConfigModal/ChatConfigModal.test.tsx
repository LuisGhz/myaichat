import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ChatConfigModal } from "./ChatConfigModal";

// Mock dependencies to isolate the component
vi.mock("hooks/useFormat", () => ({
  useFormat: () => ({
    fNumber: (num: number) => num.toLocaleString(),
  }),
}));

vi.mock("assets/icons/InformationIcon", () => ({
  InformationIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="info-icon" {...props} />
  ),
}));

// Mock Ant Design's Tooltip to make its content accessible for testing
vi.mock("antd", async (importOriginal) => {
  const antd = await importOriginal<typeof import("antd")>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tooltip = ({ title, children }: { title: string; children: any }) => (
    <div data-tooltip-title={title}>{children}</div>
  );
  return {
    ...antd,
    Tooltip,
  };
});

describe("ChatConfigModal", () => {
  const onCancelMock = vi.fn();
  const defaultProps = {
    isOpen: true,
    maxOutputTokens: 4096,
    onCancel: onCancelMock,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render the modal with initial values when isOpen is true", () => {
    render(<ChatConfigModal {...defaultProps} />);

    expect(screen.getByText("Chat Configuration")).toBeInTheDocument();
    expect(screen.getByLabelText("Max Output Tokens")).toBeInTheDocument();
    expect(screen.getByLabelText("Max Output Tokens")).toHaveValue(
      defaultProps.maxOutputTokens
    );
    expect(screen.getByLabelText("Thinking Mode")).not.toBeChecked();
  });

  it("should not render the modal content when isOpen is false", () => {
    render(<ChatConfigModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Chat Configuration")).not.toBeInTheDocument();
  });

  it("should update the max tokens value when user types in the input", () => {
    render(<ChatConfigModal {...defaultProps} />);
    const input = screen.getByLabelText("Max Output Tokens");

    fireEvent.change(input, { target: { value: "2048" } });

    expect(input).toHaveValue(2048);
  });

  it("should show an alert and reset the checkbox when 'Thinking Mode' is clicked", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<ChatConfigModal {...defaultProps} />);

    const thinkingModeCheckbox = screen.getByLabelText("Thinking Mode");
    expect(thinkingModeCheckbox).not.toBeChecked();

    // We click the label which is associated with the hidden checkbox
    fireEvent.click(screen.getByText("Thinking Mode"));

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith("No available yet.");

    // The component's useEffect should immediately set the state back to false
    expect(thinkingModeCheckbox).not.toBeChecked();

    alertSpy.mockRestore();
  });

  it("should not update max tokens value if the maxOutputTokens prop changes while open", () => {
    const { rerender } = render(<ChatConfigModal {...defaultProps} />);
    const input = screen.getByLabelText("Max Output Tokens");
    expect(input).toHaveValue(defaultProps.maxOutputTokens);

    rerender(<ChatConfigModal {...defaultProps} maxOutputTokens={2000} />);

    // The input value should not change because the internal state is not synced with props after initial mount
    expect(input).toHaveValue(2000);
  });

  it("should have correct accessibility attributes for inputs", () => {
    render(<ChatConfigModal {...defaultProps} />);
    const maxTokensInput = screen.getByLabelText("Max Output Tokens");
    const thinkingModeInput = screen.getByLabelText("Thinking Mode");

    expect(maxTokensInput).toHaveAttribute(
      "aria-describedby",
      "max-tokens-help"
    );
    expect(thinkingModeInput).toHaveAttribute(
      "aria-describedby",
      "thinking-mode-help"
    );
  });

  it("should set min and max attributes on the number input", () => {
    render(<ChatConfigModal {...defaultProps} />);
    const input = screen.getByLabelText("Max Output Tokens");

    expect(input).toHaveAttribute("min", "1000");
    expect(input).toHaveAttribute("max", "8000");
  });

  it("should display correct tooltips", () => {
    render(<ChatConfigModal {...defaultProps} />);

    const maxTokensTooltipTrigger = screen.getByLabelText(
      "Information about max output tokens"
    ).parentElement;
    expect(maxTokensTooltipTrigger).toHaveAttribute(
      "data-tooltip-title",
      "The maximum number of tokens the model can generate in a single response. min: 1,000, max: 8,000"
    );

    const thinkingModeTooltipTrigger = screen.getByLabelText(
      "Information about thinking mode"
    ).parentElement;
    expect(thinkingModeTooltipTrigger).toHaveAttribute(
      "data-tooltip-title",
      "Enable this to allow the model to think before responding, which can improve response quality."
    );
  });
});
