import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ImageViewer } from "../components/ImageViewer";
import { cleanup } from "@testing-library/react";

describe("ImageViewer", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("should render the image with the correct src when image is a string", () => {
    const imageUrl = "https://example.com/image.jpg";
    render(<ImageViewer file={imageUrl} />);
    const imageElement = screen.getByAltText("File uploaded by user");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute("src", imageUrl);
  });

  it("should render the image with the correct src when file is a File object", () => {
    const mockFile = new File(["(⌐□_□)"], "chucknorris.png", {
      type: "image/png",
    });

    const mockUrl = "blob:http://localhost/1234567890";
    const createObjectURLMock = vi.fn().mockReturnValue(mockUrl);
    window.URL.createObjectURL = createObjectURLMock;

    render(<ImageViewer file={mockFile} />);

    expect(createObjectURLMock).toHaveBeenCalledWith(mockFile);

    const imageElement = screen.getByAltText("File uploaded by user");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute("src", mockUrl);
  });
});
