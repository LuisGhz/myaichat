import { render, screen } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";

import { MessageProvider } from "./MessageProvider";

// Shared mocks and spies
const mockMessageApi = { open: vi.fn() } as unknown;
const contextHolder = <div data-testid="context">context</div>;

// mock antd.message.useMessage
const mockUseMessage = vi.fn();
vi.mock("antd", () => ({
  message: {
    useMessage: () => mockUseMessage(),
  },
}));

// capture setMessageApi calls from the store
const setMessageApiMock = vi.fn();
vi.mock("store/app/AppStore", () => ({
  useAppStoreActions: () => ({ setMessageApi: setMessageApiMock }),
}));

function renderComponent() {
  // default behavior for tests: useMessage returns [api, contextHolder]
  mockUseMessage.mockReturnValue([mockMessageApi, contextHolder]);
  return render(<MessageProvider />);
}

describe("MessageProvider", () => {
  beforeEach(() => {
    mockUseMessage.mockReset();
    setMessageApiMock.mockReset();
    // reset mockMessageApi.open as well
    // @ts-expect-error reset mock
    mockMessageApi.open = vi.fn();
  });

  it("calls setMessageApi with the message API and renders contextHolder", () => {
    renderComponent();

    expect(setMessageApiMock).toHaveBeenCalledWith(mockMessageApi);
    expect(screen.getByTestId("context")).toBeInTheDocument();
  });
});
