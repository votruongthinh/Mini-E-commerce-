import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../../contexts/CartContext";
import { toast } from "react-toastify";

const ProductCard = ({ product, priceFormatted }) => {
  const { addToCart, favorites, toggleFavorite } = useCart();
  const isFavorite = favorites.some((fav) => fav.id === product.id);

  // Kiểm tra dữ liệu product
  if (!product || !product.id || !product.title) {
    return (
      <motion.div
        className="bg-white p-4 rounded-lg shadow hover:shadow-lg text-center text-gray-500"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        data-testid="product-card"
      >
        Sản phẩm không hợp lệ
      </motion.div>
    );
  }

  const displayPrice = priceFormatted ?? product.price * 25000;

  const handleAddToCart = () => {
    try {
      addToCart({ ...product, price: displayPrice });
      toast.success(`${product.title} đã được thêm vào giỏ hàng!`, {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!", {
        position: "top-right",
      });
    }
  };

  return (
    <motion.div
      className="bg-white p-4 rounded-lg shadow hover:shadow-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      data-testid="product-card"
    >
      <div className="w-full aspect-[4/3] overflow-hidden rounded">
        <img
          src={product.thumbnail || "/assets/images/placeholder.jpg"}
          alt={product.title}
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-lg font-semibold mt-2 line-clamp-2">
        {product.title}
      </h3>
      <p className="text-red-500 font-bold">
        {displayPrice.toLocaleString()} đ
      </p>
      <div className="flex gap-2 mt-2">
        <Link
          to={`/product/${product.id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Chi tiết
        </Link>
        <button
          onClick={handleAddToCart}
          className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Thêm vào giỏ
        </button>
        <button
          onClick={() => toggleFavorite(product)}
          className={`p-2 rounded-full ${
            isFavorite ? "text-red-500" : "text-gray-400"
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
