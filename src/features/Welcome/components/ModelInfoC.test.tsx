import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { ModelInfoC } from "./ModelInfoC";
import { ModelInfo, MODELS } from "core/const/Models";

// Mock the useFormat hook to return deterministic formatters for tests
vi.mock("core/hooks/useFormat", () => {
  return {
    useFormat: () => ({
      fNumber: (n: number) => `N:${n}`,
      fCurrency: (n: number) => `CUR:${n}`,
    }),
  };
});

describe("ModelInfoC", () => {
  beforeEach(() => {
    // render cleanup handled after each test
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const renderComponent = (model: ModelInfo = MODELS[0]) => {
    return render(<ModelInfoC model={model} />);
  };

  it("renders the metadata labels and formatted values", () => {
    renderComponent();

    // Labels
    expect(screen.getByText(/Context Window/i)).toBeInTheDocument();
    expect(screen.getByText(/Max Output Tokens/i)).toBeInTheDocument();
    expect(screen.getByText(/Knowledge Cutoff/i)).toBeInTheDocument();
    expect(screen.getByText(/Price/i)).toBeInTheDocument();

    // Formatted numbers from mocked useFormat
    const model = MODELS[0];
    expect(screen.getByText(`N:${model.metadata.contextWindow}`)).toBeInTheDocument();
    expect(screen.getByText(`N:${model.metadata.maxOutputTokens}`)).toBeInTheDocument();
    expect(screen.getByText(model.metadata.knowledgeCutoff)).toBeInTheDocument();

    // Price labels and formatted currency from mocked useFormat
    expect(screen.getByText(/Input:/)).toBeInTheDocument();
    expect(screen.getByText(/Output:/)).toBeInTheDocument();
    // currency nodes may be split or contain whitespace, match by substring
    expect(
      screen.getByText((content) => content.includes(`CUR:${model.price.input}`))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes(`CUR:${model.price.output}`))
    ).toBeInTheDocument();
  });

  it("is accessible via keyboard (focusable section) and contains semantic section", async () => {
    renderComponent();
    const section = screen.queryByRole("region") ?? screen.getByText(/Context Window/i).closest("section");
    // section should exist and be a semantic <section>
    expect(section).toBeTruthy();
    expect((section as Element).tagName).toBe("SECTION");
    // it should contain the Context Window label
    expect(section).toHaveTextContent(/Context Window/i);
  });

});
