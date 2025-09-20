import { renderHook, act } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { useAudioLevel } from './useAudioLevel';

// Minimal mock for AnalyserNode and AudioContext
class MockAnalyser {
  fftSize = 1024;
  smoothingTimeConstant = 0.85;
  getFloatTimeDomainData(arr: Float32Array) {
    // fill with a small sine-like amplitude to simulate signal
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (i % 2 === 0 ? 0.1 : -0.1);
    }
  }
  connect() {}
  disconnect() {}
}

class MockSource {
  constructor(_stream: MediaStream) {
    // mark param as used to satisfy lint rules
    void _stream;
  }
  connect() {}
  disconnect() {}
}

class MockAudioContext {
  sampleRate = 44100;
  createMediaStreamSource(stream: MediaStream) {
    return new MockSource(stream) as unknown as MediaStreamAudioSourceNode;
  }
  createAnalyser() {
    return new MockAnalyser() as unknown as AnalyserNode;
  }
  close() {
    return Promise.resolve();
  }
}

describe('useAudioLevel', () => {
  let originalAC: unknown;
  const G = globalThis as unknown as Record<string, unknown>;

  beforeEach(() => {
  originalAC = G['AudioContext'];
  G['AudioContext'] = MockAudioContext;

    // Stub requestAnimationFrame/cancelAnimationFrame to deterministic behavior
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      const id = setTimeout(() => cb(performance.now()));
      return id as unknown as number;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      clearTimeout(id as unknown as number);
    });

    // Provide a minimal MediaStream stub for the test environment
    vi.stubGlobal('MediaStream', class {
      // allow construction with nothing
      constructor() {}
    } as unknown as typeof MediaStream);
  });

  afterEach(() => {
  G['AudioContext'] = originalAC;
    vi.restoreAllMocks();
  });

  it('returns 0 when inactive or no stream', () => {
    const { result, rerender, unmount } = renderHook(({ stream, active }) => useAudioLevel(stream, active), {
      initialProps: { stream: null as MediaStream | null, active: false },
    });

    expect(result.current).toBe(0);

    // active but no stream
    rerender({ stream: null, active: true });
    expect(result.current).toBe(0);

    unmount();
  });

  it('updates level when active with a stream and cleans up', async () => {
    // fake a MediaStream object
    const fakeStream = new MediaStream();

    const { result, rerender, unmount } = renderHook(
      ({ stream, active }) => useAudioLevel(stream, active),
      { initialProps: { stream: null as MediaStream | null, active: false } }
    );

    // activate with stream
    await act(async () => {
      rerender({ stream: fakeStream, active: true });
      // wait briefly for our mocked RAF to run
      await new Promise((r) => setTimeout(r, 20));
    });

    // level should be a number between 0 and 1
    expect(typeof result.current).toBe('number');
    expect(result.current).toBeGreaterThanOrEqual(0);
    expect(result.current).toBeLessThanOrEqual(1);

    // deactivate and ensure it resets to 0
    await act(async () => {
      rerender({ stream: fakeStream, active: false });
      await new Promise((r) => setTimeout(r, 10));
    });
    expect(result.current).toBe(0);

    unmount();
  });

  it('handles missing AudioContext gracefully', () => {
    // remove AudioContext
  G['AudioContext'] = undefined;
    const fakeStream = new MediaStream();
    const { result } = renderHook(({ stream, active }) => useAudioLevel(stream, active), {
      initialProps: { stream: fakeStream, active: true },
    });
    // fallback: should still return 0 when no AudioContext
    expect(result.current).toBe(0);
  });
});
