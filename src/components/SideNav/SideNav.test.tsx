import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SideNav } from "./SideNav";
import { ScreensWidth } from "consts/ScreensWidth"; // Used by the component
import * as useAppStore from "store/useAppStore"; // Used by the component
import { AppStoreProps } from "types/store/AppStore";

// Mocks
vi.mock("react-router", () => ({
  Link: vi.fn(({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  )),
}));

vi.mock("assets/icons/ArrowRightCircleIcon", () => ({
  ArrowRightCircleIcon: vi.fn((props) => (
    <svg {...props} data-testid="arrow-right-icon" />
  )),
}));

vi.mock("assets/icons/PencilSquareIcon", () => ({
  PencilSquareIcon: vi.fn((props) => (
    <svg {...props} data-testid="pencil-square-icon" />
  )),
}));

vi.mock("./ChatsNav", () => ({
  ChatsNav: vi.fn(() => <div data-testid="chats-nav">ChatsNav</div>),
}));

vi.mock("./HeaderNav", () => ({
  HeaderNav: vi.fn(() => <div data-testid="header-nav">HeaderNav</div>),
}));

vi.mock("store/useAppStore");

const mockSetIsMenuOpen = vi.fn();

const renderSideNav = (storeProps: Partial<AppStoreProps> = {}) => {
  vi.mocked(useAppStore.useAppIsMenuOpenStore).mockReturnValue(
    storeProps.isMenuOpen ?? true
  );
  return render(<SideNav />);
};

describe("SideNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppStore.useAppSetIsMenuOpenStore).mockReturnValue(
      mockSetIsMenuOpen
    );
    // Reset window.innerWidth to a common default or ensure it's managed by specific describe blocks
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: ScreensWidth.smallDesktop, // Default to desktop, can be overridden
    });
  });

  afterEach(() => {
    cleanup(); // Cleans up DOM, but not spies/mocks automatically
  });

  describe("Initial Rendering", () => {
    it("should render the brand link, open menu button, and new chat link", () => {
      renderSideNav();
      expect(
        screen.getByRole("link", { name: /Go to home page/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Open sidebar menu/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /New conversation/i })
      ).toBeInTheDocument();
    });

    it("should render HeaderNav and ChatsNav components", () => {
      renderSideNav();
      expect(screen.getByTestId("header-nav")).toBeInTheDocument();
      expect(screen.getByTestId("chats-nav")).toBeInTheDocument();
    });
  });

  describe("Menu Toggle", () => {
    it("should call setIsMenuOpen and toggle aria-expanded when open menu button is clicked", () => {
      // Initial state: isMenuOpen = false
      // renderSideNav sets up useAppIsMenuOpenStore to return false.
      // useAppSetIsMenuOpenStore
      //
      // is assumed to be mocked to return mockSetIsMenuOpen in a beforeEach.
      const { rerender } = renderSideNav({
        isMenuOpen: false,
      });
      let button = screen.getByRole("button", { name: /Open sidebar menu/i });
      expect(button).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(button);
      // Component calls setIsMenuOpen(!isMenuOpen). Initial isMenuOpen was false.
      // So, setIsMenuOpen(true) is called.
      expect(mockSetIsMenuOpen).toHaveBeenCalledTimes(1);
      expect(mockSetIsMenuOpen).toHaveBeenCalledWith(true);

      // Simulate state update: isMenuOpen becomes true
      mockSetIsMenuOpen.mockClear(); // Clear mock calls for the next assertion set

      // Update the store mock to reflect the new state
      vi.mocked(useAppStore.useAppIsMenuOpenStore).mockReturnValue(true);

      // Rerender the component. It will now pick up isMenuOpen = true from the store.
      rerender(<SideNav />);

      button = screen.getByRole("button", { name: /Open sidebar menu/i }); // Re-fetch button after rerender
      expect(button).toHaveAttribute("aria-expanded", "true"); // aria-expanded should now be true

      fireEvent.click(button);
      // Component calls setIsMenuOpen(!isMenuOpen). Current isMenuOpen is true.
      // So, setIsMenuOpen(false) is called.
      expect(mockSetIsMenuOpen).toHaveBeenCalledTimes(1);
      expect(mockSetIsMenuOpen).toHaveBeenCalledWith(false);
    });
  });

  describe("Menu Visibility and Styling", () => {
    const getNavElement = () =>
      screen.getByRole("navigation", { name: "Chat navigation" });

    it('should apply correct classes when menu is "open" (context isMenuOpen: true)', () => {
      renderSideNav({ isMenuOpen: true });
      const navElement = getNavElement();
      expect(navElement.className).toContain("-translate-x-full");
      expect(navElement.className).toContain("lg:translate-x-0");
    });

    it('should apply correct classes when menu is "closed" (context isMenuOpen: false)', () => {
      renderSideNav({ isMenuOpen: false });
      const navElement = getNavElement();
      expect(navElement.className).toContain("translate-x-0");
      expect(navElement.className).toContain("lg:-translate-x-full");
    });
  });

  describe("Click Outside Behavior (Mobile)", () => {
    const mobileWidth = 500; // Less than ScreensWidth.smallDesktop (1024)
    let originalInnerWidth = 0;

    beforeEach(() => {
      originalInnerWidth = window.innerWidth;
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: mobileWidth,
      });
      mockSetIsMenuOpen.mockClear(); // Ensure clean mock for each test
    });

    afterEach(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
    });

    it("should hide the menu if it is visible (isMenuOpen: false) and click is outside", () => {
      renderSideNav({ isMenuOpen: false, setIsMenuOpen: mockSetIsMenuOpen });
      fireEvent.click(document.body);
      expect(mockSetIsMenuOpen).toHaveBeenCalledTimes(1);
    });

    it("should not call setIsMenuOpen if menu is hidden (isMenuOpen: true) and click is outside", () => {
      renderSideNav({ isMenuOpen: true, setIsMenuOpen: mockSetIsMenuOpen });
      fireEvent.click(document.body);
      expect(mockSetIsMenuOpen).not.toHaveBeenCalled();
    });

    it("should not hide menu if click is inside nav (menu visible - isMenuOpen: false)", () => {
      renderSideNav({ isMenuOpen: false, setIsMenuOpen: mockSetIsMenuOpen });
      const navElement = screen.getByRole("navigation", {
        name: "Chat navigation",
      });
      fireEvent.click(navElement);
      expect(mockSetIsMenuOpen).not.toHaveBeenCalled();
    });

    it("should call setIsMenuOpen once (via toggleMenu) if click is on the toggle button (menu visible - isMenuOpen: false)", () => {
      renderSideNav({ isMenuOpen: false, setIsMenuOpen: mockSetIsMenuOpen });
      const button = screen.getByRole("button", { name: /Open sidebar menu/i });
      fireEvent.click(button);
      expect(mockSetIsMenuOpen).toHaveBeenCalledTimes(1); // Called by toggleMenu
    });

    it("should not hide menu if click is on a .sidenav-context-menu element (mobile, menu visible)", () => {
      const mockContextMenu = document.createElement("div");
      mockContextMenu.className = "sidenav-context-menu";
      document.body.appendChild(mockContextMenu);

      renderSideNav({ isMenuOpen: false, setIsMenuOpen: mockSetIsMenuOpen });
      fireEvent.click(mockContextMenu);
      expect(mockSetIsMenuOpen).not.toHaveBeenCalled();

      document.body.removeChild(mockContextMenu);
    });
  });

  describe("Click Outside Behavior (Desktop)", () => {
    const desktopWidth = 1200; // >= ScreensWidth.smallDesktop (1024)
    let originalInnerWidth = 0;

    beforeEach(() => {
      originalInnerWidth = window.innerWidth;
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: desktopWidth,
      });
      mockSetIsMenuOpen.mockClear();
    });

    afterEach(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
    });

    it("should not call setIsMenuOpen when clicking outside, if menu is visible (isMenuOpen: true)", () => {
      renderSideNav({ isMenuOpen: true, setIsMenuOpen: mockSetIsMenuOpen });
      fireEvent.click(document.body);
      expect(mockSetIsMenuOpen).not.toHaveBeenCalled();
    });

    it("should not call setIsMenuOpen when clicking outside, if menu is hidden (isMenuOpen: false)", () => {
      renderSideNav({ isMenuOpen: false, setIsMenuOpen: mockSetIsMenuOpen });
      fireEvent.click(document.body);
      expect(mockSetIsMenuOpen).not.toHaveBeenCalled();
    });
  });

  describe("Event Listener Cleanup", () => {
    let addEventSpy: ReturnType<typeof vi.spyOn>;
    let removeEventSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      addEventSpy = vi.spyOn(document, "addEventListener");
      removeEventSpy = vi.spyOn(document, "removeEventListener");
    });

    afterEach(() => {
      addEventSpy.mockRestore();
      removeEventSpy.mockRestore();
    });

    it("should add event listener on mount and remove on unmount", () => {
      const { unmount } = renderSideNav();

      const addCall = addEventSpy.mock.calls.find(
        (call) => call[0] === "click"
      );
      expect(addCall).toBeDefined();
      const handleClickOutsideHandler = addCall![1]; // Get the handler function

      unmount();

      const removeCall = removeEventSpy.mock.calls.find(
        (call) => call[0] === "click" && call[1] === handleClickOutsideHandler
      );
      expect(removeCall).toBeDefined();
    });
  });
});
