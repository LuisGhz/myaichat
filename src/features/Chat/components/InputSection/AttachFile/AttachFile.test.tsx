import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AttachFile } from "./AttachFile";

// Mock dependencies
vi.mock("assets/icons/PaperClipIcon", () => ({
  PaperClipIcon: () => <div data-testid="paper-clip-icon" />,
}));

vi.mock("components/Dialogs/InfoDialog", () => ({
  InfoDialog: ({
    message,
    isOpen,
    onConfirm,
  }: {
    message: string[];
    isOpen: boolean;
    onConfirm: () => void;
  }) =>
    isOpen && (
      <div
        data-testid="info-dialog"
        style={{ display: isOpen ? "block" : "none" }}
      >
        {message.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
        <button onClick={onConfirm}>Ok</button>
      </div>
    ),
}));

vi.mock("./PasteFromClipboard", () => {
  return {
    PasteFromClipboard: () => (
      <li data-testid="paste-from-clipboard">Paste from Clipboard</li>
    ),
  };
});

vi.mock("./UploadFromSelection", () => {
  return {
    UploadFromSelection: () => (
      <li data-testid="upload-from-selection">
        Upload
        <input
          data-testid="file-input"
          type="file"
          className="hidden"
        />
      </li>
    ),
  };
});

describe("AttachFile", () => {
  const onSelectImageMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without crashing", () => {
    render(<AttachFile onSelectImage={onSelectImageMock} />);
    expect(screen.getByLabelText("Attach file")).toBeInTheDocument();
    expect(screen.getByTestId("paper-clip-icon")).toBeInTheDocument();
  });

  it("shows options menu when button is clicked", () => {
    render(<AttachFile onSelectImage={onSelectImageMock} />);

    const button = screen.getByLabelText("Attach file");
    fireEvent.click(button);

    expect(screen.getByText("Upload")).toBeVisible();
  });

  it("hides options menu when clicking outside", () => {
    const { container } = render(
      <AttachFile onSelectImage={onSelectImageMock} />
    );

    // First show the menu
    const button = screen.getByLabelText("Attach file");
    fireEvent.click(button);

    // Then click outside
    fireEvent.click(document.body);

    // Menu should now be hidden
    const menu = container.querySelector("ul");
    expect(menu).toHaveClass("hidden");
  });

  it("toggles menu visibility on button click", () => {
    const { container } = render(
      <AttachFile onSelectImage={onSelectImageMock} />
    );
    const menu = container.querySelector("ul");
    const button = screen.getByLabelText("Attach file");

    // Menu should be hidden initially
    expect(menu).toHaveClass("hidden");

    // Click to show menu
    fireEvent.click(button);
    expect(menu).not.toHaveClass("hidden");

    // Click again to hide menu
    fireEvent.click(button);
    expect(menu).toHaveClass("hidden");
  });
});
