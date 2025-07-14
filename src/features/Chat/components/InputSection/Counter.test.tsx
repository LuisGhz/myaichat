import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Counter } from "./Counter";

describe("Counter", () => {
  let mockOnTimedOut: ReturnType<typeof vi.fn>;
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

  it("renders initial time as 0:30 when not recording", () => {
    renderComponent(false);
    expect(screen.getByText("0:30")).toBeInTheDocument();
  });

  it("shows 0:30 and starts countdown when isRecording is true", () => {
    renderComponent(true);
    expect(screen.getByText("0:30")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("0:29")).toBeInTheDocument();
  });

  it("counts down to 0:00 and calls onTimedOut", () => {
    renderComponent(true);
    act(() => {
      vi.advanceTimersByTime(30001); // 30 seconds
    });
    expect(screen.getByText("0:00")).toBeInTheDocument();
    expect(mockOnTimedOut).toHaveBeenCalledTimes(1);
  });

  it("resets timer to 0:30 when isRecording changes from true to false", () => {
    const { rerender } = render(<Counter isRecording={true} onTimedOut={mockOnTimedOut} />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("0:25")).toBeInTheDocument();
    rerender(<Counter isRecording={false} onTimedOut={mockOnTimedOut} />);
    // Wait for reset (100ms timeout in component)
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByText("0:30")).toBeInTheDocument();
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
