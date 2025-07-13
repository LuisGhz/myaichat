import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectedFile } from "./SelectedFile";

vi.mock("../ImageViewer", () => ({
  ImageViewer: ({ file }: { file: string }) => (
    <img
      src={file}
      alt="Selected attachment"
      className="max-h-40 rounded-md object-contain"
    />
  ),
}));

describe("SelectedFile", () => {
  const mockClearSelectedFile = vi.fn();
  const mockSelectedFile = "blob://test-url";

  beforeEach(() => {
    mockClearSelectedFile.mockClear();
  });

  const renderComponent = (
    selectedFile = mockSelectedFile,
    clearSelectedFile = mockClearSelectedFile
  ) => {
    return render(
      <SelectedFile
        selectedFile={selectedFile}
        clearSelectedFile={clearSelectedFile}
      />
    );
  };

  test("renders selected image with correct attributes", () => {
    renderComponent();

    const image = screen.getByAltText("Selected attachment");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockSelectedFile);
    expect(image).toHaveClass("max-h-40", "rounded-md", "object-contain");
  });

  test("renders remove button with correct aria-label", () => {
    renderComponent();

    const removeButton = screen.getByLabelText("Remove file");
    expect(removeButton).toBeInTheDocument();
  });

  test("calls clearSelectedFile when remove button is clicked", async () => {
    renderComponent();

    const removeButton = screen.getByLabelText("Remove file");
    await userEvent.click(removeButton);

    expect(mockClearSelectedFile).toHaveBeenCalledTimes(1);
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

    const removeButton = screen.getByLabelText("Remove file");
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

  test("renders with different file URL", () => {
    const customFileUrl = "blob://custom-test-url";
    renderComponent(customFileUrl);

    const image = screen.getByAltText("Selected attachment");
    expect(image).toHaveAttribute("src", customFileUrl);
  });

  test("XMarkIcon is rendered inside remove button", () => {
    renderComponent();

    const removeButton = screen.getByLabelText("Remove file");
    const icon = removeButton.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });
});
