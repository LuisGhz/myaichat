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
    developBy: {
      name: "OpenAI",
      link: "https://openai.com",
      imageUrl: "https://example.com/logo.png",
    },
    price: { input: 0.123, output: 0.456 },
    metadata: {
      contextWindow: 128000,
      maxOutputTokens: 512,
      knowledgeCutoff: "Jan 2024",
    },
  };

  it("renders all model metadata and price info", () => {
    render(<ModelInfoC model={mockModel} />);
    expect(screen.getByText("Context Window")).toBeInTheDocument();
    expect(screen.getByText("formatted-128000")).toBeInTheDocument();
    expect(screen.getByText("Max Output Tokens")).toBeInTheDocument();
    expect(screen.getByText("formatted-512")).toBeInTheDocument();
    expect(screen.getByText("Knowledge Cutoff")).toBeInTheDocument();
    expect(screen.getByText("Jan 2024")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(
      screen.getByText("Input: $0.123 / Output: $0.456")
    ).toBeInTheDocument();
  });
});
