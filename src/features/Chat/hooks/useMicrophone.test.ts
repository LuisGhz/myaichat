import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// Use vi.hoisted to ensure proper initialization order
const { transcribeAudioServiceMock, setIsSendingAudioMock } = vi.hoisted(() => ({
  transcribeAudioServiceMock: vi.fn(),
  setIsSendingAudioMock: vi.fn(),
}));

// Mock the ChatService module
vi.mock("../services/ChatService", () => ({
  transcribeAudioService: transcribeAudioServiceMock,
}));

// Mock the ChatStore module
vi.mock("store/app/ChatStore", () => ({
  useChatStoreActions: () => ({ setIsSendingAudio: setIsSendingAudioMock }),
}));

import { useMicrophone } from "./useMicrophone";
describe("useMicrophone", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("transcribes audio successfully and returns result", async () => {
    const fakeBlob = new Blob(["audio-data"], { type: "audio/wav" });
    const expected: TranscribedRes = { content: "transcribed text" };
    transcribeAudioServiceMock.mockResolvedValue(expected);

    const { result } = renderHook(() => useMicrophone());

    let res: unknown;
    await act(async () => {
      res = await result.current.transcribeAudio(fakeBlob);
    });

    expect(transcribeAudioServiceMock).toHaveBeenCalledWith(fakeBlob);
    expect(setIsSendingAudioMock).toHaveBeenCalledWith(false);
    expect(setIsSendingAudioMock).toHaveBeenCalledTimes(1);
    expect(res).toEqual(expected);
  });

  it("handles errors from transcribeAudioService and still calls setIsSendingAudio(false)", async () => {
    const fakeBlob = new Blob(["audio-data"], { type: "audio/wav" });
    const consoleErrorMock = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    transcribeAudioServiceMock.mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useMicrophone());

    await act(async () => {
      const res = await result.current.transcribeAudio(fakeBlob);
      expect(res).toBeUndefined();
    });

    expect(transcribeAudioServiceMock).toHaveBeenCalledWith(fakeBlob);
    expect(setIsSendingAudioMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorMock).toHaveBeenCalled();
  });
});
