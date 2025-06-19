/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { FavChat } from "./FavChat";

// Mock icons
vi.mock("assets/icons/StarIcon", () => ({
  StarIcon: (props: any) => <svg data-testid="star-icon" {...props} />,
}));
vi.mock("assets/icons/StarIconSolid", () => ({
  StarIconSolid: (props: any) => (
    <svg data-testid="star-icon-solid" {...props} />
  ),
}));

// Mock store hook
const updateChatFavMock = vi.fn();
vi.mock("store/useAppStore", () => ({
  useAppStoreUpdateChatFav: () => updateChatFavMock,
}));

describe("FavChat", () => {
  beforeEach(() => {
    updateChatFavMock.mockClear();
  });

  it("renders StarIconSolid when fav is true", () => {
    const { getByTestId, queryByTestId } = render(
      <FavChat id="1" fav={true} />
    );
    expect(getByTestId("star-icon-solid")).toBeTruthy();
    expect(queryByTestId("star-icon")).toBeNull();
  });

  it("renders StarIcon when fav is false", () => {
    const { getByTestId, queryByTestId } = render(
      <FavChat id="1" fav={false} />
    );
    expect(getByTestId("star-icon")).toBeTruthy();
    expect(queryByTestId("star-icon-solid")).toBeNull();
  });

  it("calls updateChatFav with correct arguments when StarIconSolid is clicked", () => {
    const { getByTestId } = render(<FavChat id="abc" fav={true} />);
    fireEvent.click(getByTestId("star-icon-solid"));
    expect(updateChatFavMock).toHaveBeenCalledWith("abc", false);
  });

  it("calls updateChatFav with correct arguments when StarIcon is clicked", () => {
    const { getByTestId } = render(<FavChat id="xyz" fav={false} />);
    fireEvent.click(getByTestId("star-icon"));
    expect(updateChatFavMock).toHaveBeenCalledWith("xyz", true);
  });
});
