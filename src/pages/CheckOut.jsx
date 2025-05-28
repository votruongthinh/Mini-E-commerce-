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
      toast.error("Error resetting cart!");
      return;
    }

    setIsConfirming(true);
    toast.success("Payment successful!", {
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
        className="text-3xl font-sans text-[#FB5533] mb-6 text-center"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Check Out
      </motion.h1>

      <motion.div
        className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md mx-auto relative"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-sans text-gray-800 mb-4">
          Order information
        </h2>

        {cart.length === 0 && !isCheckoutDone ? (
          <motion.p
            className="text-center text-gray-500 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            There are no products to checkout.
          </motion.p>
        ) : isCheckoutDone ? (
          <div className="text-center">
            <img
              src={success}
              alt="Thanh toán thành công"
              className="w-40 h-40 mx-auto mb-4"
            />
            <p className="text-lg font-sans text-green-600 mb-4">
              Thank you for your purchase!
            </p>
            <Link
              to="/"
              className="inline-block bg-[#FB5533] text-white px-6 py-3 rounded-lg hover:bg-[#e14c2a] transition-all duration-300"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="max-h-[400px] overflow-y-auto pr-1">
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
                  <span className="text-gray-900 font-sans">
                    {(item.price * item.quantity).toLocaleString()} đ
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Sticky Total + Button */}
            <motion.div
              className="sticky bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 mt-4 pt-4 px-2 pb-4 shadow-[0_-2px_6px_rgba(0,0,0,0.05)]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xl sm:text-2xl font-sans text-green-600 mb-4 text-right">
                Total: {total.toLocaleString()} VND
              </p>
              <motion.button
                onClick={handleCheckout}
                disabled={isConfirming}
                className="w-full bg-[#FB5533] text-white px-6 py-3 rounded-lg hover:bg-[#e14c2a] disabled:bg-[#ffd2c2] disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {isConfirming ? "Processing..." : "Payment Confirmation"}
              </motion.button>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Checkout;
