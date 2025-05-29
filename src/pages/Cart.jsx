import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-sans mb-6">🛒 Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Cart is empty</p>
      ) : (
        <div className="relative border rounded-lg shadow-md bg-white overflow-hidden">
          {/* Danh sách sản phẩm */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-b pb-4"
              >
                <div className="w-full sm:w-24 flex justify-center sm:justify-start">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full max-w-[100px] h-auto max-h-[100px] object-contain rounded bg-gray-50 p-1"
                  />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="font-sans text-lg">{item.title}</h3>
                  <p className="text-blue-600 font-sans mt-1">
                    {(item.price * item.quantity).toLocaleString()} đ
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    data-testid={`decrease-${item.id}`}
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    data-testid={`increase-${item.id}`}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 mt-2 sm:mt-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Tổng và thanh toán cố định */}
          <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between items-center shadow-inner">
            <p className="text-lg font-sans text-gray-800">
              Total: {total.toLocaleString()} VND
            </p>
            <Link
              to="/checkout"
              className="bg-[#E6532D] text-white px-4 py-2 rounded hover:bg-[#cc4525] transition"
            >
              Check Out
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
