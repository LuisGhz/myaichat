/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { InputContent } from "./InputContent";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";

describe("InputContent Component", () => {
  let mockRegister: any;

  beforeEach(() => {
    mockRegister = () => ({
      onChange: () => {},
      onBlur: () => {},
      name: "content",
      ref: () => {},
    }) as any;
  });

  it("renders without crashing", () => {
    render(<InputContent register={mockRegister} errors={{}} />);
  });

  it("renders a textarea with correct attributes", () => {
    render(<InputContent register={mockRegister} errors={{}} />);
    const textareaElement = screen.getByPlaceholderText("Type your prompt here...");
    expect(textareaElement).toBeInTheDocument();
  });

  it("displays an error message when there is an error", () => {
    const errors = { content: { message: "This is a required field" } } as any;
    render(<InputContent register={mockRegister} errors={errors} />);
    const errorMessage = screen.getByText("This is a required field");
    expect(errorMessage).toBeInTheDocument();
  });

  it("does not display an error message when there is no error", () => {
    render(<InputContent register={mockRegister} errors={{}} />);
    const errorMessage = screen.queryByText("This is a required field");
    expect(errorMessage).toBeNull();
  });

  it("updates the textarea value when the user types", async () => {
    render(<InputContent register={mockRegister} errors={{}} />);
    const textareaElement = screen.getByPlaceholderText("Type your prompt here...");
    await userEvent.type(textareaElement, "Test input");
    expect(textareaElement).toHaveValue("Test input");
  });
});