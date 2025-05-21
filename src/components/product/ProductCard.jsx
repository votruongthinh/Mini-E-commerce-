import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../../contexts/CartContext";
import { toast } from "react-toastify";

function ProductCard({ product }) {
  const { addToCart, cart } = useCart(); // Lấy cart để debug

  // Kiểm tra dữ liệu product trước khi sử dụng
  if (!product || !product.id || !product.title) {
    //console.error("Invalid product data:", product);
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

  const priceInVND = product.price * 25000; // Giá đã được đảm bảo tồn tại

  const handleAddToCart = () => {
    try {
      //console.log("Adding to cart:", { ...product, price: priceInVND }); // Debug trước khi thêm
      addToCart({ ...product, price: priceInVND }); // Truyền giá đã chuyển đổi
      //console.log("Cart after adding:", cart); // Debug sau khi thêm
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

  // Debug URL ảnh
  // console.log("Image URL:",product.thumbnail || "/assets/images/placeholder.jpg");

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
      <p className="text-red-500 font-bold">{priceInVND.toLocaleString()} đ</p>
      <div className="flex gap-2 mt-2">
        <Link
          to={`/product/${product.id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Chi tiết
        </Link>
        <button
          onClick={handleAddToCart}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Thêm vào giỏ
        </button>
      </div>
    </motion.div>
  );
}

export default ProductCard;
