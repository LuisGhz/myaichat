/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatsNav } from "./ChatsNav";
import { ScreensWidth } from "consts/ScreensWidth";
import { ChatSummary } from "types/chat/ChatSummary.type";
import * as reactRouter from "react-router";
import * as useContextMenu from "hooks/useContextMenu";
import * as useAppStore from "store/useAppStore";
import * as useChats from "hooks/useChats";
import { AppStoreProps } from "types/store/AppStore";

// filepath: c:\Users\Luisghtz\dev\react\myaichat\src\components\SideNav\ChatsNav.test.tsx

// Mock react-router
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
    Link: vi.fn(
      ({ to, children, className, "aria-label": ariaLabel, ...props }) => (
        <a href={to} className={className} aria-label={ariaLabel} {...props}>
          {children}
        </a>
      )
    ),
  };
});

// Mock hooks and components
vi.mock("hooks/useContextMenu", () => ({
  useContextMenu: vi.fn(),
}));

vi.mock("components/ContextMenu", () => ({
  ContextMenu: vi.fn(({ isOpen, elements }) =>
    isOpen && elements ? (
      <div>
        {elements.map((el: any, i: any) => (
          <div key={i}>{el}</div>
        ))}
      </div>
    ) : null
  ),
}));

vi.mock("store/useAppStore");

vi.mock("assets/icons/TrashIcon", () => ({
  TrashIcon: () => <svg data-testid="trash-icon" />,
}));

vi.mock("assets/icons/PencilIcon", () => ({
  PencilIcon: () => <svg data-testid="pencil-icon" />,
}));

vi.mock("hooks/useChats");

const mockNavigate = vi.fn();
const mockUseParams = vi.mocked(reactRouter.useParams);
const mockUseNavigate = vi.mocked(reactRouter.useNavigate);
const mockUseContextMenu = vi.mocked(useContextMenu.useContextMenu);
const mockUseChatsAppStore = vi.mocked(useAppStore.useAppChatsStore);
const mockUseAppIsMenuOpenStore = vi.mocked(useAppStore.useAppIsMenuOpenStore);
const mockUseAppSetIsMenuOpenStore = vi.mocked(
  useAppStore.useAppSetIsMenuOpenStore
);

interface MinimalUseChatsReturn {
  getAllChats: () => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>; // Adjust the return type if it's not Promise<void>
}
const mockUseChats = vi.mocked(
  useChats.useChats as () => MinimalUseChatsReturn
);

let mockDeleteChatById: ReturnType<typeof vi.fn>;
let mockGetAllChats: ReturnType<typeof vi.fn>;
let mockOnTouchStart: ReturnType<typeof vi.fn>;
let mockOnTouchEnd: ReturnType<typeof vi.fn>;
let mockSetIsMenuOpen: ReturnType<typeof vi.fn>;

const mockChatsData: ChatSummary[] = [
  {
    id: "chat1",
    title: "Chat Alpha",
  },
  {
    id: "chat2",
    title: "Chat Beta",
  },
];

const renderComponent = (
  chats = mockChatsData,
  currentChatId: string | null = null,
  props: Partial<AppStoreProps> = {}
) => {
  mockUseParams.mockReturnValue({ id: currentChatId! });
  mockUseNavigate.mockReturnValue(mockNavigate);
  mockDeleteChatById = vi.fn();
  mockGetAllChats = vi.fn();
  mockSetIsMenuOpen = vi.fn();
  mockUseChatsAppStore.mockReturnValue(chats);
  mockUseChats.mockReturnValue({
    getAllChats: mockGetAllChats,
    deleteChat: mockDeleteChatById,
  });
  mockOnTouchStart = vi.fn((_, callback) => {
    // Simulate the hook calling the callback.
    // The callback in the component calls event.preventDefault() internally.
    callback();
  });
  mockOnTouchEnd = vi.fn();
  mockUseContextMenu.mockReturnValue({
    onTouchStart: mockOnTouchStart,
    onTouchEnd: mockOnTouchEnd,
  });
  mockUseAppIsMenuOpenStore.mockReturnValue(props.isMenuOpen ?? true);
  mockUseAppSetIsMenuOpenStore.mockReturnValue(mockSetIsMenuOpen);
  return render(<ChatsNav />);
};

