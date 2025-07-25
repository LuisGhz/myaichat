import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useContextMenu } from "./useContextMenu";

describe("useContextMenu", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls callback after 500ms onTouchStart", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useContextMenu());
    const target = document.createElement("div");
    const event = { target } as unknown as React.TouchEvent<HTMLElement>;

    act(() => {
      result.current.onTouchStart(event, callback);
      vi.advanceTimersByTime(499);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("clears timeout onTouchEnd", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useContextMenu());
    const target = document.createElement("div");
    const event = { target } as unknown as React.TouchEvent<HTMLElement>;

    act(() => {
      result.current.onTouchStart(event, callback);
      result.current.onTouchEnd(event);
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();
  });
});
