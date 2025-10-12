import { render, screen } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

// Mock react-router's Link component
vi.mock("react-router", () => ({
  Link: ({
    children,
    to,
    ...rest
  }: {
    children?: import("react").ReactNode;
    to?: unknown;
  } & Record<string, unknown>) => (
    <a href={String(to ?? "#")} {...(rest as Record<string, unknown>)}>
      {children}
    </a>
  ),
}));

// Mock the MenuFoldLeftIcon used inside the header
vi.mock("icons/MenuFoldLeftIcon", () => ({
  MenuFoldLeftIcon: (props: Record<string, unknown>) => (
    <svg
      data-testid="menu-fold"
      {...(props as unknown as Record<string, unknown>)}
    />
  ),
}));

// Mock the app store hooks to control collapsed state and spy on action
const setSideNavCollapsedMock = vi.fn();
vi.mock("store/app/AppStore", () => ({
  useAppStore: () => ({ sideNavCollapsed: false }),
  useAppStoreActions: () => ({ setSideNavCollapsed: setSideNavCollapsedMock }),
}));

import { SideNavHeader } from "./SideNavHeader";

describe("SideNavHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders avatar placeholder and toggle button", () => {
    render(<SideNavHeader />);

    // avatar div is the circular element
    const avatar = screen.getAllByAltText("MyAIChatlogo");
    expect(avatar).toBeTruthy();

    // menu icon button should be present
    expect(screen.getByTestId("menu-fold")).toBeInTheDocument();
  });

  it("calls setSideNavCollapsed with inverse value when clicked", async () => {
    const user = userEvent.setup();
    render(<SideNavHeader />);

    const btn = screen
      .getByTestId("menu-fold")
      .closest("button") as HTMLElement;
    expect(btn).toBeTruthy();

    await user.click(btn);
    expect(setSideNavCollapsedMock).toHaveBeenCalledWith(true);
  });
});
