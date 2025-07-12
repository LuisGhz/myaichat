import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectedFile } from "./SelectedFile";

describe("SelectedFile", () => {
  const mockClearSelectedImage = vi.fn();
  const mockSelectedImage = "blob://test-url";

  beforeEach(() => {
    mockClearSelectedImage.mockClear();
  });

  const renderComponent = (
    selectedImage = mockSelectedImage,
    clearSelectedImage = mockClearSelectedImage
  ) => {
    return render(
      <SelectedFile
        selectedImage={selectedImage}
        clearSelectedImage={clearSelectedImage}
      />
    );
  };

  test("renders selected image with correct attributes", () => {
    renderComponent();

    const image = screen.getByAltText("Selected attachment");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockSelectedImage);
    expect(image).toHaveClass("max-h-40", "rounded-md", "object-contain");
  });

  test("renders remove button with correct aria-label", () => {
    renderComponent();

    const removeButton = screen.getByLabelText("Remove image");
    expect(removeButton).toBeInTheDocument();
  });

  test("calls clearSelectedImage when remove button is clicked", async () => {
    renderComponent();

    const removeButton = screen.getByLabelText("Remove image");
    await userEvent.click(removeButton);

    expect(mockClearSelectedImage).toHaveBeenCalledTimes(1);
  });

  test("applies correct styling classes to container", () => {
    const { container } = renderComponent();

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass(
      "w-full",
      "max-w-2/12", 
      "mb-2",
      "relative"
    );
  });

  test("applies correct styling classes to remove button", () => {
    renderComponent();

    const removeButton = screen.getByLabelText("Remove image");
    expect(removeButton).toHaveClass(
      "absolute",
      "top-1",
      "right-1",
      "bg-cop-8",
      "hover:bg-cop-9",
      "text-white",
      "rounded-full",
      "p-1",
      "text-xs"
    );
  });

  test("renders with different image URL", () => {
    const customImageUrl = "blob://custom-test-url";
    renderComponent(customImageUrl);

    const image = screen.getByAltText("Selected attachment");
    expect(image).toHaveAttribute("src", customImageUrl);
  });

  test("XMarkIcon is rendered inside remove button", () => {
    renderComponent();

    const removeButton = screen.getByLabelText("Remove image");
    const icon = removeButton.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});