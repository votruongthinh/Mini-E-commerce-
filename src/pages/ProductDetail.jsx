import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getProductById } from "../utils/api.js";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true); // đặt lại loading khi id thay đổi
    getProductById(id)
      .then((data) => {
        //console.log("Dữ liệu sản phẩm từ API:", data); // debug
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Spinner (vòng quay) */}
          <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!product)
    return (
      <div className="text-center text-gray-600 mt-10">
        Sản phẩm không tồn tại
      </div>
    );

  const priceInVND = product.price * 25000;
  const handleAddToCart = () => {
    addToCart({ ...product, price: priceInVND });
    toast.success(`${product.title} đã được thêm vào giỏ hàng`, {
      position: "top-center",
    });
  };

  return (
    <motion.div
      className="p-4 md:p-8 lg:p-12 bg-gray-50 rounded-lg shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      data-testid="product-detail"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* hình ảnh sản phẩm */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white rounded-lg overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full max-h-[400px] object-contain p-4 bg-white"
          />
        </div>

        <div className="flex-1">
          {/* thông tin sản phẩm */}
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
            {product.title}
          </h1>
          <p className="text-red-500 text-xl font-semibold mt-2">
            {priceInVND.toLocaleString()}đ
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">
            {product.description}
          </p>
          <button
            onClick={handleAddToCart}
            className="mt-6 bg-green-500 hover:bg-green-600 font-semibold transition duration-200 text-white px-4 py-2 rounded"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
