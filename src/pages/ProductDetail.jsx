import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getProductById, getProductsByCategory } from "../utils/api.js";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
        return getProductsByCategory(data.category);
      })
      .then((relatedData) => {
        const filtered = relatedData.products.filter(
          (p) => p.id !== parseInt(id)
        );
        setRelated(filtered);
      })
      .catch((error) => {
        console.error("Error fetching product or related:", error);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, price: product.price * 25000, quantity });
    toast.success(`${product.title} added to cart`, {
      position: "top-right",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-sans">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!product)
    return (
      <div className="text-center text-gray-600 mt-10">
        Product doesn't exist
      </div>
    );

  const priceInVND = product.price * 25000;

  return (
    <motion.div
      className="p-4 md:p-8 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Chi tiết sản phẩm */}
      <div className="flex flex-col lg:flex-row gap-10 bg-white p-6 rounded-xl shadow">
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-[400px] object-contain"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {product.title}
          </h1>
          <p className="text-red-500 text-xl mb-4">
            {priceInVND.toLocaleString()} VND
          </p>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
            <p>
              <strong>Brand:</strong> {product.brand || "N/A"}
            </p>
            <p>
              <strong>Rating:</strong> {product.rating} / 5
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Sold:</strong> {product.stock || 0} units
            </p>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <label htmlFor="quantity" className="text-gray-700 font-medium">
              Quantity:
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-[#FB5533] mt-6 cursor-pointer text-white px-4 py-2 rounded hover:bg-[#e14c2a] transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.slice(0, 4).map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition block"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-40 w-full object-contain mb-2"
              />
              <h3 className="text-sm font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="text-red-500 font-bold text-sm">
                {(item.price * 25000).toLocaleString()} VND
              </p>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
