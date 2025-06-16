import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Welcome } from "./Welcome";
import { MODELS } from "consts/Models";

vi.mock("consts/Models", () => ({
  MODELS: [
    {
      name: "Model A",
      value: "modelA",
      link: "https://a.com",
      developBy: {
        name: "OpenAI",
        link: "https://openai.com",
        imageUrl: "https://openai.com/favicon.ico",
      },
    },
    {
      name: "Model B",
      value: "modelB",
      link: "https://b.com",
      developBy: {
        name: "OpenAI",
        link: "https://openai.com",
        imageUrl: "https://openai.com/favicon.ico",
      },
    },
  ],
}));

vi.mock("./ModelInfo", () => ({
  ModelInfoC: () => <div data-testid="model-info" />,
}));

describe("Welcome", () => {
  it("renders welcome message and models", () => {
    render(<Welcome />);
    expect(screen.getByText(/Welcome to My AI Chat/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /This app is designed to help you interact with various AI models. It supports the following ones:/i
      )
    ).toBeInTheDocument();
    const modelAText = screen.getAllByText("OpenAI");
    expect(modelAText.length).toBe(1);
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(1);
    expect(images[0]).toHaveAttribute("src", "https://openai.com/favicon.ico");
    MODELS.forEach((model) => {
      expect(screen.getByText(model.name)).toBeInTheDocument();
    });
  });
});
