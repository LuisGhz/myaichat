import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UploadFromSelection } from "./UploadFromSelection";
import { useAttachedFilesValidator } from "hooks/features/Chat/useAttachedFilesValidator";
import { createRef } from "react";

// Mock dependencies
vi.mock("hooks/features/Chat/useAttachedFilesValidator", () => ({
  useAttachedFilesValidator: vi.fn(),
}));

describe("UploadFromSelection", () => {
  const mockOnSelectFile = vi.fn();
  const mockSetInfoDialogOpen = vi.fn();
  
  const renderComponent = (optionsRefOverride?: React.RefObject<HTMLUListElement | null>) => {
    const mockOptionsRef = optionsRefOverride || createRef<HTMLUListElement | null>();
    return render(
      <UploadFromSelection
        onSelectFile={mockOnSelectFile}
        setInfoDialogOpen={mockSetInfoDialogOpen}
        optionsRef={mockOptionsRef}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the validator hook to return a validateFiles function
    vi.mocked(useAttachedFilesValidator).mockReturnValue({
      validateFiles: vi.fn().mockReturnValue(true),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without crashing", () => {
    renderComponent();
    expect(screen.getByText("Upload")).toBeInTheDocument();
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
  });

  it("renders file input with correct attributes", () => {
    renderComponent();
    const input = screen.getByTestId("file-input");
    
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("accept", "image/jpeg, image/png, image/jpg, image/gif");
    expect(input).toHaveAttribute("name", "attach-file");
    expect(input).toHaveAttribute("id", "attach-file");
    expect(input).toHaveClass("hidden");
  });

  it("triggers file input click when Upload is clicked", () => {
    renderComponent();
    
    const input = screen.getByTestId("file-input");
    const clickSpy = vi.spyOn(input, "click").mockImplementation(() => {});
    
    fireEvent.click(screen.getByText("Upload"));
    
    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it("hides options menu when Upload is clicked", () => {
    const mockOptionsRef = createRef<HTMLUListElement>();
    const mockUl = document.createElement("ul");
    mockUl.classList.add("visible");
    Object.defineProperty(mockOptionsRef, "current", {
      value: mockUl,
      writable: true,
    });

    renderComponent(mockOptionsRef);
    
    fireEvent.click(screen.getByText("Upload"));
    
    expect(mockUl.classList.contains("hidden")).toBe(true);
  });

  it("handles valid file selection correctly", () => {
    renderComponent();
    
    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input") as HTMLInputElement;
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(mockOnSelectFile).toHaveBeenCalledWith(file);
    expect(input.value).toBe("");
  });

  it("handles invalid file selection correctly", () => {
    // Mock validateFiles to return false for this test
    vi.mocked(useAttachedFilesValidator).mockReturnValue({
      validateFiles: vi.fn().mockReturnValue(false),
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    renderComponent();
    
    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input") as HTMLInputElement;
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(mockOnSelectFile).not.toHaveBeenCalled();
    expect(mockSetInfoDialogOpen).toHaveBeenCalledWith(true);
    expect(consoleSpy).toHaveBeenCalledWith("Invalid file type or size exceeded.");
    expect(input.value).toBe("");
    
    consoleSpy.mockRestore();
  });

  it("does nothing when no file is selected", () => {
    renderComponent();
    
    const input = screen.getByTestId("file-input");
    
    fireEvent.change(input, { target: { files: [] } });
    
    expect(mockOnSelectFile).not.toHaveBeenCalled();
    expect(mockSetInfoDialogOpen).not.toHaveBeenCalled();
  });

  it("clears input value after file selection", () => {
    renderComponent();
    
    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input") as HTMLInputElement;
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(input.value).toBe("");
  });

  it("validates files using the attached files validator", () => {
    const mockValidateFiles = vi.fn().mockReturnValue(true);
    vi.mocked(useAttachedFilesValidator).mockReturnValue({
      validateFiles: mockValidateFiles,
    });
    
    renderComponent();
    
    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input") as HTMLInputElement;
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(mockValidateFiles).toHaveBeenCalledWith(file);
  });
});
