import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CurrentModelSummary } from "./CurrentModelSummary";

// Mock the MODELS constant
vi.mock("consts/Models", () => ({
  MODELS: [
    {
      value: "test-model",
      shortName: "Test",
      price: { input: 0.001, output: 0.002 },
    },
    {
      value: "another-model",
      shortName: "Another",
      price: { input: 0.1, output: 0.4 },
    },
  ],
}));

describe("CurrentModelSummary", () => {
  it("should render the component with correct values", () => {
    render(
      <CurrentModelSummary
        currentModel="test-model"
        totalPromptTokens={100000}
        totalCompletionTokens={200000}
      />
    );

    expect(screen.getByText(/Test -/)).toBeInTheDocument();
    expect(screen.getByText(/PT:100,000 - \$0.00/)).toBeInTheDocument();
    expect(screen.getByText(/CT:200,000 - \$0.00/)).toBeInTheDocument();
  });

  it("should render 0 values when tokens are not provided", () => {
    render(<CurrentModelSummary currentModel="test-model" />);

    expect(screen.getByText(/Test -/)).toBeInTheDocument();
    expect(screen.getByText(/PT:0 - \$0.00/)).toBeInTheDocument();
    expect(screen.getByText(/CT:0 - \$0.00/)).toBeInTheDocument();
  });

  it("should render correct values for another model", () => {
    render(
      <CurrentModelSummary
        currentModel="another-model"
        totalPromptTokens={1_000_000}
        totalCompletionTokens={1_000_000}
      />
    );

    expect(screen.getByText(/Another -/)).toBeInTheDocument();
    expect(screen.getByText(/PT:1,000,000 - \$0.10/)).toBeInTheDocument();
    expect(screen.getByText(/CT:1,000,000 - \$0.40/)).toBeInTheDocument();
  });

  it("should handle cases where totalPromptTokens or totalCompletionTokens are zero", () => {
    render(
      <CurrentModelSummary
        currentModel="test-model"
        totalPromptTokens={0}
        totalCompletionTokens={0}
      />
    );

    expect(screen.getByText(/Test -/)).toBeInTheDocument();
    expect(screen.getByText(/PT:0 - \$0.00/)).toBeInTheDocument();
    expect(screen.getByText(/CT:0 - \$0.00/)).toBeInTheDocument();
  });

  it("should handle cases where totalPromptTokens or totalCompletionTokens are undefined", () => {
    const r = render(
      <CurrentModelSummary
        currentModel="test-model"
        totalCompletionTokens={100000}
      />
    );

    expect(screen.getByText(/Test -/)).toBeInTheDocument();
    expect(screen.getByText(/PT:0 - \$0.00/)).toBeInTheDocument();
    expect(screen.getByText(/CT:100,000 - \$0.00/)).toBeInTheDocument();
    
    r.rerender(
      <CurrentModelSummary
      currentModel="test-model"
      totalPromptTokens={100000}
      />
    )
    expect(screen.getByText(/Test -/)).toBeInTheDocument();
    expect(screen.getByText(/PT:100,000 - \$0.00/)).toBeInTheDocument();
    expect(screen.getByText(/CT:0 - \$0.00/)).toBeInTheDocument();
  });
});
