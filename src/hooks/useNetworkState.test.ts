import { renderHook, act } from "@testing-library/react";
import { useNetworkState } from "./useNetworkState";

// filepath: c:\Users\Luisghtz\dev\react\myaichat\src\hooks\useNetworkState.test.ts

describe("useNetworkState", () => {
  it("should initialize with the correct offline status", () => {
    const { result } = renderHook(() => useNetworkState());
    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    expect(result.current.isOffline).toBe(false);
  });

  it("should update isOffline to true when the browser goes offline", () => {
    const { result } = renderHook(() => useNetworkState());
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(result.current.isOffline).toBe(true);
  });

  it("should update isOffline to false when the browser comes online", () => {
    const { result } = renderHook(() => useNetworkState());
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(result.current.isOffline).toBe(true);
    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    expect(result.current.isOffline).toBe(false);
  });

  it("should remove event listeners on unmount", () => {
    const { unmount } = renderHook(() => useNetworkState());
    const spy = vi.spyOn(window, "removeEventListener");
    unmount();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, "online", expect.any(Function));
    expect(spy).toHaveBeenNthCalledWith(2, "offline", expect.any(Function));
  });
});
