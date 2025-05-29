import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Cart from "../pages/Cart";

// ✅ Mock useCart
vi.mock("../contexts/CartContext", () => ({
  useCart: () => ({
    cart: [
      {
        id: 1,
        title: "Test Product",
        price: 100000,
        quantity: 1,
        thumbnail: "https://via.placeholder.com/100",
      },
    ],
    updateQuantity: vi.fn(),
    removeFromCart: vi.fn(),
  }),
}));

describe("Cart Component", () => {
  it("can increase and decrease quantity", () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    const increaseBtn = screen.getByTestId("increase-1");
    const decreaseBtn = screen.getByTestId("decrease-1");

    expect(increaseBtn).toBeInTheDocument();
    expect(decreaseBtn).toBeInTheDocument();

    fireEvent.click(increaseBtn);
    fireEvent.click(decreaseBtn);
  });
});
