import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";
import {
  useAppIsMenuOpenStore,
  useAppUpdateIsOfflineStore,
} from "store/useAppStore";
import { useNetworkState } from "hooks/useNetworkState";
import { AppStoreProps } from "types/store/AppStore";

vi.mock("react", async () => {
  const actualReact = await vi.importActual("react");
  return {
    ...actualReact,
    useContext: vi.fn(),
  };
});

vi.mock("hooks/useNetworkState");
vi.mock("store/useAppStore");

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

vi.mock("components/OfflineMessage", () => ({
  OfflineMessage: () => <div data-testid="mock-offline-message">Offline</div>,
}));

describe("App Component", () => {
  const mockUpdateIsOffline = vi.fn();
  vi.mocked(useAppUpdateIsOfflineStore).mockReturnValue(mockUpdateIsOffline);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderApp = (
    props: Partial<AppStoreProps> = {},
    isOffline: boolean = false
  ) => {
    vi.mocked(useAppIsMenuOpenStore).mockReturnValue(props.isMenuOpen ?? true);
    vi.mocked(useNetworkState).mockRejectedValue({
      isOffline,
    });

    render(<App />);
  };

  it("renders the SideNav and Outlet components", () => {
    renderApp();

    const mainElement = screen.getByRole("main");
    expect(screen.getByTestId("mock-side-nav")).toBeInTheDocument();
    expect(screen.getByTestId("mock-outlet")).toBeInTheDocument();
    expect(screen.getByTestId("mock-toast-container")).toBeInTheDocument();
    expect(mainElement).toHaveClass("lg:ms-72");
  });

  it("applies the correct CSS class when the menu is closed (isMenuOpen is false)", () => {
    renderApp();
    const mainElement = screen.getByRole("main");
    expect(mainElement).toHaveClass("ms-0");
  });

  it("Shows the OfflineMessage when isOffline is true", () => {
    renderApp({}, true);

    expect(screen.getByTestId("mock-offline-message")).toBeInTheDocument();
    expect(screen.getByTestId("mock-offline-message")).toHaveTextContent(
      "Offline"
    );
  });
});
