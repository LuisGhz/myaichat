import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChatConfigModal } from "./ChatConfigModal";
import { ReactNode } from "react";

// Mock the antd Modal to avoid portal rendering issues in tests
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    Modal: ({ 
      children, 
      title, 
      open, 
      onCancel, 
      className 
    }: {
      children: ReactNode;
      title: string;
      open: boolean;
      onCancel: () => void;
      className: string;
    }) => (
      <div data-testid="modal" data-modal-open={open} className={className}>
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-content">{children}</div>
        <button onClick={onCancel} data-testid="modal-close">
          Close
        </button>
      </div>
    ),
    Input: ({ id, ...props }: { id?: string; [key: string]: unknown }) => (
      <input id={id} {...props} />
    ),
    Tooltip: ({ children, title }: { children: ReactNode; title: string }) => (
      <div data-testid="tooltip" title={title}>
        {children}
      </div>
    ),
  };
});

// Mock the useFormat hook
vi.mock("core/hooks/useFormat", () => ({
  useFormat: () => ({
    fNumber: (n: number) => new Intl.NumberFormat().format(n),
  }),
}));

// Mock the FeatureCheckbox component
vi.mock("../components/FeatureCheckbox", () => ({
  FeatureCheckbox: ({
    isActive,
    onToggle,
    id,
    labelText,
    featureDescription,
  }: {
    isActive: boolean;
    onToggle: (isActive: boolean) => void;
    id: string;
    labelText: string;
    featureDescription: string;
  }) => (
    <div data-testid="feature-checkbox">
      <label htmlFor={id}>{labelText}</label>
      <input
        type="checkbox"
        id={id}
        checked={isActive}
        onChange={(e) => onToggle(e.target.checked)}
        aria-describedby={`${id}-description`}
      />
      <div id={`${id}-description`}>{featureDescription}</div>
    </div>
  ),
}));

// Mock the ExclamationCircleIcon
vi.mock("icons/ExclamationCircleIcon", () => ({
  ExclamationCircleIcon: ({ 
    className, 
    ...props 
  }: {
    className?: string;
    [key: string]: unknown;
  }) => (
    <span className={className} {...props} data-testid="info-icon">
      ⓘ
    </span>
  ),
}));

