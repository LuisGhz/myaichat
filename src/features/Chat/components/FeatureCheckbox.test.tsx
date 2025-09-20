import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("antd", () => ({
  Tooltip: (props: { title: string; children: React.ReactNode }) => (
    <div>{props.children}</div>
  ),
}));

import { FeatureCheckbox } from "./FeatureCheckbox";

describe("FeatureCheckbox", () => {
  it("renders label, tooltip icon and toggles", async () => {
    const onToggle = vi.fn();
    render(
      <FeatureCheckbox
        isActive={false}
        onToggle={onToggle}
        id="feat-1"
        featureDescription="Some feature"
        labelText="Feature A"
      />
    );

    expect(screen.getByText("Feature A")).toBeInTheDocument();
    // sr-only help text exists
    expect(screen.getByText("Some feature")).toBeInTheDocument();

    const label = screen.getByLabelText(/Information about Feature A icon/i, {
      selector: "svg",
      exact: false,
    });
    expect(label).toBeInTheDocument();
  });

  it("calls onToggle when checkbox is clicked", async () => {
    const onToggle = vi.fn();
    render(
      <FeatureCheckbox
        isActive={false}
        onToggle={onToggle}
        id="feat-1"
        featureDescription="Some feature"
        labelText="Feature A"
      />
    );

    const label = screen.getByLabelText(/Information about Feature A/i, {
      selector: "label",
      exact: false,
    });
    expect(label).toBeInTheDocument();
    await userEvent.click(label);
    expect(onToggle).toHaveBeenCalledWith(true);    
  });
});
