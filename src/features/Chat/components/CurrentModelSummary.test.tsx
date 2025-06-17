import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CurrentModelSummary } from "./CurrentModelSummary";

// Mock the MODELS constant
vi.mock("consts/Models", () => ({
  MODELS: [
    {
      value: "model",
      shortName: "Test",
      price: { input: 0.001, output: 0.002 },
    },
    {
      value: "anothermodel",
      shortName: "Another",
      price: { input: 0.1, output: 0.4 },
    },
  ],
}));

// Mock the hooks
vi.mock("store/features/chat/useCurrentChatStore", () => ({
  useCurrentChatStoreGetCurrentModelData: vi.fn(),
}));

vi.mock("hooks/useFormat", () => ({
  useFormat: vi.fn(),
}));

import { useCurrentChatStoreGetCurrentModelData } from "store/features/chat/useCurrentChatStore";
import { useFormat } from "hooks/useFormat";

const mockUseCurrentChatStoreGetCurrentModelData = vi.mocked(
  useCurrentChatStoreGetCurrentModelData
);
const mockUseFormat = vi.mocked(useFormat);

describe("CurrentModelSummary", () => {
  beforeEach(() => {
    mockUseFormat.mockReturnValue({
      fNumber: (num: number) => num.toLocaleString(),
      fCurrency: (num: number) => `$${num.toFixed(2)}`
    });
  });

  it("should render the component with correct values", () => {
    mockUseCurrentChatStoreGetCurrentModelData.mockReturnValue({
      model: "model",
      totalPromptTokens: 100000,
      totalCompletionTokens: 200000,
    });

    render(<CurrentModelSummary />);

    expect(screen.getByText(/Test/)).toBeInTheDocument();
    expect(screen.getByText(/PT:100,000 - \$0.00/)).toBeInTheDocument();
    expect(screen.getByText(/CT:200,000 - \$0.00/)).toBeInTheDocument();
  });

  it("should render correct values for another model", () => {
    mockUseCurrentChatStoreGetCurrentModelData.mockReturnValue({
      model: "anothermodel",
      totalPromptTokens: 1_000_000,
      totalCompletionTokens: 1_000_000,
    });

    render(<CurrentModelSummary />);

    expect(screen.getByText(/Another/)).toBeInTheDocument();
    expect(screen.getByText(/PT:1,000,000 - \$0.10/)).toBeInTheDocument();
    expect(screen.getByText(/CT:1,000,000 - \$0.40/)).toBeInTheDocument();
  });

  it("should handle cases where totalPromptTokens or totalCompletionTokens are zero", () => {
    mockUseCurrentChatStoreGetCurrentModelData.mockReturnValue({
      model: "model",
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
    });

    render(<CurrentModelSummary />);

    expect(screen.getByText(/Test/)).toBeInTheDocument();
    expect(screen.getByText(/PT:0 - \$0.00/)).toBeInTheDocument();
    expect(screen.getByText(/CT:0 - \$0.00/)).toBeInTheDocument();
  });

  it("should return null when no current model is available", () => {
    mockUseCurrentChatStoreGetCurrentModelData.mockReturnValue(null);

    const { container } = render(<CurrentModelSummary />);

    expect(container.firstChild).toBeNull();
  });
});
