import { render, screen } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";

const validateExistingTokenMock = vi.fn();
vi.mock("shared/hooks/useAuth", () => ({
  useAuth: () => ({
    validateExistingToken: validateExistingTokenMock,
  }),
}));

import { ProtectedRoute } from "./ProtectedRoute";
describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls validateExistingToken on mount", () => {
    const children = <p>Children</p>;

    render(<ProtectedRoute>{children}</ProtectedRoute>);

    expect(validateExistingTokenMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Children")).toBeInTheDocument();
  });
});
