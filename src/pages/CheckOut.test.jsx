import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Checkout from "../pages/CheckOut";
import { CartProvider } from "../contexts/CartContext";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";

// ✅ Mock react-toastify
vi.mock("react-toastify", async () => {
  const actual = await vi.importActual("react-toastify");
  return {
    ...actual,
    toast: {
      success: vi.fn((msg, options) => {
        if (options && typeof options.onClose === "function") {
          options.onClose(); // gọi ngay khi test
        }
      }),
      error: vi.fn(),
    },
  };
});

describe("Checkout Component", () => {
  it("renders cart items and handles checkout", async () => {
    // ✅ Mock localStorage nếu bạn đang load từ đó
    localStorage.setItem(
      "cart",
      JSON.stringify([
        {
          id: 1,
          title: "iPhone 14",
          quantity: 2,
          price: 20000,
          thumbnail: "https://example.com/iphone.jpg",
        },
      ])
    );

    render(
      <Router>
        <CartProvider>
          <Checkout />
        </CartProvider>
      </Router>
    );

    // 🧾 Kiểm tra sản phẩm được hiển thị
    expect(screen.getByText(/iPhone 14 x 2/)).toBeInTheDocument();
    expect(screen.getByText(/40,000 đ/)).toBeInTheDocument();

    // ✅ Nhấn nút thanh toán
    fireEvent.click(
      screen.getByRole("button", { name: /payment confirmation/i })
    );

    // ✅ Kiểm tra thông báo "Thank you for your purchase!" hiện ra
    await waitFor(() => {
      expect(
        screen.getByText(/thank you for your purchase/i)
      ).toBeInTheDocument();
    });

    // ✅ Kiểm tra nút quay về trang chủ hiển thị
    expect(
      screen.getByRole("link", { name: /continue shopping/i })
    ).toBeInTheDocument();
  });
});
