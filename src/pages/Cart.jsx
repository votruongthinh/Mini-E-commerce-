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
      <h1 className="text-2xl font-bold mb-6">🛒 Giỏ Hàng</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Giỏ hàng trống</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white p-4 rounded-lg shadow-md"
              >
                {/* Ảnh */}
                <div className="w-full sm:w-24 flex justify-center sm:justify-start">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full max-w-[100px] h-auto max-h-[100px] object-contain rounded bg-gray-50 p-1"
                  />
                </div>

                {/* Thông tin sản phẩm */}
                <div className="flex-1 w-full">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-blue-600 font-medium mt-1">
                    {(item.price * item.quantity).toLocaleString()} đ
                  </p>
                </div>

                {/* Thay đổi số lượng */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                {/* Xóa sản phẩm */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 mt-2 sm:mt-0"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          {/* Tổng và thanh toán */}
          <div className="mt-8 text-right">
            <p className="text-xl font-bold mb-2">
              Tổng: {total.toLocaleString()} đ
            </p>
            <Link
              to="/checkout"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
            >
              Thanh toán
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Cart;
