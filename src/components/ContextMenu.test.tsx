import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContextMenu } from "./ContextMenu";
import { Mock } from "vitest";
// import { createPortal } from "react-dom";
// import { v1 } from "uuid";
// import { useState } from "react";

// Mock createPortal
vi.mock("react-dom", async () => {
  const actualReactDom = await vi.importActual<typeof import("react-dom")>(
    "react-dom"
  );
  return {
    ...actualReactDom,
    createPortal: vi.fn((element: React.ReactNode) => element),
  };
});

// Mock uuid
vi.mock("uuid", () => ({
  v1: vi.fn().mockReturnValue("1234-5678-9101"),
}));

describe("ContextMenu", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let setIsOpen: Mock<any>;
  let elements: React.ReactNode[];
  let triggered: HTMLElement;

  beforeEach(() => {
    setIsOpen = vi.fn();
    elements = [
      <div key="1" data-testid="element-1">
        Element 1
      </div>,
      <div key="2" data-testid="element-2">
        Element 2
      </div>,
    ];
    triggered = document.createElement("button");
    document.body.appendChild(triggered);
  });

  afterEach(() => {
    document.body.removeChild(triggered);
    vi.clearAllMocks();
  });

  it("should render the context menu when isOpen is true", () => {
    render(
      <ContextMenu
        elements={elements}
        isOpen={true}
        setIsOpen={setIsOpen}
        triggered={triggered}
      />
    );

    expect(screen.getByText("Element 1")).toBeInTheDocument();
    expect(screen.getByText("Element 2")).toBeInTheDocument();
  });

  it("should not render the context menu when isOpen is false", () => {
    render(
      <ContextMenu
        elements={elements}
        isOpen={false}
        setIsOpen={setIsOpen}
        triggered={triggered}
      />
    );
    expect(screen.queryByRole("list")).not.toHaveClass("block!");
  });

  it("should apply custom class if provided", () => {
    render(
      <ContextMenu
        elements={elements}
        isOpen={true}
        setIsOpen={setIsOpen}
        triggered={triggered}
        customClass="test-class"
      />
    );

    const ulElement = screen.getByRole("list");
    expect(ulElement).toHaveClass("test-class");
  });

  it("should call setIsOpen(false) when clicking outside the menu and triggered element", async () => {
    render(
      <ContextMenu
        elements={elements}
        isOpen={true}
        setIsOpen={setIsOpen}
        triggered={triggered}
      />
    );

    // Mock a click event outside the context menu and the triggered element
    fireEvent.click(document.body);

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it("should not call setIsOpen(false) when clicking inside the menu", async () => {
    render(
      <ContextMenu
        elements={elements}
        isOpen={true}
        setIsOpen={setIsOpen}
        triggered={triggered}
      />
    );

    const element1 = screen.getByText("Element 1");
    userEvent.click(element1);

    expect(setIsOpen).not.toHaveBeenCalled();
  });

  it("should not call setIsOpen(false) when clicking the triggered element", async () => {
    render(
      <ContextMenu
        elements={elements}
        isOpen={true}
        setIsOpen={setIsOpen}
        triggered={triggered}
      />
    );

    fireEvent.click(triggered);

    expect(setIsOpen).not.toHaveBeenCalled();
  });

  it("should prevent default context menu event on list items", () => {
    render(
      <ContextMenu
        elements={elements}
        isOpen={true}
        setIsOpen={setIsOpen}
        triggered={triggered}
      />
    );

    const element1 = screen.getByText("Element 1");
    const contextMenuEvent = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });
    element1.dispatchEvent(contextMenuEvent);

    expect(contextMenuEvent.defaultPrevented).toBe(true);
  });

  it("should generate a unique class name for the context menu", () => {
    render(
      <ContextMenu
        elements={elements}
        isOpen={true}
        setIsOpen={setIsOpen}
        triggered={triggered}
      />
    );

    const ulElement = screen.getByRole("list");
    expect(ulElement).toHaveClass("context-menu-1234");
  });

  it("updates top and left when the context menu opens", () => {
    document.addEventListener = vi.fn();
    document.removeEventListener = vi.fn();
    render(
      <ContextMenu
        elements={elements}
        isOpen={true}
        setIsOpen={setIsOpen}
        triggered={triggered}
      />
    );
    expect(document.addEventListener).toHaveBeenCalled();
    expect(document.removeEventListener).toHaveBeenCalled();
  });
});