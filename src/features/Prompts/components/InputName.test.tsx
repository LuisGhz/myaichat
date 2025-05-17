/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { InputName } from "./InputName";
import { describe, it, expect } from "vitest";

describe("InputName Component", () => {
  let mockRegister: any;

  beforeEach(() => {
    mockRegister = () =>
      ({
        onChange: () => {},
        onBlur: () => {},
        name: "name",
        ref: () => {},
      } as any);
  });

  it("should render an input element with the correct placeholder", () => {
    render(<InputName register={mockRegister} errors={{}} />);
    const inputElement = screen.getByPlaceholderText("Enter prompt name...");
    expect(inputElement).toBeInTheDocument();
  });

  it("should display an error message when there is an error", () => {
    const errorMessage = "Name is required";
    const errors = { name: { message: errorMessage } } as any;
    render(<InputName register={mockRegister} errors={errors} />);
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  it("should not display an error message when there is no error", () => {
    render(<InputName register={mockRegister} errors={{}} />);
    const errorElement = screen.queryByText(/Name is required/i);
    expect(errorElement).not.toBeInTheDocument();
  });
});
