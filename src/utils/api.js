import axios from "axios";

const API_URL = "https://dummyjson.com/products";

export const getProducts = async (page = 1, limit = 6) => {
  const skip = (page - 1) * limit;
  const response = await axios.get(`${API_URL}?limit=${limit}&skip=${skip}`);
  return response.data;
};
export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};
export const searchProducts = async (query) => {
  const response = await axios.get(`${API_URL}/search?q=${query}`);
  return response.data;
};

export const getProductsByCategory = async (category) => {
  const response = await axios.get(`${API_URL}/category/${category}`);
  return response.data;
};
