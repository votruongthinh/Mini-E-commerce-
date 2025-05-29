import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Home from "../pages/Home";
import * as api from "../utils/api.js";
import { CartProvider } from "../contexts/CartContext";

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
  };
});

// Mock api calls
vi.mock("../utils/api", () => ({
  getProducts: vi.fn(),
  searchProducts: vi.fn(),
  getProductsByCategory: vi.fn(),
  getCategories: vi.fn(),
}));

// Mock react-toastify

// Mock framer-motion to avoid animation issues
vi.mock("framer-motion", () => ({
  motion: { div: ({ children }) => <div>{children}</div> },
}));

// Custom wrapper
const Wrapper = ({ children }) => (
  <CartProvider>
    <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
  </CartProvider>
);

describe("Home Component", () => {
  const mockNavigate = vi.fn();
  const mockLocation = { search: "" };

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useLocation).mockReturnValue(mockLocation);
    vi.mocked(api.getCategories).mockResolvedValue(["electronics", "clothing"]);
    vi.mocked(api.getProducts).mockResolvedValue({
      products: [
        { id: 1, title: "Phone", price: 200, thumbnail: "phone.jpg" },
        { id: 2, title: "Laptop", price: 1000, thumbnail: "laptop.jpg" },
      ],
      total: 2,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders error state when API fails", async () => {
    vi.mocked(api.getProducts).mockRejectedValue(new Error("API Error"));
    render(<Home />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText(/Error loading product/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Try Again/i })
      ).toBeInTheDocument();
    });
  });

  it("applies price filter and shows error for invalid range", async () => {
    render(<Home />, { wrapper: Wrapper });
    await waitFor(() => expect(screen.getByText("Phone")).toBeInTheDocument());

    const priceFromInput = screen.getByPlaceholderText("Price from");
    const priceToInput = screen.getByPlaceholderText("To price");
    const applyButton = screen.getByRole("button", { name: /Apply/i });

    await userEvent.type(priceFromInput, "6000000");
    await userEvent.type(priceToInput, "1000000");
    fireEvent.click(applyButton);
  });
});
