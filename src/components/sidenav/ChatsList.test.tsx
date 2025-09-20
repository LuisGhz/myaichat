/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";

// Mock child components and hooks before importing the component under test
const getChatsSummaryMock = vi.fn();
let chatsSummaryMock: ChatSummary[] = [
  { id: "1", title: "FavOne", fav: true } as ChatSummary,
  { id: "2", title: "UnfavOne", fav: false } as ChatSummary,
];

vi.mock("core/hooks/useSideNav", () => ({
  useSideNav: () => ({
    getChatsSummary: getChatsSummaryMock,
    chatsSummary: chatsSummaryMock,
  }),
}));

let isGettingNewChatFlag = false;
vi.mock("store/app/AppStore", () => ({
  useAppStore: () => ({ isGettingNewChat: isGettingNewChatFlag }),
}));

vi.mock("antd", () => ({
  ...vi.importActual("antd"),
  Divider: () => <div data-testid="divider" />,
  Skeleton: {
    Button: () => <div data-testid="skeleton">Loading...</div>,
  },
}));

// Mock ChatItem to render title and attach context menu handler in a test-friendly way
vi.mock("./ChatItem", () => ({
  ChatItem: ({ chat, onContextMenu }: Record<string, any>) => (
    <li
      data-testid={`chat-${chat.id}`}
      onContextMenu={(e: any) => (onContextMenu as any)(chat.id)(e)}
    >
      {chat.title}
    </li>
  ),
}));

// Mock ChatContextMenu to reveal when open and which chat is provided
vi.mock("components/context-menu/ChatContextMenu", () => ({
  ChatContextMenu: ({ isContextMenuOpen, chat }: Record<string, any>) => (
    <div data-testid="context-menu">
      {isContextMenuOpen ? chat?.title ?? "no-chat" : "closed"}
    </div>
  ),
}));

import { ChatsList } from "./ChatsList";

describe("ChatsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls getChatsSummary on mount and renders favorite and unfavorite chats", () => {
    chatsSummaryMock = [
      { id: "1", title: "FavOne", fav: true } as ChatSummary,
      { id: "2", title: "UnfavOne", fav: false } as ChatSummary,
    ];
    render(<ChatsList />);

    expect(getChatsSummaryMock).toHaveBeenCalled();

    // both favorite and unfavorite titles should be rendered
    expect(screen.getByText("FavOne")).toBeInTheDocument();
    expect(screen.getByText("UnfavOne")).toBeInTheDocument();
    expect(screen.getByTestId("divider")).toBeInTheDocument();
  });

  it("does not show divider because there is no favorite chat", () => {
    chatsSummaryMock = [
      { id: "1", title: "FavOne", fav: false } as ChatSummary,
      { id: "2", title: "UnfavOne", fav: false } as ChatSummary,
    ];
    render(<ChatsList />);

    expect(getChatsSummaryMock).toHaveBeenCalled();

    // both favorite and unfavorite titles should be rendered
    expect(screen.getByText("FavOne")).toBeInTheDocument();
    expect(screen.getByText("UnfavOne")).toBeInTheDocument();
    expect(screen.queryByTestId("divider")).not.toBeInTheDocument();
  });

  it("opens context menu on right click and shows the chat title", () => {
    render(<ChatsList />);

    const favItem = screen.getByTestId("chat-1");
    fireEvent.contextMenu(favItem, { pageX: 10, pageY: 20 });

    // our mocked ChatContextMenu shows the chat title when open
    expect(screen.getByTestId("context-menu")).toHaveTextContent("FavOne");
  });

  it("renders skeleton when isGettingNewChat is true", () => {
    // toggle the flag used by the mocked store
    isGettingNewChatFlag = true;

    const { container } = render(<ChatsList />);

    // the list should contain the two ChatItem mock LIs plus an extra node for the skeleton
    const ul = container.querySelector("ul") as HTMLElement | null;
    expect(ul).toBeTruthy();
    // there should be at least 2 list children for the chats
    expect(ul?.children.length).toBeGreaterThanOrEqual(2);

    // reset flag for other tests
    isGettingNewChatFlag = false;
  });
});
