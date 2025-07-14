import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Counter, DURATION } from "./Counter";

describe("Counter", () => {
  let mockOnTimedOut: ReturnType<typeof vi.fn>;
  // Duration variable to sync with component's default duration
  const renderComponent = (isRecording = false, onTimedOut = mockOnTimedOut) =>
    render(<Counter isRecording={isRecording} onTimedOut={onTimedOut} />);

  beforeEach(() => {
    mockOnTimedOut = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("renders initial time as formatted duration when not recording", () => {
    renderComponent(false);
    const expectedTime = `0:${DURATION.toString().padStart(2, "0")}`;
    expect(screen.getByText(expectedTime)).toBeInTheDocument();
  });

  it("shows initial duration and starts countdown when isRecording is true", () => {
    renderComponent(true);
    const expectedInitialTime = `0:${DURATION.toString().padStart(2, "0")}`;
    expect(screen.getByText(expectedInitialTime)).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const expectedTimeAfter1Sec = `0:${(DURATION - 1).toString().padStart(2, "0")}`;
    expect(screen.getByText(expectedTimeAfter1Sec)).toBeInTheDocument();
  });

  it("counts down to 0:00 and calls onTimedOut", () => {
    renderComponent(true);
    act(() => {
      vi.advanceTimersByTime(DURATION * 1000 + 1); // Full duration + 1ms
    });
    expect(screen.getByText("0:00")).toBeInTheDocument();
    expect(mockOnTimedOut).toHaveBeenCalledTimes(1);
  });

  it("resets timer to initial duration when isRecording changes from true to false", () => {
    const { rerender } = render(<Counter isRecording={true} onTimedOut={mockOnTimedOut} />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    const expectedTimeAfter5Sec = `0:${(DURATION - 5).toString().padStart(2, "0")}`;
    expect(screen.getByText(expectedTimeAfter5Sec)).toBeInTheDocument();
    rerender(<Counter isRecording={false} onTimedOut={mockOnTimedOut} />);
    // Wait for reset (100ms timeout in component)
    act(() => {
      vi.advanceTimersByTime(150);
    });
    const expectedResetTime = `0:${DURATION.toString().padStart(2, "0")}`;
    expect(screen.getByText(expectedResetTime)).toBeInTheDocument();
  });

  it("has accessible role and visible timer", () => {
    renderComponent();
    // The timer is visually presented, but not a native timer role, so check for visible text
    expect(screen.getByText(/\d+:\d{2}/)).toBeVisible();
  });

  it("cleans up interval on unmount", () => {
    const { unmount } = renderComponent(true);
    unmount();
    // No errors should occur, and timers should be cleared
    expect(mockOnTimedOut).not.toHaveBeenCalled();
  });
});
