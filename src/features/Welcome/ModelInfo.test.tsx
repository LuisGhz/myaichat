import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ModelInfoC } from "./ModelInfo";
import { ModelInfo } from "consts/Models";

// Mock useFormat hook
vi.mock("hooks/useFormat", () => ({
  useFormat: () => ({
    fNumber: (n: number) => `formatted-${n}`,
    fCurrency: (n: number) => `$${n}`,
  }),
}));

describe("ModelInfoC", () => {
  const mockModel: ModelInfo = {
    name: "Test Model",
    shortName: "TM",
    value: "gpt-4o",
    link: "https://example.com",
    price: { input: 0.123, output: 0.456 },
    metadata: {
      contextWindow: 2048,
      maxOutputTokens: 512,
      knowledgeCutoff: "Jan 2024",
    },
  };

  it("renders all model metadata and price info", () => {
    render(<ModelInfoC model={mockModel} />);
    expect(screen.getByText("Context Window: formatted-2048")).toBeInTheDocument();
    expect(screen.getByText("Max Output Tokens: 512")).toBeInTheDocument();
    expect(screen.getByText("Knowledge Cutoff: Jan 2024")).toBeInTheDocument();
    expect(screen.getByText(/Price: Input: \$0.123 \/ Output: \$0.456/)).toBeInTheDocument();
  });
});
