import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "./ProductCard";
import { useCart } from "../../contexts/CartContext";
import { BrowserRouter } from "react-router-dom";

// Mock useCart
vi.mock("../../contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

// Helper render with router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("ProductCard", () => {
  const mockProduct = {
    id: 1,
    title: "Notebook",
    price: 20,
    thumbnail: "/test.jpg",
  };

  const mockAddToCart = vi.fn();
  const mockToggleFavorite = vi.fn();

  beforeEach(() => {
    useCart.mockReturnValue({
      addToCart: mockAddToCart,
      toggleFavorite: mockToggleFavorite,
      favorites: [],
    });
  });

  it("renders product title and price", () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Notebook")).toBeInTheDocument();
    expect(screen.getByText(/VND/)).toBeInTheDocument();
  });

  it("calls addToCart when Add to cart button is clicked", () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    const addButton = screen.getByText("Add to cart");
    fireEvent.click(addButton);
    expect(mockAddToCart).toHaveBeenCalled();
  });

  it("calls toggleFavorite when favorite button is clicked", () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    const favoriteButton = screen.getByRole("button", { name: "" }); // no label, but it's still a button
    fireEvent.click(favoriteButton);
    expect(mockToggleFavorite).toHaveBeenCalled();
  });

  it("renders fallback if product is invalid", () => {
    renderWithRouter(<ProductCard product={null} />);
    expect(screen.getByText("Invalid product.")).toBeInTheDocument();
  });
});
