import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "../contexts/CartContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ProductCard from "../components/product/ProductCard";
import Skeleton from "../components/common/Skeleton";
import banner from "../assets/banner-shopee-5.webp";

const FavoritesPage = () => {
  const { favorites: allFavorites, toggleFavorite } = useCart();
  const [favorites, setFavorites] = useState([]);
  const [total, setTotal] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 10000000]);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 6;

  // Tính maxPrice và priceRange, đảm bảo giá gốc chưa nhân 25000
  useEffect(() => {
    if (allFavorites.length > 0) {
      const max = Math.max(...allFavorites.map((p) => p.price * 25000));
      setMaxPrice(max);
      setPriceRange([0, max]);
      setTempPriceRange([0, max]);
    } else {
      setMaxPrice(10000000);
      setPriceRange([0, 10000000]);
      setTempPriceRange([0, 10000000]);
    }
  }, [allFavorites]);

  // Lọc và sắp xếp danh sách yêu thích
  useEffect(() => {
    setLoading(true);
    let filteredFavorites = allFavorites.filter(
      (p) =>
        p.price * 25000 >= priceRange[0] &&
        p.price * 25000 <= (priceRange[1] || maxPrice)
    );

    if (sortBy === "price-asc") {
      filteredFavorites.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filteredFavorites.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filteredFavorites.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFavorites(filteredFavorites);
    setTotal(filteredFavorites.length);
    setLoading(false);
  }, [allFavorites, priceRange, sortBy, maxPrice]);

  // Áp dụng bộ lọc giá
  const applyPriceFilter = () => {
    const minPrice = Math.max(0, tempPriceRange[0] || 0);
    const maxPriceValue = Math.min(tempPriceRange[1] || maxPrice, maxPrice);
    if (minPrice > maxPriceValue) {
      toast.error("Giá tối thiểu không thể lớn hơn giá tối đa!", {
        position: "top-right",
      });
      return;
    }
    setPriceRange([minPrice, maxPriceValue]);
    setCurrentPage(1);
  };

  // Xóa một sản phẩm khỏi danh sách yêu thích
  const handleRemoveFavorite = (productId) => {
    const product = allFavorites.find((p) => p.id === productId);
    if (product) {
      toggleFavorite(product);
      toast.success("Đã xóa sản phẩm khỏi danh sách yêu thích!", {
        position: "top-right",
      });
    }
  };

  // Xóa toàn bộ danh sách yêu thích
  const handleClearFavorites = () => {
    allFavorites.forEach((product) => {
      toggleFavorite(product);
    });
    toast.success("Đã xóa toàn bộ danh sách yêu thích!", {
      position: "top-right",
    });
  };

  const totalPages = Math.ceil(total / productsPerPage);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPaginationRange = () => {
    const maxPagesToShow = 5;
    const ellipsis = "...";

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const halfRange = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end === totalPages) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push(ellipsis);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(ellipsis);
      pages.push(totalPages);
    }

    return pages;
  };

  const memoizedFavorites = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return favorites.slice(startIndex, endIndex).map((product) => (
      <div key={product.id} className="relative">
        <ProductCard product={product} priceFormatted={product.price * 25000} />

        <button
          onClick={() => handleRemoveFavorite(product.id)}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          title="Xóa khỏi danh sách yêu thích"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    ));
  }, [favorites, currentPage]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: productsPerPage }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-500">Chưa có sản phẩm yêu thích nào.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <motion.div
        className="relative bg-gradient-to-r from-orange-400 to-red-500 rounded-lg overflow-hidden mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={banner}
          alt="Banner"
          className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
        />
      </motion.div>

      <motion.div
        className="bg-white p-4 rounded-lg shadow mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Sản phẩm yêu thích</h2>
          {favorites.length > 0 && (
            <button
              onClick={handleClearFavorites}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Xóa tất cả
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              placeholder="Giá từ"
              value={tempPriceRange[0] || ""}
              onChange={(e) =>
                setTempPriceRange([+e.target.value || 0, tempPriceRange[1]])
              }
              className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <input
              type="number"
              placeholder="Đến"
              value={tempPriceRange[1] === maxPrice ? "" : tempPriceRange[1]}
              onChange={(e) =>
                setTempPriceRange([
                  tempPriceRange[0],
                  +e.target.value || maxPrice,
                ])
              }
              className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <button
              onClick={applyPriceFilter}
              className="w-full sm:w-auto px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Áp dụng
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
          >
            <option value="">Sắp xếp</option>
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
            <option value="name">Tên: A-Z</option>
          </select>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Giá tối đa: {maxPrice.toLocaleString()} đ
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {memoizedFavorites}
      </motion.div>

      {totalPages > 1 && (
        <motion.div
          className="flex justify-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Trước
          </button>
          {getPaginationRange().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-4 py-2 text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded ${
                  currentPage === page
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Sau
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default FavoritesPage;
