import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PasteFromClipboard } from "./PasteFromClipboard";

// Helper to render component with minimal required props
const renderComponent = (
  props?: Partial<React.ComponentProps<typeof PasteFromClipboard>>
) => {
  const defaultProps: Partial<React.ComponentProps<typeof PasteFromClipboard>> =
    {
      optionsRef: {
        current: document.createElement("div"),
      } as unknown as React.RefObject<HTMLElement | null>,
      setInfoDialogOpen: vi.fn() as unknown as (open: boolean) => void,
      onSelectFile: vi.fn() as unknown as (file: File) => void,
    };

  const finalProps = {
    ...(defaultProps as unknown as Record<string, unknown>),
    ...(props as unknown as Record<string, unknown>),
  } as React.ComponentProps<typeof PasteFromClipboard>;

  return render(<PasteFromClipboard {...finalProps} />);
};

describe("PasteFromClipboard", () => {
  const originalClipboard = (navigator as unknown as { clipboard?: unknown })
    .clipboard;

  beforeEach(() => {
    // ensure clipboard is defined
    (navigator as unknown as { clipboard?: { read?: unknown } }).clipboard = {
      read: vi.fn(),
    };
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    (navigator as unknown as { clipboard?: unknown }).clipboard =
      originalClipboard;
  });

  const setClipboardAndFile = (type: string, size: number) => {
    const bigSize = size * 1024 * 1024;
    const bigArr = new Uint8Array(bigSize);
    const blob = new Blob([bigArr], { type });
    const clipboardItemMock = {
      types: [type],
      getType: vi.fn().mockResolvedValue(blob),
    } as unknown as ClipboardItem;

    (
      navigator as unknown as {
        clipboard?: { read?: (...args: unknown[]) => Promise<unknown> };
      }
    ).clipboard = {
      read: vi.fn().mockResolvedValue([clipboardItemMock]),
    } as unknown as { read: (...args: unknown[]) => Promise<unknown> };
  };

  it("pastes an image from clipboard and calls onSelectFile when image is present and valid", async () => {
    const onSelectFileMock = vi.fn();
    const setInfoDialogOpenMock = vi.fn();

    setClipboardAndFile("image/png", 1);

    // render component with real validateFiles via hook (hook allows 2MB max so 1KB is valid)
    renderComponent({
      onSelectFile: onSelectFileMock,
      setInfoDialogOpen: setInfoDialogOpenMock,
    });

    const li = screen.getByRole("listitem", { name: /paste from clipboard/i });

    await userEvent.click(li);

    // wait for onSelectFile to be called
    await waitFor(() => expect(onSelectFileMock).toHaveBeenCalled());
    expect(setInfoDialogOpenMock).not.toHaveBeenCalled();
  });

  it("opens info dialog when pasted file is invalid", async () => {
    const onSelectFileMock = vi.fn();
    const setInfoDialogOpenMock = vi.fn();

    setClipboardAndFile("image/png", 3); // 3MB exceeds 2MB limit in validator

    renderComponent({
      onSelectFile: onSelectFileMock,
      setInfoDialogOpen: setInfoDialogOpenMock,
    });

    const li = screen.getByRole("listitem", { name: /paste from clipboard/i });

    await userEvent.click(li);

    await waitFor(() =>
      expect(setInfoDialogOpenMock).toHaveBeenCalledWith(true)
    );
    expect(onSelectFileMock).not.toHaveBeenCalled();
  });

  it("does nothing when clipboard has no image types", async () => {
    const onSelectFileMock = vi.fn();
    const setInfoDialogOpenMock = vi.fn();

    setClipboardAndFile("text/plain", 1);

    renderComponent({
      onSelectFile: onSelectFileMock,
      setInfoDialogOpen: setInfoDialogOpenMock,
    });

    const li = screen.getByRole("listitem", { name: /paste from clipboard/i });

    await userEvent.click(li);

    await waitFor(() => expect(onSelectFileMock).not.toHaveBeenCalled());
    expect(setInfoDialogOpenMock).not.toHaveBeenCalled();
  });
});
