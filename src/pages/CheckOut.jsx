import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import success from "../assets/check.gif";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [isConfirming, setIsConfirming] = useState(false);
  const [isCheckoutDone, setIsCheckoutDone] = useState(false);

  const handleCheckout = () => {
    if (typeof clearCart !== "function") {
      toast.error("Lỗi khi reset giỏ hàng!");
      return;
    }

    setIsConfirming(true);
    toast.success("Thanh toán thành công!", {
      position: "top-right",
      autoClose: 3000,
      onClose: () => {
        clearCart();
        setIsConfirming(false);
        setIsCheckoutDone(true);
      },
    });
  };

  return (
    <motion.div
      className="container mx-auto p-4 min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.h1
        className="text-3xl font-bold text-orange-600 mb-6 text-center"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Thanh Toán
      </motion.h1>

      <motion.div
        className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md mx-auto"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Thông tin đơn hàng
        </h2>

        {cart.length === 0 && !isCheckoutDone ? (
          <motion.p
            className="text-center text-gray-500 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Không có sản phẩm để thanh toán
          </motion.p>
        ) : isCheckoutDone ? (
          <div className="text-center">
            <img
              src={success}
              alt="Thanh toán thành công"
              className="w-40 h-40 mx-auto mb-4"
            />
            <p className="text-lg font-medium text-green-600 mb-4">
              Cảm ơn bạn đã mua hàng!
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Tiếp tục mua hàng
            </Link>
          </div>
        ) : (
          <>
            {cart.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.thumbnail || "/assets/images/placeholder.jpg"}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="text-gray-700">
                    {item.title} x {item.quantity}
                  </span>
                </div>
                <span className="text-gray-900 font-medium">
                  {(item.price * item.quantity).toLocaleString()} đ
                </span>
              </motion.div>
            ))}

            <motion.div
              className="border-t border-gray-200 pt-4 mt-4 text-right"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                Tổng: {total.toLocaleString()} đ
              </p>
            </motion.div>

            <motion.button
              onClick={handleCheckout}
              disabled={isConfirming}
              className="mt-6 w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {isConfirming ? "Đang xử lý..." : "Xác nhận thanh toán"}
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Checkout;
