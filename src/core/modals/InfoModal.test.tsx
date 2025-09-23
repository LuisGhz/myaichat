import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { InfoModal } from "./InfoModal";

type InfoModalProps = {
  message: string | string[];
  onConfirm?: () => void;
  isOpen: boolean;
};

function renderComponent(overrides?: Partial<InfoModalProps>) {
  const props: InfoModalProps = {
    message: "Default message",
    isOpen: true,
    onConfirm: undefined,
    ...overrides,
  };

  return render(<InfoModal {...props} />);
}

describe("InfoModal", () => {
  const origShowModal = HTMLDialogElement.prototype.showModal;
  const origClose = HTMLDialogElement.prototype.close;

  beforeEach(() => {
    // Provide deterministic showModal/close behaviour in jsdom
    HTMLDialogElement.prototype.showModal = vi.fn(function (
      this: HTMLDialogElement
    ) {
      // emulate native behaviour of setting open
      this.open = true;
    }) as unknown as typeof HTMLDialogElement.prototype.showModal;

    HTMLDialogElement.prototype.close = vi.fn(function (
      this: HTMLDialogElement
    ) {
      this.open = false;
    }) as unknown as typeof HTMLDialogElement.prototype.close;
  });

  afterEach(() => {
    // restore originals
    HTMLDialogElement.prototype.showModal = origShowModal;
    HTMLDialogElement.prototype.close = origClose;
    vi.restoreAllMocks();
  });

  it("renders a single message and calls showModal when open", () => {
    renderComponent({ message: "Hello world", isOpen: true });

    // message is rendered
    expect(screen.getByText("Hello world")).toBeInTheDocument();

    // showModal should have been called on mount
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it("renders multiple messages when message is an array", () => {
    const messages = ["First", "Second", "Third"];
    renderComponent({ message: messages, isOpen: true });

    // each message is rendered
    messages.forEach((m) => expect(screen.getByText(m)).toBeInTheDocument());
  });

  it("calls close and onConfirm when Ok is clicked", async () => {
    const user = userEvent.setup();
    const onConfirmMock = vi.fn();

    renderComponent({
      message: "Click test",
      isOpen: true,
      onConfirm: onConfirmMock,
    });

    const okButton = screen.getByRole("button", { name: /ok/i });
    await user.click(okButton);

    // close should be called
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();

    // onConfirm should be invoked
    expect(onConfirmMock).toHaveBeenCalled();
  });

  it("does not call showModal when isOpen is false", () => {
    renderComponent({ message: "closed", isOpen: false });

    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
  });
});
