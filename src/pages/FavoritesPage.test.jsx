import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FavoritesPage from "../pages/FavoritesPage";
import { useCart } from "../contexts/CartContext";
import { ToastContainer } from "react-toastify";

// Mock useCart
vi.mock("../contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

// Mock ProductCard component
vi.mock("../components/product/ProductCard", () => ({
  default: ({ product }) => <div>{product.title}</div>,
}));

describe("FavoritesPage", () => {
  const mockToggleFavorite = vi.fn();

  beforeEach(() => {
    mockToggleFavorite.mockClear();
  });

  it("show loading while loading", () => {
    useCart.mockReturnValue({
      favorites: [],
      toggleFavorite: mockToggleFavorite,
    });
    const { container } = render(<FavoritesPage />);
    expect(container.textContent).toContain(
      "There are no favorite products yet"
    );
  });

  it("Show notification when there are no favorite products", async () => {
    useCart.mockReturnValue({
      favorites: [],
      toggleFavorite: mockToggleFavorite,
    });

    render(<FavoritesPage />);
    expect(
      await screen.findByText("There are no favorite products yet.")
    ).toBeInTheDocument();
  });

  it("Show favorite products list", async () => {
    const fakeFavorites = [
      { id: 1, title: "iPhone 14", price: 20 },
      { id: 2, title: "Samsung Galaxy", price: 18 },
    ];
    useCart.mockReturnValue({
      favorites: fakeFavorites,
      toggleFavorite: mockToggleFavorite,
    });

    render(
      <>
        <FavoritesPage />
        <ToastContainer />
      </>
    );

    expect(await screen.findByText("iPhone 14")).toBeInTheDocument();
    expect(await screen.findByText("Samsung Galaxy")).toBeInTheDocument();
  });

  it("button handling Delete All", async () => {
    const fakeFavorites = [
      { id: 1, title: "iPhone 14", price: 20 },
      { id: 2, title: "Samsung Galaxy", price: 18 },
    ];
    useCart.mockReturnValue({
      favorites: fakeFavorites,
      toggleFavorite: mockToggleFavorite,
    });

    render(
      <>
        <FavoritesPage />
        <ToastContainer />
      </>
    );

    const deleteButton = await screen.findByText("Delete All");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToggleFavorite).toHaveBeenCalledTimes(2);
    });

    expect(
      await screen.findByText("Deleted entire favorites list!")
    ).toBeInTheDocument();
  });
});
