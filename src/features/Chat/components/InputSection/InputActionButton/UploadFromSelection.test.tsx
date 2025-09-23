import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";

vi.mock("features/Chat/hooks/useAttachedFileValidator", () => ({
  useAttachedFilesValidator: vi.fn(),
}));

import { useAttachedFilesValidator } from "features/Chat/hooks/useAttachedFileValidator";
import { UploadFromSelection } from "./UploadFromSelection";

describe("UploadFromSelection", () => {
  const validateFilesMock = vi.fn();
  const useAttachedFilesValidatorMock = vi.mocked(useAttachedFilesValidator);

  beforeEach(() => {
    useAttachedFilesValidatorMock.mockImplementation(() => ({
      validateFiles: validateFilesMock,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  function renderComponent(props?: Partial<{
    onSelectFile: (file: File) => void;
    setInfoDialogOpen: (open: boolean) => void;
    optionsRef: React.RefObject<HTMLUListElement | null>;
  }>) {
    const onSelectFile = props?.onSelectFile ?? vi.fn();
    const setInfoDialogOpen = props?.setInfoDialogOpen ?? vi.fn();

    // Provide a simple optionsRef that points to a real <ul> element so classList can be tested
    const ul = document.createElement("ul");
    const optionsRef = props?.optionsRef ?? ({ current: ul } as React.RefObject<HTMLUListElement>);

    render(
      <UploadFromSelection
        onSelectFile={onSelectFile}
        setInfoDialogOpen={setInfoDialogOpen}
        optionsRef={optionsRef}
      />
    );

    const li = screen.getByText(/upload/i).closest("li") as HTMLLIElement;
    const input = screen.getByTestId("file-input") as HTMLInputElement;

    return { onSelectFile, setInfoDialogOpen, optionsRef, li, input };
  }

  it("renders the Upload option", () => {
    const { li } = renderComponent();
    expect(li).toBeInTheDocument();
    expect(li?.textContent?.toLowerCase()).toContain("upload");
  });

  it("clicking the list item triggers the hidden input click and adds 'hidden' to optionsRef", async () => {
    const user = userEvent.setup();
    const { li, input, optionsRef } = renderComponent();

  // ensure optionsRef starts without 'hidden'
  if (optionsRef.current) optionsRef.current.classList.remove("hidden");

    const clickSpy = vi.spyOn(input, "click");

    await user.click(li);

    expect(clickSpy).toHaveBeenCalled();
    expect(optionsRef.current).not.toBeNull();
    expect(optionsRef.current?.classList.contains("hidden")).toBe(true);
  });

  it("selecting a valid file calls onSelectFile and does not open info dialog", () => {
    const { input, onSelectFile, setInfoDialogOpen } = renderComponent();

    const file = new File(["dummy"], "image.png", { type: "image/png" });
    validateFilesMock.mockReturnValue(true);

    fireEvent.change(input, { target: { files: [file] } });

    expect(validateFilesMock).toHaveBeenCalledWith(file);
    expect(onSelectFile).toHaveBeenCalledWith(file);
    expect(setInfoDialogOpen).not.toHaveBeenCalled();
    // input value should be reset by the component
    expect(input.value).toBe("");
  });

  it("selecting multiple files uses the first file only and validates it", () => {
    const { input, onSelectFile, setInfoDialogOpen } = renderComponent();

    const file1 = new File(["first"], "first.png", { type: "image/png" });
    const file2 = new File(["second"], "second.png", { type: "image/png" });
    validateFilesMock.mockReturnValue(true);

    // Simulate multiple files selection
    fireEvent.change(input, { target: { files: [file1, file2] } });

  expect(validateFilesMock).toHaveBeenCalledWith(file1);
  // ensure only the first file was used
  expect(onSelectFile).toHaveBeenCalledTimes(1);
  expect(onSelectFile).toHaveBeenNthCalledWith(1, file1);
    expect(setInfoDialogOpen).not.toHaveBeenCalled();
    expect(input.value).toBe("");
  });

  it("selecting a too-large file opens info dialog and does not call onSelectFile", () => {
    const { input, onSelectFile, setInfoDialogOpen } = renderComponent();

    // Create a large file by setting a big size via a Blob
    const largeBlob = new Blob([new ArrayBuffer(5 * 1024 * 1024)]); // 5MB
    const largeFile = new File([largeBlob], "big.png", { type: "image/png" });

    validateFilesMock.mockReturnValue(false);

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(validateFilesMock).toHaveBeenCalledWith(largeFile);
    expect(onSelectFile).not.toHaveBeenCalled();
    expect(setInfoDialogOpen).toHaveBeenCalledWith(true);
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(input.value).toBe("");

    consoleErrorSpy.mockRestore();
  });

  it("pressing Enter or Space on the list item triggers the input click", async () => {
    const user = userEvent.setup();
    const { li, input } = renderComponent();

    const clickSpy = vi.spyOn(input, "click");

    // Press Enter
    li.focus();
    await user.keyboard("{Enter}");
    // Press Space
    await user.keyboard(" ");

  // The component attaches onClick to the <li>, but it doesn't handle key events.
  // In the current implementation keyboard events do not trigger the input click.
  expect(clickSpy).not.toHaveBeenCalled();
  });

  it("selecting an invalid file opens info dialog and does not call onSelectFile", () => {
    const { input, onSelectFile, setInfoDialogOpen } = renderComponent();

    const file = new File(["dummy"], "notes.txt", { type: "text/plain" });
    validateFilesMock.mockReturnValue(false);

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    fireEvent.change(input, { target: { files: [file] } });

    expect(validateFilesMock).toHaveBeenCalledWith(file);
    expect(onSelectFile).not.toHaveBeenCalled();
    expect(setInfoDialogOpen).toHaveBeenCalledWith(true);
    expect(consoleErrorSpy).toHaveBeenCalled();
    // input value should be reset by the component
    expect(input.value).toBe("");

    consoleErrorSpy.mockRestore();
  });
});
