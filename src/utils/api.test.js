import { describe, it, expect, vi } from "vitest";
import * as api from "../utils/api.js";
import axios from "axios";

// Mock axios
vi.mock("axios");

describe("API Utils", () => {
  describe("getProducts", () => {
    it("fetches products successfully", async () => {
      const mockResponse = {
        data: { products: [{ id: 1, title: "Phone" }], total: 1 },
      };
      axios.get.mockResolvedValue(mockResponse);

      const result = await api.getProducts(1, 6);
      expect(axios.get).toHaveBeenCalledWith(
        "https://dummyjson.com/products?limit=6&skip=0"
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("handles error", async () => {
      axios.get.mockRejectedValue(new Error("Network error"));
      await expect(api.getProducts(1, 6)).rejects.toThrow("Network error");
    });
  });

  describe("searchProducts", () => {
    it("searches products successfully", async () => {
      const mockResponse = {
        data: { products: [{ id: 1, title: "Phone" }], total: 1 },
      };
      axios.get.mockResolvedValue(mockResponse);

      const result = await api.searchProducts("phone");
      expect(axios.get).toHaveBeenCalledWith(
        "https://dummyjson.com/products/search?q=phone"
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("handles error", async () => {
      axios.get.mockRejectedValue(new Error("Search failed"));
      await expect(api.searchProducts("phone")).rejects.toThrow(
        "Search failed"
      );
    });
  });

  describe("getCategories", () => {
    it("fetches categories successfully", async () => {
      const mockResponse = { data: ["electronics", "clothing"] };
      axios.get.mockResolvedValue(mockResponse);

      const result = await api.getCategories();
      expect(axios.get).toHaveBeenCalledWith(
        "https://dummyjson.com/products/categories"
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("handles error", async () => {
      axios.get.mockRejectedValue(new Error("Categories fetch failed"));
      await expect(api.getCategories()).rejects.toThrow(
        "Categories fetch failed"
      );
    });
  });
});
