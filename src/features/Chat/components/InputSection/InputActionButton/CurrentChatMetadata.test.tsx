import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as chatStoreModule from "store/app/ChatStore";
import * as metadataHookModule from "features/Chat/hooks/useCurrentChatMetadata";
import * as iconModule from "icons/ExclamationCircleIcon";
import { CurrentChatMetadata } from "./CurrentChatMetadata";

describe("CurrentChatMetadata", () => {
  const renderComponent = (buttonClassName?: string) =>
    render(<CurrentChatMetadata buttonClassName={buttonClassName} />);

  beforeEach(() => {
    vi.restoreAllMocks();

    // Provide a simple icon implementation for all tests
    vi.spyOn(iconModule, "ExclamationCircleIcon").mockImplementation((props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid="exclamation-icon" {...props} />
    ));

    // Mock getBBox used by ResizeObserver in jsdom when measuring SVGs
    // Provide a minimal implementation to avoid "getBBox is not a function" errors
  (SVGElement.prototype as unknown as { getBBox?: () => DOMRect }).getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 } as unknown as DOMRect);
  });

  afterEach(() => {
    // cleanup handled by testing-library's automatic cleanup
    // remove getBBox mock
    try {
      delete (SVGElement.prototype as unknown as { getBBox?: () => DOMRect }).getBBox;
    } catch {
      /* ignore */
    }
  });

  it("renders nothing when there's no currentChatMetadata", () => {
    // Arrange: mock store to return null metadata
  vi.spyOn(chatStoreModule, "useChatStore").mockReturnValue({ currentChatMetadata: null } as unknown as ReturnType<typeof chatStoreModule.useChatStore>);

  // Act
  const { container } = renderComponent();

  // Assert: component renders null (no icon present)
  expect(container).toBeEmptyDOMElement();
  });

  it("renders icon and shows popover content when metadata exists", async () => {
    // Arrange: set up metadata

    const metadata = {
      totalPromptTokens: 10,
      totalCompletionTokens: 20,
      model: "gpt-test-model",
    };

    vi.spyOn(chatStoreModule, "useChatStore").mockReturnValue({ currentChatMetadata: metadata } as unknown as ReturnType<typeof chatStoreModule.useChatStore>);

    // mock hook that provides formatting and calculation functions
    vi.spyOn(metadataHookModule, "useCurrentChatMetadata").mockReturnValue({
      formatCost: (v: number) => `$${v.toFixed(4)}`,
      calculatePromptTokens: (n: number) => n * 0.001,
      calculateCompletionTokens: (n: number) => n * 0.002,
    } as unknown as ReturnType<typeof metadataHookModule.useCurrentChatMetadata>);

    // Act
    renderComponent("btn-class");

    // Icon should be in the document
  const icon = screen.getByTestId("exclamation-icon");
  expect(icon).toBeInTheDocument();

  // Simulate user hover to open popover. Antd Popover renders content in a portal and may be async.
  await userEvent.hover(icon);

  // The popover content should show metadata values. Antd Popover sets role="tooltip" on the inner.
  const popover = await screen.findByRole("tooltip");
  expect(popover).toBeInTheDocument();

  const text = popover.textContent ?? "";
  expect(text).toMatch(/Total Prompt Tokens/i);
  expect(text).toMatch(/Total Completion Tokens/i);
  expect(text).toMatch(/Prompt cost/i);
  expect(text).toMatch(/Completion cost/i);
  expect(text).toMatch(/gpt-test-model/);

  // Check computed values are displayed within the popover text
  expect(text).toMatch(/10/);
  expect(text).toMatch(/20/);
  expect(text).toMatch(/\$0\.0100/);
  expect(text).toMatch(/\$0\.0400/);
  });
});
