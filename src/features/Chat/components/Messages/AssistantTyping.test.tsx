import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AssistantTyping } from "./AssistantTyping";

describe("AssistantTyping", () => {
  it("renders without crashing", () => {
    render(<AssistantTyping />);
    expect(screen.getByLabelText("Assistant is typing")).toBeInTheDocument();
  });

  it("renders exactly three dots", () => {
    const { container } = render(<AssistantTyping />);
    const dots = container.querySelectorAll("span");
    expect(dots).toHaveLength(3);
  });

  it("applies correct base styling to each dot", () => {
    const { container } = render(<AssistantTyping />);
    const dots = container.querySelectorAll("span");
    
    dots.forEach((dot) => {
      expect(dot).toHaveStyle({
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: "#666",
        display: "inline-block",
      });
    });
  });

  it("applies correct animation properties to each dot", () => {
    const { container } = render(<AssistantTyping />);
    const dots = Array.from(container.querySelectorAll("span"));
    
    // Check animation property for each dot
    expect(dots[0]).toHaveStyle({
      animation: "dotJump 1.2s infinite ease-in-out",
      animationDelay: "0s",
    });
    
    expect(dots[1]).toHaveStyle({
      animation: "dotJump 1.2s infinite ease-in-out",
      animationDelay: "0.25s",
    });
    
    expect(dots[2]).toHaveStyle({
      animation: "dotJump 1.2s infinite ease-in-out",
      animationDelay: "0.40s",
    });
  });

  it("has accessible label for screen readers", () => {
    render(<AssistantTyping />);
    expect(screen.getByLabelText("Assistant is typing")).toBeInTheDocument();
  });

  it("includes keyframes definition in the style tag", () => {
    const { container } = render(<AssistantTyping />);
    const styleTag = container.querySelector("style");
    
    expect(styleTag).toBeInTheDocument();
    expect(styleTag?.textContent).toContain("@keyframes dotJump");
    expect(styleTag?.textContent).toContain("transform: translateY(0)");
    expect(styleTag?.textContent).toContain("transform: translateY(-7px)");
  });
});