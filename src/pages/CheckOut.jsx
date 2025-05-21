import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Checkout() {
  const { cart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [isConfirming, setIsConfirming] = useState(false);

  // Debug để kiểm tra clearCart
  //console.log("Cart and clearCart from context:", { cart, clearCart });

  const handleCheckout = () => {
    if (typeof clearCart !== "function") {
      //console.error("clearCart is not a function. Check CartContext.");
      toast.error("Lỗi khi reset giỏ hàng!"); // Dùng mặc định từ ToastContainer
      return;
    }

    setIsConfirming(true);
    console.log("Starting checkout process...");

    // Hiển thị toast trước khi reset, dùng vị trí mặc định từ ToastContainer
    toast.success("Thanh toán thành công!", {
      autoClose: 3000,
      onOpen: () => console.log("Toast opened"),
      onClose: () => {
        //console.log("Toast closed, resetting cart");
        clearCart(); // Reset giỏ hàng sau khi toast đóng
        setIsConfirming(false); // Reset trạng thái nút
      },
    });
  };

  return (
    <motion.div
      className="container mx-auto p-4 min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold text-orange-600 mb-6 text-center"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Thanh toán
      </motion.h1>
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Thông tin đơn hàng
        </h2>
        {cart.length === 0 ? (
          <motion.p
            className="text-center text-gray-500 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Không có sản phẩm để thanh toán
          </motion.p>
        ) : (
          <>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: item.id * 0.1 }}
              >
                <span className="text-gray-700">
                  {item.title} x {item.quantity}
                </span>
                <span className="text-gray-900 font-medium">
                  {(item.price * item.quantity).toLocaleString()} đ
                </span>
              </motion.div>
            ))}
            <motion.div
              className="border-t border-gray-200 pt-4 mt-4 text-right"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-2xl font-bold text-green-600">
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
}

export default Checkout;
