import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import NotFound from "../pages/NotFound";

describe("NotFound Component", () => {
  it("renders image, heading, message and link", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    // Kiểm tra ảnh
    const image = screen.getByAltText("404 Not Found");
    expect(image).toBeInTheDocument();

    // Tiêu đề chính
    const heading = screen.getByText(/oops! page not found/i);
    expect(heading).toBeInTheDocument();

    // Nội dung mô tả
    const message = screen.getByText(/Looks like you got lost/i);
    expect(message).toBeInTheDocument();

    // Nút quay lại trang chủ
    const backButton = screen.getByRole("link", { name: /back to home/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton.getAttribute("href")).toBe("/");
  });
});
