import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { useCurrentChatMetadata } from "./useCurrentChatMetadata";

describe("useCurrentChatMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns undefined for calculations when modelName is falsy or unknown", () => {
    const { result } = renderHook(() => useCurrentChatMetadata(""));

    expect(result.current.calculatePromptTokens(1_000_000)).toBeUndefined();
    expect(result.current.calculateCompletionTokens(1_000_000)).toBeUndefined();
  });

  it("calculates prompt and completion costs correctly for a known model", () => {
    // 'GPT 4.1' exists in MODELS with price.input = 2 and price.output = 8
    const { result } = renderHook(() => useCurrentChatMetadata("GPT 4.1"));

    // 500_000 tokens => 0.5 * price
    expect(result.current.calculatePromptTokens(500_000)).toBeCloseTo(1);
    expect(result.current.calculateCompletionTokens(500_000)).toBeCloseTo(4);
  });

  it("formatCost returns '-' for undefined and NaN", () => {
    const { result } = renderHook(() => useCurrentChatMetadata("GPT 4.1"));

    expect(result.current.formatCost(undefined)).toBe("-");
    expect(result.current.formatCost(NaN)).toBe("-");
  });

  it("falls back to numeric toFixed when Intl.NumberFormat throws", () => {
    const { result } = renderHook(() => useCurrentChatMetadata("GPT 4.1"));

    const g = globalThis as unknown as { Intl?: typeof Intl };
    const originalIntl = g.Intl;
    try {
      // Make Intl.NumberFormat throw to force the fallback path
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - replace Intl for test
      g.Intl = { NumberFormat: () => { throw new Error("fail"); } } as unknown as typeof Intl;

      const value = 1.23456;
      expect(result.current.formatCost(value)).toBe(`$${value.toFixed(3)}`);
    } finally {
      // restore
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      g.Intl = originalIntl as unknown as typeof Intl;
    }
  });

  it("returns undefined if total tokens is not a number", () => {
    const { result } = renderHook(() => useCurrentChatMetadata("GPT 4.1"));

    // cast to unknown to avoid using `any` and ts-expect-error
    expect(result.current.calculatePromptTokens(("not-a-number" as unknown) as number)).toBeUndefined();
    expect(result.current.calculateCompletionTokens((undefined as unknown) as number)).toBeUndefined();
  });
});
