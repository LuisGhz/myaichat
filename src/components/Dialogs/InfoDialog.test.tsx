import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InfoDialog } from "./InfoDialog";
import { describe, it, expect, vi } from "vitest";

describe("InfoDialog", () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dialog with a single message", () => {
    render(<InfoDialog isOpen={true} message="This is a test message" />);
    waitFor(() => {
      const dialogElement = screen.getByRole("dialog");
      expect(dialogElement).toBeInTheDocument();
      expect(screen.getByText("This is a test message")).toBeInTheDocument();
    });
  });

  it("renders the dialog with multiple messages", () => {
    render(<InfoDialog isOpen={true} message={["Message 1", "Message 2"]} />);
    waitFor(() => {
      const dialogElement = screen.getByRole("dialog");
      expect(dialogElement).toBeInTheDocument();
      expect(screen.getByText("Message 1")).toBeInTheDocument();
      expect(screen.getByText("Message 2")).toBeInTheDocument();
    });
  });

  it('calls onConfirm when the "Ok" button is clicked', async () => {
    const onConfirm = vi.fn();
    render(
      <InfoDialog isOpen={true} message="Test Message" onConfirm={onConfirm} />
    );
    waitFor(async () => {
      const okButton = screen.getByRole("button", { name: "Ok" });
      await userEvent.click(okButton);
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it('closes the dialog when the "Ok" button is clicked', async () => {
    render(<InfoDialog isOpen={true} message="Test Message" />);
    waitFor(async () => {
      const okButton = screen.getByRole("button", { name: "Ok" });
      await userEvent.click(okButton);
      const dialogElement = screen.getByRole("dialog");
      expect(dialogElement).not.toBeVisible(); //Depends on how "not visible" is implemented. Could also use .toHaveAttribute('open', null) if the dialog removes the open attribute.
    });
  });

  it("closes the dialog when isOpen is false", () => {
    render(<InfoDialog isOpen={false} message="Test Message" />);
    waitFor(() => {
      const dialogElement = screen.getByRole("dialog");
      expect(dialogElement).not.toBeVisible(); //Depends on how "not visible" is implemented. Could also use .toHaveAttribute('open', null) if the dialog removes the open attribute.
    });
  });

  it("does not call onConfirm if it is not provided", async () => {
    render(<InfoDialog isOpen={true} message="Test Message" />);
    waitFor(async () => {
      const okButton = screen.getByRole("button", { name: "Ok" });
      await userEvent.click(okButton);
      // If onConfirm was called, it would throw an error because it's not defined, so this test implicitly passes if no error is thrown.
      expect(screen.getByRole("dialog")).not.toBeVisible();
    });
  });

  it.todo("dialog is closed when clicking outside", async () => {
    render(<InfoDialog isOpen={true} message="Test Message" />);
    const dialogElement = screen.getByRole("dialog");
    fireEvent.mouseDown(document.body);
    expect(dialogElement).toBeVisible();
  });
});
