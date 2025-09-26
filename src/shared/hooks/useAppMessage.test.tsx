import { renderHook, act } from "@testing-library/react";
import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";

// The hook we are testing
import { useAppMessage } from "./useAppMessage";

// We'll mock the store module that exports useAppStore
const mockUseAppStore = vi.fn();

vi.mock("store/app/AppStore", () => ({
  useAppStore: () => mockUseAppStore(),
}));

describe("useAppMessage", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let messageApiMock: any;

  beforeEach(() => {
    messageApiMock = {
      info: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    };

    // Default mock returns messageApi
    mockUseAppStore.mockReturnValue({ messageApi: messageApiMock });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  function renderHookInstance() {
    return renderHook(() => useAppMessage());
  }

  it("calls messageApi.info with correct payload when infoMessage is called", () => {
    const { result } = renderHookInstance();

    act(() => {
      result.current.infoMessage("hello info");
    });

    expect(messageApiMock.info).toHaveBeenCalledTimes(1);
    expect(messageApiMock.info).toHaveBeenCalledWith({
      type: "info",
      content: "hello info",
      duration: 3,
    });
  });

  it("calls messageApi.success with correct payload when successMessage is called", () => {
    const { result } = renderHookInstance();

    act(() => {
      result.current.successMessage("yay");
    });

    expect(messageApiMock.success).toHaveBeenCalledTimes(1);
    expect(messageApiMock.success).toHaveBeenCalledWith({
      type: "success",
      content: "yay",
      duration: 3,
    });
  });

  it("calls messageApi.error with correct payload when errorMessage is called", () => {
    const { result } = renderHookInstance();

    act(() => {
      result.current.errorMessage("oops");
    });

    expect(messageApiMock.error).toHaveBeenCalledTimes(1);
    expect(messageApiMock.error).toHaveBeenCalledWith({
      type: "error",
      content: "oops",
      duration: 4,
    });
  });

  it("calls messageApi.warning with correct payload when warningMessage is called", () => {
    const { result } = renderHookInstance();

    act(() => {
      result.current.warningMessage("be careful");
    });

    expect(messageApiMock.warning).toHaveBeenCalledTimes(1);
    expect(messageApiMock.warning).toHaveBeenCalledWith({
      type: "warning",
      content: "be careful",
      duration: 4,
    });
  });

  it("does not throw when messageApi is undefined", () => {
    // Simulate missing messageApi
    mockUseAppStore.mockReturnValue({ messageApi: undefined });

    const { result } = renderHookInstance();

    expect(() => result.current.infoMessage("no api")).not.toThrow();
    expect(() => result.current.successMessage("no api")).not.toThrow();
    expect(() => result.current.errorMessage("no api")).not.toThrow();
    expect(() => result.current.warningMessage("no api")).not.toThrow();
  });
});
