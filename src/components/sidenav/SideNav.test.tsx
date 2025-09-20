import { render, screen } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";

// Mock child components to keep tests focused and fast
vi.mock("./SideNavHeader", () => ({ SideNavHeader: () => <div data-testid="sidenav-header">header</div> }));
vi.mock("./UserSummary", () => ({ UserSummary: () => <div data-testid="user-summary">user</div> }));
vi.mock("./SideNavActionButtons", () => ({ SideNavActionButtons: () => <div data-testid="action-buttons">actions</div> }));
vi.mock("./ChatsList", () => ({ ChatsList: () => <div data-testid="chats-list">chats</div> }));

// Mock antd Grid.useBreakpoint to control isMobile behavior
const useBreakpointMock = vi.fn();
vi.mock("antd", async () => {
  const actual = await vi.importActual<typeof import("antd")>("antd");
  return {
    ...actual,
    Grid: {
      useBreakpoint: () => useBreakpointMock(),
    },
    Layout: actual.Layout,
  };
});

// Mock store hooks
const setSideNavCollapsedMock = vi.fn();
vi.mock("store/app/AppStore", () => ({
  useAppStore: () => ({ sideNavCollapsed: true }),
  useAppStoreActions: () => ({ setSideNavCollapsed: setSideNavCollapsedMock }),
}));

import { SideNav } from "./SideNav";

describe("SideNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders child sections", () => {
    useBreakpointMock.mockReturnValue({ md: true });
    render(<SideNav />);

    expect(screen.getByTestId("sidenav-header")).toBeInTheDocument();
    expect(screen.getByTestId("user-summary")).toBeInTheDocument();
    expect(screen.getByTestId("action-buttons")).toBeInTheDocument();
    expect(screen.getByTestId("chats-list")).toBeInTheDocument();
  });

  it("collapses on mobile (md=false) and calls setSideNavCollapsed(true)", async () => {
    useBreakpointMock.mockReturnValue({ md: false });
    render(<SideNav />);

    // initial effect should set collapsed on mobile
    expect(setSideNavCollapsedMock).toHaveBeenCalledWith(true);
  });

  it("expands on desktop (md=true) and calls setSideNavCollapsed(false)", async () => {
    useBreakpointMock.mockReturnValue({ md: true });
    render(<SideNav />);

    expect(setSideNavCollapsedMock).toHaveBeenCalledWith(false);
  });
});
