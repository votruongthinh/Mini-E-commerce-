import axios from "axios";

const API_URL = "https://dummyjson.com/products";

export const getProducts = async (page = 1, limit = 6) => {
  const skip = (page - 1) * limit;
  try {
    const response = await axios.get(`${API_URL}?limit=${limit}&skip=${skip}`);
    console.log("Products API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search?q=${query}`);
    console.log("Search API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Search API error:", error);
    throw error;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/category/${category}`);
    console.log("Category API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
