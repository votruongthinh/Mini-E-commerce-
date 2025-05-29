// Skeleton.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Skeleton from "./Skeleton"; // cập nhật path nếu cần

describe("Skeleton component", () => {
  it("renders skeleton UI correctly", () => {
    render(<Skeleton />);
    const skeletonElement = screen.getByTestId("skeleton");
    expect(skeletonElement).toBeInTheDocument();
  });

  it("contains 5 skeleton blocks", () => {
    render(<Skeleton />);
    const blocks = screen
      .getByTestId("skeleton")
      .querySelectorAll("div.bg-gray-200");
    expect(blocks.length).toBe(5);
  });
});
