import { useAttachedFilesValidator } from "./useAttachedFilesValidator";

describe("useAttachedFilesValidator", () => {
  const { validateFiles } = useAttachedFilesValidator();

  it("should return true for valid file types and sizes", () => {
    const validFile = new File(["b".repeat(2 * 1024 * 1024)], "test.png", {
      type: "image/png",
    });
    expect(validateFiles(validFile)).toBe(true);
  });

  it("should return false for invalid file types", () => {
    const invalidFile = new File([""], "test.txt", {
      type: "text/plain",
    });
    expect(validateFiles(invalidFile)).toBe(false);
  });

  it("should return false for files larger than the maximum size", () => {
    const largeFile = new File(["b".repeat(3 * 1024 * 1024)], "test.png", {
      type: "image/png",
    });
    expect(validateFiles(largeFile)).toBe(false);
  });

  it("should return false for files larger than the maximum size 2.01 mb", () => {
    const largeFile = new File(["b".repeat(2.01 * 1024 * 1024)], "test.png", {
      type: "image/png",
    });
    expect(validateFiles(largeFile)).toBe(false);
  });
});
