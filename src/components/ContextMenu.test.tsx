import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { ContextMenu } from "./ContextMenu";
import { ReactNode } from "react";
import { v1 } from "uuid";

// filepath: c:\Users\Luisghtz\dev\react\myaichat\src\components\ContextMenu.test.tsx

// Mock react-dom's createPortal to render children directly
vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return {
    ...actual,
    createPortal: (children: ReactNode) => children,
  };
});

vi.mock("uuid");
const mockUuidV1 = v1 as unknown as Mock;

describe("ContextMenu", () => {
  describe("handleContextMenu positioning", () => {
    let mockSetIsOpen: ReturnType<typeof vi.fn>;
    const initialElements = [
      <div key="1">Item 1</div>,
      <div key="2">Item 2</div>,
    ];
    const additionalOffset = 10; // As defined in the component
    let expectedMenuClass: string;

    beforeEach(() => {
      mockSetIsOpen = vi.fn();
      // Reset and setup uuid mock for consistent class names
      // v1() is called for initial state, then in useEffect for className.
      // We want the part used for className (split('-')[0]) to be consistent.
      mockUuidV1.mockReturnValue("fixedpart-abcdef-12345");
      expectedMenuClass = `context-menu-${mockUuidV1().split("-")[0]}`; // context-menu-fixedpart
    });

    afterEach(() => {
      vi.restoreAllMocks();
      document.body.innerHTML = ""; // Clean up any direct body manipulations if any
    });

    const renderAndGetMenu = (isOpen: boolean) => {
      const { container } = render(
        <ContextMenu
          elements={initialElements}
          isOpen={isOpen}
          setIsOpen={mockSetIsOpen}
        />
      );
      // The class name is set after an effect, query for the final class name.
      const menuElement = container.querySelector(`.${expectedMenuClass}`);
      return menuElement;
    };

    it("should position the menu at event coordinates if it fits", () => {
      const mockUlClientHeight = 100;
      const mockUlClientWidth = 150;
      vi.spyOn(window, "innerHeight", "get").mockReturnValue(700);
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(1200);

      const eventPageY = 200;
      const eventPageX = 300;

      const menuElement = renderAndGetMenu(true);
      expect(menuElement).toBeInTheDocument();

      Object.defineProperty(menuElement!, "clientHeight", {
        value: mockUlClientHeight,
      });
      Object.defineProperty(menuElement!, "clientWidth", {
        value: mockUlClientWidth,
      });

      fireEvent.contextMenu(document, {
        clientX: eventPageX,
        clientY: eventPageY,
      });

      expect(menuElement).toHaveStyle(`top: ${eventPageY}px`);
      expect(menuElement).toHaveStyle(`left: ${eventPageX}px`);
    });

    it("should adjust top position if menu overflows vertically", () => {
      const mockUlClientHeight = 100;
      const mockUlClientWidth = 150;
      const windowHeight = 500;
      vi.spyOn(window, "innerHeight", "get").mockReturnValue(windowHeight);
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(800);

      const eventPageY = 450; // 450 + 100 = 550, overflows 500
      const eventPageX = 300;

      const menuElement = renderAndGetMenu(true);
      expect(menuElement).toBeInTheDocument();

      Object.defineProperty(menuElement!, "clientHeight", {
        value: mockUlClientHeight,
      });
      Object.defineProperty(menuElement!, "clientWidth", {
        value: mockUlClientWidth,
      });

      fireEvent.contextMenu(document, {
        clientX: eventPageX,
        clientY: eventPageY,
      });

      const expectedTop =
        windowHeight - (mockUlClientHeight + additionalOffset); // 500 - (100 + 10) = 390
      expect(menuElement).toHaveStyle(`top: ${expectedTop}px`);
      expect(menuElement).toHaveStyle(`left: ${eventPageX}px`);
    });

    it("should adjust left position if menu overflows horizontally", () => {
      const mockUlClientHeight = 100;
      const mockUlClientWidth = 150;
      const windowWidth = 800;
      vi.spyOn(window, "innerHeight", "get").mockReturnValue(600);
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(windowWidth);

      const eventPageY = 200;
      const eventPageX = 700; // 700 + 150 = 850, overflows 800

      const menuElement = renderAndGetMenu(true);
      expect(menuElement).toBeInTheDocument();

      Object.defineProperty(menuElement!, "clientHeight", {
        value: mockUlClientHeight,
      });
      Object.defineProperty(menuElement!, "clientWidth", {
        value: mockUlClientWidth,
      });

      fireEvent.contextMenu(document, {
        clientX: eventPageX,
        clientY: eventPageY,
      });

      const expectedLeft = windowWidth - (mockUlClientWidth + additionalOffset); // 800 - (150 + 10) = 640
      expect(menuElement).toHaveStyle(`top: ${eventPageY}px`);
      expect(menuElement).toHaveStyle(`left: ${expectedLeft}px`);
    });

    it("should adjust both top and left positions if menu overflows in both directions", () => {
      const mockUlClientHeight = 100;
      const mockUlClientWidth = 150;
      const windowHeight = 500;
      const windowWidth = 800;
      vi.spyOn(window, "innerHeight", "get").mockReturnValue(windowHeight);
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(windowWidth);

      const eventPageY = 450; // Overflows vertically
      const eventPageX = 700; // Overflows horizontally

      const menuElement = renderAndGetMenu(true);
      expect(menuElement).toBeInTheDocument();

      Object.defineProperty(menuElement!, "clientHeight", {
        value: mockUlClientHeight,
      });
      Object.defineProperty(menuElement!, "clientWidth", {
        value: mockUlClientWidth,
      });

      fireEvent.contextMenu(document, {
        clientX: eventPageX,
        clientY: eventPageY,
      });

      const expectedTop =
        windowHeight - (mockUlClientHeight + additionalOffset);
      const expectedLeft = windowWidth - (mockUlClientWidth + additionalOffset);
      expect(menuElement).toHaveStyle(`top: ${expectedTop}px`);
      expect(menuElement).toHaveStyle(`left: ${expectedLeft}px`);
    });

    it("should not apply positioning logic if isOpen is false", () => {
      const menuElement = renderAndGetMenu(false);
      expect(menuElement).toBeInTheDocument(); // It's rendered due to portal mock

      // When isOpen is false, useEffect sets top/left to 0 and returns.
      // The event listener for positioning handleContextMenu is not added.
      expect(menuElement).toHaveStyle("top: 0px");
      expect(menuElement).toHaveStyle("left: 0px");

      // Mock clientHeight/Width for completeness, though they shouldn't be used
      Object.defineProperty(menuElement!, "clientHeight", { value: 100 });
      Object.defineProperty(menuElement!, "clientWidth", { value: 150 });

      // Fire event
      fireEvent.contextMenu(document, { clientX: 200, clientY: 300 });

      // Position should remain 0,0 as the specific handler isn't active
      expect(menuElement).toHaveStyle("top: 0px");
      expect(menuElement).toHaveStyle("left: 0px");
    });
  });
});