describe("ChatsNav", () => {
  let innerWidthSpy: ReturnType<typeof vi.spyOn>;
  let alertSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: undefined });
    mockNavigate.mockClear();
    mockDeleteChatById?.mockClear();
    mockUseAppIsMenuOpenStore.mockClear();
    mockOnTouchStart?.mockClear();
    mockOnTouchEnd?.mockClear();

    innerWidthSpy = vi.spyOn(window, "innerWidth", "get");
    alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    addEventListenerSpy = vi.spyOn(window, "addEventListener");
  });

  afterEach(() => {
    vi.clearAllMocks();
    innerWidthSpy.mockRestore();
    alertSpy.mockRestore();
    consoleLogSpy.mockRestore();
    addEventListenerSpy.mockRestore();
  });

  it("should render nothing if chats array is empty", () => {
    renderComponent([]);
    expect(screen.queryByRole("listitem")).toBeNull();
  });

  it("should render chat items correctly", () => {
    renderComponent();
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(mockChatsData.length);

    mockChatsData.forEach((chat) => {
      const link = screen.getByRole("link", {
        name: `Open chat: ${chat.title}`,
      });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/chat/${chat.id}`);
      expect(link).toHaveTextContent(chat.title);
    });
  });

  it("should highlight the active chat", () => {
    const activeChatId = mockChatsData[0].id;
    renderComponent(mockChatsData, activeChatId);

    const activeLink = screen.getByRole("link", {
      name: `Open chat: ${mockChatsData[0].title}`,
    });
    expect(activeLink).toHaveClass("font-bold");

    const inactiveLink = screen.getByRole("link", {
      name: `Open chat: ${mockChatsData[1].title}`,
    });
    expect(inactiveLink).not.toHaveClass("font-bold");
  });

  it("should handle chat click on desktop without toggling menu", () => {
    innerWidthSpy.mockReturnValue(ScreensWidth.tablet + 100);
    renderComponent();
    const firstChatLink = screen.getByRole("link", {
      name: `Open chat: ${mockChatsData[0].title}`,
    });
    fireEvent.click(firstChatLink);
    expect(mockSetIsMenuOpen).not.toHaveBeenCalled();
  });

  it("should handle chat click on mobile and toggle menu", () => {
    innerWidthSpy.mockReturnValue(ScreensWidth.tablet - 100);
    renderComponent();
    const firstChatLink = screen.getByRole("link", {
      name: `Open chat: ${mockChatsData[0].title}`,
    });
    fireEvent.click(firstChatLink);
    expect(mockSetIsMenuOpen).toHaveBeenCalledTimes(1);
  });

  it("should open context menu on right click (contextmenu event)", () => {
    renderComponent();
    const firstChatLink = screen.getByRole("link", {
      name: `Open chat: ${mockChatsData[0].title}`,
    });

    const contextMenuEvent = new MouseEvent("contextmenu", { bubbles: true });
    vi.spyOn(contextMenuEvent, "preventDefault");
    fireEvent(firstChatLink, contextMenuEvent);

    expect(contextMenuEvent.preventDefault).toHaveBeenCalled();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(
      screen.getByLabelText(`Delete chat: ${mockChatsData[0].title}`)
    ).toBeInTheDocument();
    expect(screen.getByText("Rename")).toBeInTheDocument();
    expect(screen.getByLabelText("Rename chat")).toBeInTheDocument();
  });

  it("should open context menu on touch start", () => {
    renderComponent();
    const firstChatLink = screen.getByRole("link", {
      name: `Open chat: ${mockChatsData[0].title}`,
    });
    fireEvent.touchStart(firstChatLink);

    expect(mockOnTouchStart).toHaveBeenCalled();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Rename")).toBeInTheDocument();
  });

  it("should handle delete chat and navigate if active chat is deleted", () => {
    const activeChatId = mockChatsData[0].id;
    renderComponent(mockChatsData, activeChatId);

    const firstChatLink = screen.getByRole("link", {
      name: `Open chat: ${mockChatsData[0].title}`,
    });
    fireEvent.contextMenu(firstChatLink); // Open context menu

    const deleteButton = screen.getByRole("button", {
      name: `Delete chat: ${mockChatsData[0].title}`,
    });
    fireEvent.click(deleteButton);

    expect(mockDeleteChatById).toHaveBeenCalledWith(mockChatsData[0].id);
    expect(mockNavigate).toHaveBeenCalledWith("/chat");
    expect(screen.queryByText("Delete")).toBeNull(); // ContextMenu closed
  });

  it("should handle delete chat and not navigate if non-active chat is deleted", () => {
    renderComponent(mockChatsData, mockChatsData[1].id); // chat2 is active

    const firstChatLink = screen.getByRole("link", {
      name: `Open chat: ${mockChatsData[0].title}`,
    }); // Deleting chat1
    fireEvent.contextMenu(firstChatLink);

    const deleteButton = screen.getByRole("button", {
      name: `Delete chat: ${mockChatsData[0].title}`,
    });
    fireEvent.click(deleteButton);

    expect(mockDeleteChatById).toHaveBeenCalledWith(mockChatsData[0].id);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.queryByText("Delete")).toBeNull();
  });

  it("should handle rename chat", () => {
    renderComponent();
    const firstChatLink = screen.getByRole("link", {
      name: `Open chat: ${mockChatsData[0].title}`,
    });
    fireEvent.contextMenu(firstChatLink);

    const renameButton = screen.getByRole("button", { name: "Rename chat" });
    fireEvent.click(renameButton);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Rename chat",
      mockChatsData[0].id
    );
    expect(alertSpy).toHaveBeenCalledWith("Not available yet.");
    expect(screen.queryByText("Rename")).toBeNull(); // ContextMenu closed
  });

  it("should close context menu on window scroll", () => {
    renderComponent();

    // Listener should be added on render
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      true
    );

    const firstChatLink = screen.getByRole("link", {
      name: `Open chat: ${mockChatsData[0].title}`,
    });
    fireEvent.contextMenu(firstChatLink); // Open context menu
    expect(screen.getByText("Delete")).toBeInTheDocument(); // Menu is open

    fireEvent.scroll(window); // Simulate scroll event

    expect(screen.queryByText("Delete")).toBeNull(); // Menu should be closed
  });
});
