/* eslint-disable @typescript-eslint/no-explicit-any */

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
  const Tooltip = ({ title, children }: { title: string; children: any }) => (
    <div data-tooltip-title={title}>{children}</div>
  );
  return {
    ...antd,
    Tooltip,
  };
});

// Mock FeatureCheckbox to test its integration
vi.mock("./components/FeatureCheckbox", () => ({
  FeatureCheckbox: ({ isActive, onToggle, id, featureDescription, labelText }: any) => (
    <div>
      <label htmlFor={id}>{labelText}</label>
      <input
        id={id}
        type="checkbox"
        checked={isActive}
        onChange={() => onToggle(!isActive)}
        aria-describedby={`${id}-help`}
      />
      <div id={`${id}-help`} className="sr-only">{featureDescription}</div>
    </div>
  ),
}));

describe("ChatConfigModal", () => {
  const mockOnClose = vi.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    currentMaxOutputTokens: 4096,
    currentIsWebSearchMode: false,
  };

  // Helper to render the component
  const renderComponent = (props = {}) =>
    render(<ChatConfigModal {...defaultProps} {...props} />);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders modal with initial values when open", () => {
    renderComponent();
    expect(screen.getByText("Chat Configuration")).toBeInTheDocument();
    expect(screen.getByLabelText("Max Output Tokens")).toBeInTheDocument();
    expect(screen.getByLabelText("Max Output Tokens")).toHaveValue(defaultProps.currentMaxOutputTokens);
    expect(screen.getByLabelText("Web Search Mode")).not.toBeChecked();
  });

  it("updates max tokens value when user types in the input", () => {
    renderComponent();
    const input = screen.getByLabelText("Max Output Tokens");
    fireEvent.change(input, { target: { value: "2048" } });
    expect(input).toHaveValue(2048);
  });

  it("calls onClose with updated values when modal is cancelled", () => {
    renderComponent();
    const input = screen.getByLabelText("Max Output Tokens");
    fireEvent.change(input, { target: { value: "3000" } });
    const webSearchCheckbox = screen.getByLabelText("Web Search Mode");
    fireEvent.click(webSearchCheckbox); // toggle to true
    // Simulate modal cancel (close)
    fireEvent.click(screen.getByRole("dialog").querySelector(".ant-modal-close") || screen.getByText("Chat Configuration"));
    expect(mockOnClose).toHaveBeenCalledWith({ maxOutputTokens: 3000, isWebSearchMode: true });
  });

  it("does not update internal state if props change while open", () => {
    const { rerender } = render(<ChatConfigModal {...defaultProps} />);
    const input = screen.getByLabelText("Max Output Tokens");
    expect(input).toHaveValue(defaultProps.currentMaxOutputTokens);
    rerender(<ChatConfigModal {...defaultProps} currentMaxOutputTokens={2000} />);
    // Should not update because state is not synced after mount
    expect(input).toHaveValue(defaultProps.currentMaxOutputTokens);
  });

  it("has correct accessibility attributes for inputs", () => {
    renderComponent();
    const maxTokensInput = screen.getByLabelText("Max Output Tokens");
    const webSearchInput = screen.getByLabelText("Web Search Mode");
    expect(maxTokensInput).toHaveAttribute("aria-describedby", "max-tokens-help");
    expect(webSearchInput).toHaveAttribute("aria-describedby", "web-search-mode-help");
  });

  it("sets min and max attributes on the number input", () => {
    renderComponent();
    const input = screen.getByLabelText("Max Output Tokens");
    expect(input).toHaveAttribute("min", "1000");
    expect(input).toHaveAttribute("max", "8000");
  });

  it("displays correct tooltip for max tokens", () => {
    renderComponent();
    const infoIcon = screen.getByLabelText("Information about max output tokens");
    const tooltipDiv = infoIcon.parentElement;
    expect(tooltipDiv).toHaveAttribute(
      "data-tooltip-title",
      "The maximum number of tokens the model can generate in a single response. min: 1,000, max: 8,000"
    );
  });
});
