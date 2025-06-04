import { render } from "@testing-library/react";
import { describe, expect } from "vitest";
import { OfflineMessage } from "components/OfflineMessage";
import { useAppIsOfflineStore } from "store/useAppStore";

vi.mock("store/useAppStore");

describe("OfflineMessage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderApp = (isOffline: boolean) => {
    vi.mocked(useAppIsOfflineStore).mockReturnValue(isOffline);
    return render(<OfflineMessage />);
  }
  it("should render null when not offline", () => {
    const { container } = renderApp(false);
    expect(container.firstChild).toBeNull();
  });

  it("should render the offline message when offline", () => {
    vi.mocked(useAppIsOfflineStore).mockReturnValue(true);
    const { getByText } = renderApp(true);
    expect(getByText("You are now using the app in offline mode. Some features may be limited.")).toBeInTheDocument();
  });
});