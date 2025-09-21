import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { useAttachedFilesValidator } from "./useAttachedFileValidator";

// Helper to create a fake File with given size and type
const createFile = (sizeInBytes: number, type: string, name = "file") => {
  // Blob accepts an array of parts; create a Uint8Array of the required size
  const blob = new Blob([new Uint8Array(sizeInBytes)], { type });
  return new File([blob], name, { type });
};

describe("useAttachedFilesValidator", () => {
  let validateFiles: (file: File) => boolean;

  beforeEach(() => {
    const hook = useAttachedFilesValidator();
    validateFiles = hook.validateFiles;
  });

  afterEach(() => {
    // no-op for now but kept for symmetry and future teardown
  });

  it("accepts allowed image types under or equal to max size", () => {
    // MB constant in hook is 2 -> max size = 2 * 1024 * 1024
    const maxSize = 2 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    for (const t of allowedTypes) {
      const f = createFile(maxSize, t, `ok-${t}`);
      expect(validateFiles(f)).toBe(true);
      // also try one byte less than max
      const f2 = createFile(maxSize - 1, t, `ok2-${t}`);
      expect(validateFiles(f2)).toBe(true);
    }
  });

  it("rejects files over the max size even if type is allowed", () => {
    const maxSize = 2 * 1024 * 1024;
    const f = createFile(maxSize + 1, "image/png", "too-large.png");
    expect(validateFiles(f)).toBe(false);
  });

  it("rejects disallowed mime types even if size is small", () => {
    const smallSize = 100;
    const disallowed = [
      "text/plain",
      "application/pdf",
      "video/mp4",
      "image/webp",
    ];
    for (const t of disallowed) {
      const f = createFile(smallSize, t, `bad-${t}`);
      expect(validateFiles(f)).toBe(false);
    }
  });
});
