import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { CartProvider, useCart } from "./CartContext";

// Custom render để wrap hook trong Provider
const renderCartHook = () =>
  renderHook(() => useCart(), {
    wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
  });

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear(); // clear localStorage giữa mỗi test
  });

  it("adds item to cart", () => {
    const { result } = renderCartHook();

    act(() => {
      result.current.addToCart({ id: 1, name: "Product A", quantity: 2 });
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  it("removes item from cart", () => {
    const { result } = renderCartHook();

    act(() => {
      result.current.addToCart({ id: 1, name: "Product A" });
      result.current.removeFromCart(1);
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it("updates quantity", () => {
    const { result } = renderCartHook();

    act(() => {
      result.current.addToCart({ id: 1, name: "Product A", quantity: 1 });
      result.current.updateQuantity(1, 5);
    });

    expect(result.current.cart[0].quantity).toBe(5);
  });

  it("clears cart", () => {
    const { result } = renderCartHook();

    act(() => {
      result.current.addToCart({ id: 1, name: "Product A" });
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it("toggles favorite on and off", () => {
    const { result } = renderCartHook();
    const product = { id: 1, name: "Product A" };

    act(() => {
      result.current.toggleFavorite(product);
    });
    expect(result.current.favorites).toHaveLength(1);

    act(() => {
      result.current.toggleFavorite(product);
    });
    expect(result.current.favorites).toHaveLength(0);
  });

  it("saves and restores cart from localStorage", () => {
    localStorage.setItem(
      "cart",
      JSON.stringify([{ id: 1, name: "Saved Item", quantity: 3 }])
    );
    const { result } = renderCartHook();

    expect(result.current.cart).toEqual([
      { id: 1, name: "Saved Item", quantity: 3 },
    ]);
  });

  it("saves and restores favorites from localStorage", () => {
    localStorage.setItem(
      "favorites",
      JSON.stringify([{ id: 1, name: "Favorite", isFavorite: true }])
    );
    const { result } = renderCartHook();

    expect(result.current.favorites).toEqual([
      { id: 1, name: "Favorite", isFavorite: true },
    ]);
  });
});
