import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { HeaderNav } from "./HeaderNav";
import { AppContext } from "../../context/AppContext";
import { ScreensWidth } from "../../consts/ScreensWidth";

// Mock react-router
vi.mock("react-router", () => ({
  Link: vi.fn(
    ({
      to,
      children,
      onClick,
      "aria-label": ariaLabel,
      className,
      ...props
    }) => (
      <a
        href={to}
        onClick={onClick}
        aria-label={ariaLabel}
        className={className}
        {...props}
      >
        {children}
      </a>
    )
  ),
}));

// Mock icons to simplify testing and avoid dealing with SVG complexities
vi.mock("assets/icons/ArrowLeftCircleIcon", () => ({
  ArrowLeftCircleIcon: vi.fn((props) => (
    <svg data-testid="arrow-left-icon" {...props} />
  )),
}));
vi.mock("assets/icons/PencilSquareIcon", () => ({
  PencilSquareIcon: vi.fn((props) => (
    <svg data-testid="pencil-icon" {...props} />
  )),
}));

describe("HeaderNav", () => {
  let mockSetIsMenuOpen: ReturnType<typeof vi.fn>;
  let windowSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockSetIsMenuOpen = vi.fn();
    windowSpy = vi.spyOn(window, "innerWidth", "get");
  });

  afterEach(() => {
    windowSpy.mockRestore();
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <AppContext.Provider
        value={{
          setIsMenuOpen: mockSetIsMenuOpen,
          isMenuOpen: false,
          chats: [],
          deleteChatById: vi.fn(),
          getAllChatsForList: vi.fn(),
        }}
      >
        <HeaderNav />
      </AppContext.Provider>
    );
  };

  it("renders correctly with all elements", () => {
    renderComponent();

    // Homepage link
    const homepageLink = screen.getByRole("link", { name: "Go to homepage" });
    expect(homepageLink).toBeInTheDocument();
    expect(homepageLink).toHaveAttribute("href", "/");
    expect(within(homepageLink).getByText("MyAIChat")).toBeInTheDocument();

    // Close button
    expect(
      screen.getByRole("button", { name: "Close sidebar menu" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();

    // Links with duplicated aria-label="New conversation"
    const allProblematicLinks = screen.getAllByRole("link", {
      name: "New conversation",
    });

    // New Conversation link
    const newConversationChatLink = allProblematicLinks.find(
      (link) => link.getAttribute("href") === "/chat"
    );
    expect(newConversationChatLink).toBeInTheDocument();
    expect(
      within(newConversationChatLink!).getByText("New conversation")
    ).toBeInTheDocument();
    expect(
      within(newConversationChatLink!).getByTestId("pencil-icon")
    ).toBeInTheDocument();

    // Prompts link
    const promptsLink = allProblematicLinks.find(
      (link) => link.getAttribute("href") === "/prompts"
    );
    expect(promptsLink).toBeInTheDocument();
    expect(within(promptsLink!).getByText("Prompts")).toBeInTheDocument();
  });

  it("calls setIsMenuOpen when the close sidebar button is clicked", () => {
    renderComponent();
    const closeButton = screen.getByRole("button", {
      name: "Close sidebar menu",
    });
    fireEvent.click(closeButton);
    expect(mockSetIsMenuOpen).toHaveBeenCalledTimes(1);
    expect(mockSetIsMenuOpen).toHaveBeenCalledWith(expect.any(Function));
  });

  describe('toggleMenuMobile for "New conversation" link (/chat)', () => {
    const getNewConversationChatLink = () => {
      const allLinks = screen.getAllByRole("link", {
        name: "New conversation",
      });
      return allLinks.find((link) => link.getAttribute("href") === "/chat");
    };

    it("calls setIsMenuOpen when window width is less than tablet breakpoint", () => {
      windowSpy.mockReturnValue(ScreensWidth.tablet - 1);
      renderComponent();
      const newConversationLink = getNewConversationChatLink();
      expect(newConversationLink).toBeInTheDocument();
      fireEvent.click(newConversationLink!);
      expect(mockSetIsMenuOpen).toHaveBeenCalledTimes(1);
      expect(mockSetIsMenuOpen).toHaveBeenCalledWith(expect.any(Function));
    });

    it("does not call setIsMenuOpen when window width is equal to tablet breakpoint", () => {
      windowSpy.mockReturnValue(ScreensWidth.tablet);
      renderComponent();
      const newConversationLink = getNewConversationChatLink();
      expect(newConversationLink).toBeInTheDocument();
      fireEvent.click(newConversationLink!);
      expect(mockSetIsMenuOpen).not.toHaveBeenCalled();
    });

    it("does not call setIsMenuOpen when window width is greater than tablet breakpoint", () => {
      windowSpy.mockReturnValue(ScreensWidth.tablet + 1);
      renderComponent();
      const newConversationLink = getNewConversationChatLink();
      expect(newConversationLink).toBeInTheDocument();
      fireEvent.click(newConversationLink!);
      expect(mockSetIsMenuOpen).not.toHaveBeenCalled();
    });
  });

  describe('toggleMenuMobile for "Prompts" link (/prompts)', () => {
    const getPromptsLink = () => {
      const allLinks = screen.getAllByRole("link", {
        name: "New conversation",
      });
      return allLinks.find((link) => link.getAttribute("href") === "/prompts");
    };

    it("calls setIsMenuOpen when window width is less than tablet breakpoint", () => {
      windowSpy.mockReturnValue(ScreensWidth.tablet - 1);
      renderComponent();
      const promptsLink = getPromptsLink();
      expect(promptsLink).toBeInTheDocument();
      fireEvent.click(promptsLink!);
      expect(mockSetIsMenuOpen).toHaveBeenCalledTimes(1);
      expect(mockSetIsMenuOpen).toHaveBeenCalledWith(expect.any(Function));
    });

    it("does not call setIsMenuOpen when window width is equal to tablet breakpoint", () => {
      windowSpy.mockReturnValue(ScreensWidth.tablet);
      renderComponent();
      const promptsLink = getPromptsLink();
      expect(promptsLink).toBeInTheDocument();
      fireEvent.click(promptsLink!);
      expect(mockSetIsMenuOpen).not.toHaveBeenCalled();
    });

    it("does not call setIsMenuOpen when window width is greater than tablet breakpoint", () => {
      windowSpy.mockReturnValue(ScreensWidth.tablet + 1);
      renderComponent();
      const promptsLink = getPromptsLink();
      expect(promptsLink).toBeInTheDocument();
      fireEvent.click(promptsLink!);
      expect(mockSetIsMenuOpen).not.toHaveBeenCalled();
    });
  });
});
