import { render, screen } from "@testing-library/react";
import App from "./App";
import { useContext } from "react";
import { Mock, vi } from "vitest";

vi.mock("react", async () => {
  const actualReact = await vi.importActual("react");
  return {
    ...actualReact,
    useContext: vi.fn(),
  };
});
const mockUseContext = useContext as unknown as Mock;

// Mock the context
vi.mock("context/AppContext");

// Mock the SideNav component
vi.mock("components/SideNav/SideNav", () => ({
  SideNav: () => <div data-testid="mock-side-nav">Mock SideNav</div>,
}));

// Mock the Outlet component
vi.mock("react-router", () => ({
  Outlet: () => <div data-testid="mock-outlet">Mock Outlet</div>,
}));

vi.mock("react-toastify", () => ({
  ToastContainer: () => (
    <div data-testid="mock-toast-container">Mock ToastContainer</div>
  ),
}));

describe("App Component", () => {
  mockUseContext.mockReturnValue({ isMenuOpen: true });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the SideNav and Outlet components", () => {
    render(<App />);

    const mainElement = screen.getByRole("main");
    expect(screen.getByTestId("mock-side-nav")).toBeInTheDocument();
    expect(screen.getByTestId("mock-outlet")).toBeInTheDocument();
    expect(screen.getByTestId("mock-toast-container")).toBeInTheDocument();
    expect(mainElement).toHaveClass("lg:ms-72");
  });

  it("applies the correct CSS class when the menu is closed (isMenuOpen is false)", () => {
    mockUseContext.mockReturnValue({ isMenuOpen: false });
    render(<App />);
    const mainElement = screen.getByRole("main");
    expect(mainElement).toHaveClass("ms-0");
  });
});
