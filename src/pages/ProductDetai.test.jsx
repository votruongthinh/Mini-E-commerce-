import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, vi, expect, beforeEach } from "vitest";
import ProductDetail from "../pages/ProductDetail";

// Mock API
vi.mock("../utils/api.js", () => ({
  getProductById: vi.fn(),
  getProductsByCategory: vi.fn(),
}));

// Mock CartContext
vi.mock("../contexts/CartContext", () => ({
  useCart: () => ({
    addToCart: vi.fn(),
  }),
}));

// Import mock functions
import { getProductById, getProductsByCategory } from "../utils/api.js";

// Sample mock data
const mockProduct = {
  id: 1,
  title: "iPhone 13",
  price: 30,
  thumbnail: "https://via.placeholder.com/150",
  description: "A new generation iPhone.",
  category: "phones",
  brand: "Apple",
  rating: 4.5,
  stock: 100,
};

const mockRelated = {
  products: [
    {
      id: 2,
      title: "Samsung Galaxy",
      price: 28,
      thumbnail: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      title: "Xiaomi",
      price: 25,
      thumbnail: "https://via.placeholder.com/150",
    },
  ],
};

describe("ProductDetail Component", () => {
  beforeEach(() => {
    getProductById.mockResolvedValue(mockProduct);
    getProductsByCategory.mockResolvedValue(mockRelated);
  });

  it("renders product details and related products", async () => {
    render(
      <MemoryRouter initialEntries={["/product/1"]}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Kiểm tra loading ban đầu
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Sau khi fetch xong
    await waitFor(() => {
      expect(screen.getByText(/iPhone 13/i)).toBeInTheDocument();
    });

    // Kiểm tra mô tả sản phẩm
    expect(screen.getByText(/a new generation iphone/i)).toBeInTheDocument();

    // Kiểm tra sản phẩm liên quan
    expect(screen.getByText(/Samsung Galaxy/i)).toBeInTheDocument();
    expect(screen.getByText(/Xiaomi/i)).toBeInTheDocument();

    // Kiểm tra nút Add to Cart
    expect(screen.getByText(/Add to Cart/i)).toBeInTheDocument();
  });

  it("lets user change quantity", async () => {
    render(
      <MemoryRouter initialEntries={["/product/1"]}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/iPhone 13/);

    const input = screen.getByLabelText(/Quantity/i);
    fireEvent.change(input, { target: { value: "3" } });
    expect(input.value).toBe("3");
  });
});