describe("ChatConfigModal", () => {
  const defaultProps = {
    onClose: vi.fn(),
    currentMaxOutputTokens: 4000,
    currentIsWebSearchMode: false,
  };

  const renderComponent = (props = {}) => {
    const combinedProps = { ...defaultProps, ...props };
    return render(<ChatConfigModal {...combinedProps} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Max Output Tokens Input", () => {
    it("should render max output tokens input with current value", () => {
      renderComponent({ currentMaxOutputTokens: 5000 });
      
      const input = screen.getByDisplayValue("5000");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("id", "max-tokens");
      expect(input).toHaveAttribute("type", "number");
      expect(input).toHaveAttribute("min", "1000");
      expect(input).toHaveAttribute("max", "8000");
      expect(input).toHaveAttribute("placeholder", "Type max tokens");
    });
  
    it("should have proper accessibility attributes", () => {
      renderComponent();
      
      const input = screen.getByDisplayValue("4000");
      expect(input).toHaveAttribute("id", "max-tokens");
      expect(input).toHaveAttribute("aria-describedby", "max-tokens-help");
      
      const helpText = screen.getByText(/the maximum number of tokens the model can generate/i);
      expect(helpText).toHaveAttribute("id", "max-tokens-help");
      expect(helpText).toHaveClass("sr-only");
    });

    it("should handle non-numeric input gracefully", async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const input = screen.getByDisplayValue("4000");
      await user.clear(input);
      await user.type(input, "abc");
      
      // Non-numeric input should result in empty value being handled as 0
      expect(input).toHaveValue(0);
    });
  });

  describe("Web Search Mode Feature", () => {
    it("should render web search mode checkbox with current state", () => {
      renderComponent({ currentIsWebSearchMode: true });
      
      const checkbox = screen.getByRole("checkbox", { name: /web search mode/i });
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeChecked();
    });

    it("should render web search mode checkbox as unchecked by default and change it to checked", () => {
      renderComponent({ currentIsWebSearchMode: false });
      
      const checkbox = screen.getByRole("checkbox", { name: /web search mode/i });
      expect(checkbox).not.toBeChecked();

      checkbox.click();
      expect(checkbox).toBeChecked();
    });

    it("should display feature description", () => {
      renderComponent();
      
      const description = screen.getByText(/enable this to allow the model to perform web searches/i);
      expect(description).toBeInTheDocument();
    });
  });

  describe("Modal Interactions", () => {
    it("should call onClose with current values when modal is cancelled", async () => {
      const onCloseMock = vi.fn();
      renderComponent({ 
        onClose: onCloseMock,
        currentMaxOutputTokens: 3000,
        currentIsWebSearchMode: true 
      });
      
      const closeButton = screen.getByTestId("modal-close");
      await userEvent.click(closeButton);
      
      expect(onCloseMock).toHaveBeenCalledWith({
        maxOutputTokens: 3000,
        isWebSearchMode: true,
      });
    });

    it("should call onClose with updated values after user interaction", async () => {
      const user = userEvent.setup();
      const onCloseMock = vi.fn();
      renderComponent({ 
        onClose: onCloseMock,
        currentMaxOutputTokens: 4000,
        currentIsWebSearchMode: false 
      });
      
      // Update max tokens
      const input = screen.getByDisplayValue("4000");
      await user.clear(input);
      await user.type(input, "7000");
      
      // Toggle web search mode
      const checkbox = screen.getByRole("checkbox", { name: /web search mode/i });
      await user.click(checkbox);
      
      // Close modal
      const closeButton = screen.getByTestId("modal-close");
      await userEvent.click(closeButton);
      
      expect(onCloseMock).toHaveBeenCalledWith({
        maxOutputTokens: 7000,
        isWebSearchMode: true,
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle minimum token value", async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const input = screen.getByDisplayValue("4000");
      await user.clear(input);
      await user.type(input, "0");
      await user.tab();
      expect(input).toHaveValue(0);
      expect(await screen.findByText(/Must be at least 1,000/i)).toBeInTheDocument();
    });

    it("should handle decimal values", async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const input = screen.getByDisplayValue("4000");
      await user.clear(input);
      await user.type(input, "4000.5");
      
      // userEvent interactions wrap updates in act; use keyboard navigation to
      // move focus away which triggers the onBlur handler in the component.
      expect(input).toHaveValue(40005);
      await user.tab(); // move focus away from the input to trigger onBlur

      // assert validation message appears
      expect(await screen.findByText(/Must be at most 8,000/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels and descriptions", () => {
      renderComponent();
      
      // Check max tokens input accessibility
      const input = screen.getByDisplayValue("4000");
      expect(input).toHaveAttribute("aria-describedby", "max-tokens-help");
      
      // Check info icon accessibility
      const infoIcon = screen.getByTestId("info-icon");
      expect(infoIcon).toBeInTheDocument();
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      renderComponent();
      
      // Tab to max tokens input
      await user.tab();
      const input = screen.getByDisplayValue("4000");
      expect(input).toHaveFocus();
      
      // Tab to web search checkbox
      await user.tab();
      const checkbox = screen.getByRole("checkbox", { name: /web search mode/i });
      expect(checkbox).toHaveFocus();
    });

    it("should support keyboard interaction on close", async () => {
      const user = userEvent.setup();
      const onCloseMock = vi.fn();
      renderComponent({ onClose: onCloseMock });
      
      const closeButton = screen.getByTestId("modal-close");
      closeButton.focus();
      await user.keyboard("{Enter}");
      
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
