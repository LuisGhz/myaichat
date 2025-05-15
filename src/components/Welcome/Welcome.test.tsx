import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { Welcome } from "./Welcome";
import { MODELS } from "consts/Models";

vi.mock("consts/Models", () => ({
  MODELS: [
    { name: "Model A", value: "modelA", link: "https://a.com" },
    { name: "Model B", value: "modelB", link: "https://b.com" },
  ],
}));

vi.mock("./ModelInfo", () => ({
  ModelInfoC: () => <div data-testid="model-info" />,
}));

describe("Welcome", () => {
  it("renders welcome message and models", () => {
    render(<Welcome />);
    expect(screen.getByText(/Welcome to My AI Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/It supports the following models/i)).toBeInTheDocument();
    MODELS.forEach((model) => {
      expect(screen.getByText(model.name)).toBeInTheDocument();
    });
  });

  it("shows model info on long touch of link", async () => {
    vi.useFakeTimers();
    render(<Welcome />);
    const link = screen.getByText("Model A");
    fireEvent.touchStart(link);
    vi.advanceTimersByTime(600);
    fireEvent.touchEnd(link);
    // Model info should be visible (active class on parent li)
    await waitFor(() => {
      const li = link.closest("li");
      expect(li?.className).toContain("link-container--active");
      vi.useRealTimers();
    });
  });

  it("toggles model info on touch of list item", () => {
    render(<Welcome />);
    const li = screen.getByText("Model B").closest("li");
    if (!li) throw new Error("li not found");
    fireEvent.touchStart(li);
    fireEvent.touchEnd(li);
    expect(li.className).toContain("link-container--active");
    // Touch again to hide
    fireEvent.touchStart(li);
    fireEvent.touchEnd(li);
    expect(li.className).not.toContain("link-container--active");
  });
});
