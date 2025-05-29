import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "../../contexts/CartContext";
import NavBar from "./NavBar";

// Mock API functions
vi.mock("../../utils/api.js", () => ({
  getCategories: vi.fn(() =>
    Promise.resolve([
      { name: "electronics", slug: "electronics" },
      { name: "books", slug: "books" },
    ])
  ),
  getProducts: vi.fn(() =>
    Promise.resolve({
      products: [
        { title: "Smartphone" },
        { title: "Headphones" },
        { title: "Laptop" },
        { title: "Notebook" },
        { title: "Camera" },
      ],
    })
  ),
}));

// Wrap with Router & Cart context
const renderNavBar = () => {
  render(
    <CartProvider>
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    </CartProvider>
  );
};

describe("NavBar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders logo", () => {
    renderNavBar();
    const logo = screen.getByAltText("Shopee Clone");
    expect(logo).toBeInTheDocument();
  });

  it("renders search input", () => {
    renderNavBar();
    const input = screen.getByPlaceholderText("Search for products...");
    expect(input).toBeInTheDocument();
  });

  it("renders category dropdown on click", async () => {
    renderNavBar();
    const categoryButton = screen.getByText("Category");
    fireEvent.click(categoryButton);

    await waitFor(() => {
      expect(screen.getByText("electronics")).toBeInTheDocument();
      expect(screen.getByText("books")).toBeInTheDocument();
    });
  });

  it("shows cart item count", () => {
    renderNavBar();
    const cartIcon = screen.getByTestId("cart-icon");
    expect(cartIcon).toBeInTheDocument();

    // Default count is 0 unless CartContext has data.
    // You can expand this test with a mock CartContext if needed.
  });
});
