/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputSection } from "./InputSection";

// Mock dependencies
vi.mock("hooks/useAttachedFilesValidator", () => ({
  useAttachedFilesValidator: () => ({ validateFiles: () => true }),
}));

vi.mock("./Microphone", () => ({
  Microphone: ({ onTranscription }: any) => (
    <button
      data-testid="mic-btn"
      onClick={() => onTranscription("transcribed text")}
    >
      Mic
    </button>
  ),
}));

// Mock react-router hooks and components
vi.mock("react-router", () => ({
  useParams: () => ({}),
  Link: ({ children }: any) => <>{children}</>,
}));

describe("InputSection", () => {
  const onEnter = vi.fn();

  beforeAll(() => {
    URL.createObjectURL = vi.fn(() => "blob://test-url");
    URL.revokeObjectURL = vi.fn(() => {});
  });

  beforeEach(() => {
    onEnter.mockClear();
    // reset window size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  test("renders and shows send button only after typing", async () => {
    render(<InputSection onEnter={onEnter} isSending={false} />);
    expect(screen.queryByLabelText("Send message")).toBeNull();
    const textarea = screen.getByRole("textbox", { name: /Message input/i });
    await userEvent.type(textarea, "Hello");
    expect(screen.getByLabelText("Send message")).toBeInTheDocument();
  });

  test("clicking send calls onEnter and clears input", async () => {
    render(<InputSection onEnter={onEnter} isSending={false} />);
    const textarea = screen.getByRole("textbox", { name: /Message input/i });
    await userEvent.type(textarea, "Test message");
    const sendBtn = screen.getByLabelText("Send message");
    await userEvent.click(sendBtn);
    expect(onEnter).toHaveBeenCalledWith("Test message", undefined);
    expect(textarea).toHaveValue("");
    expect(screen.queryByLabelText("Send message")).toBeNull();
  });

  test("pressing Enter without shift sends message", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    });
    render(<InputSection onEnter={onEnter} isSending={false} />);
    const textarea = screen.getByRole("textbox", { name: /Message input/i });
    fireEvent.change(textarea, { target: { value: "Enter message" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });
    expect(onEnter).toHaveBeenCalledWith("Enter message", undefined);
  });

  test("pressing Enter with shift does not send", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    });
    render(<InputSection onEnter={onEnter} isSending={false} />);
    const textarea = screen.getByRole("textbox", { name: /Message input/i });
    fireEvent.change(textarea, { target: { value: "No send" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
    expect(onEnter).not.toHaveBeenCalled();
  });

  test("onTranscription updates input", async () => {
    render(<InputSection onEnter={onEnter} isSending={false} />);
    const micBtn = screen.getByTestId("mic-btn");
    await userEvent.click(micBtn);
    const textarea = screen.getByRole("textbox", { name: /Message input/i });
    expect(textarea).toHaveValue("transcribed text");
    expect(screen.getByLabelText("Send message")).toBeInTheDocument();
  });

  test("file selection displays image and allows removal", async () => {
    render(<InputSection onEnter={onEnter} isSending={false} />);
    const attachBtn = screen.getByLabelText("Attach file");
    await userEvent.click(attachBtn);
    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    // image should appear
    const img = await screen.findByAltText("Selected attachment");
    expect(img).toHaveAttribute("src", "blob://test-url");
    // remove image
    const removeBtn = screen.getByLabelText("Remove image");
    await userEvent.click(removeBtn);
    expect(screen.queryByAltText("Selected attachment")).toBeNull();
  });

  test("Send message with image", async () => {
    render(<InputSection onEnter={onEnter} isSending={false} />);
    const textarea = screen.getByRole("textbox", { name: /Message input/i });
    await userEvent.type(textarea, "Test message with image");
    const attachBtn = screen.getByLabelText("Attach file");
    await userEvent.click(attachBtn);
    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    const sendBtn = screen.getByLabelText("Send message");
    await userEvent.click(sendBtn);
    expect(onEnter).toHaveBeenCalledWith(
      "Test message with image",
      expect.any(File)
    );
  });

  test("Textarea shouldn't allow more than 8,000 characters", async () => {
    render(<InputSection onEnter={onEnter} isSending={false} />);
    const textarea = screen.getByRole("textbox", { name: /Message input/i });
    const longText = "a".repeat(8010);
    await userEvent.click(textarea);
    await userEvent.paste(longText);
    expect(textarea).toHaveValue(longText.slice(0, 8000));
  });
});
