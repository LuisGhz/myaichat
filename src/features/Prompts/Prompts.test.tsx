import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { Prompts } from "./Prompts";
import { Prompt } from "types/prompts/GetAllPromptsRes.type";
import { usePrompts } from "hooks/features/Prompts/usePrompts";

vi.mock("hooks/features/Prompts/usePrompts");
const mockUsePrompts = usePrompts as unknown as Mock;

vi.mock("hooks/components/useContextMenu", () => ({
  useContextMenu: () => ({
    onTouchStart: vi.fn((_, cb) => cb()),
    onTouchEnd: vi.fn(),
  }),
}));

vi.mock("components/ContextMenu", () => ({
  ContextMenu: ({ isOpen }: { isOpen: boolean }) =>
    isOpen && <div data-testid="context-menu" />,
}));

vi.mock("react-router", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("Prompts", () => {
  const mockGetPrompts = vi.fn();
  const mockDeletePrompt = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const startMockUsePrompts = (prompts: Prompt[] = []) => {
    mockUsePrompts.mockReturnValue({
      prompts,
      getPrompts: mockGetPrompts,
      deletePrompt: mockDeletePrompt,
    });
  };

  it("renders prompts list", () => {
    startMockUsePrompts([
      { id: "1", name: "Prompt One" },
      { id: "2", name: "Prompt Two" },
    ]);
    render(<Prompts />);
    expect(screen.getByText("Prompts")).toBeInTheDocument();
    expect(screen.getByText("Available Prompts")).toBeInTheDocument();
    expect(screen.getByText("Prompt One")).toBeInTheDocument();
    expect(screen.getByText("Prompt Two")).toBeInTheDocument();
  });

  it("shows empty state if no prompts", () => {
    mockUsePrompts.mockReturnValue({
      prompts: [],
      getPrompts: vi.fn(),
      deletePrompt: vi.fn(),
    });
    render(<Prompts />);
    expect(screen.getByText("No prompts available.")).toBeInTheDocument();
  });

  it("opens context menu on right click", async () => {
    startMockUsePrompts([{ id: "1", name: "Prompt One" }]);
    render(<Prompts />);
    const promptItem = screen.getByText("Prompt One");
    expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
    fireEvent.contextMenu(promptItem);
    await waitFor(() => {
      screen.getByTestId("context-menu");
    });
  });

  it("renders create new prompt link", () => {
    render(<Prompts />);
    expect(screen.getByText("Create New Prompt")).toBeInTheDocument();
  });
});
