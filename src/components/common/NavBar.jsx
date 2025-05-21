import React, { useState, useEffect } from "react";
import { getCategories } from "../../utils/api.js";
import { useCart } from "../../contexts/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const NavBar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Lấy dữ liệu danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(
          data.slice(0, 5).map((cat) => ({
            slug: cat.slug || cat.name,
            name: cat.name || cat.slug,
          }))
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".nav-container")) {
        setIsMenuOpen(false);
      }
      if (isCategoryOpen && !event.target.closest(".category-group")) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isCategoryOpen]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.toLowerCase())}`);
      setSearch("");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);

  return (
    <motion.nav
      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-2 sm:p-3 lg:p-4 sticky top-0 z-30 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between nav-container gap-2 sm:gap-3 lg:gap-4">
        {/* Logo (giữa trên mobile, trái trên tablet/desktop) */}
        <Link
          to="/"
          className="flex items-center justify-center sm:justify-start space-x-2"
        >
          <motion.img
            src="/src/assets/shopee-logo-png.webp"
            alt="Shopee Clone"
            className="h-7 sm:h-9 lg:h-10"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          />
        </Link>

        {/* Toggle menu hamburger */}
        <button
          className="sm:hidden focus:outline-none absolute right-2 top-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>

        {/* Nội dung chính */}
        <div
          className={`w-full sm:w-auto ${
            isMenuOpen ? "block" : "hidden sm:flex"
          } sm:items-center sm:space-x-4 md:space-x-6 lg:space-x-8 flex-col sm:flex-row`}
        >
          {/* Thanh tìm kiếm (dưới logo trên mobile, ngang trên tablet/desktop) */}
          <form
            onSubmit={handleSearch}
            className="w-full sm:w-64 md:w-72 lg:w-96 mb-2 sm:mb-0 flex items-center"
          >
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 text-sm sm:text-base lg:text-lg text-gray-800 rounded-l-md border-none focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white shadow-md transition-all duration-300"
            />
            <button
              type="submit"
              className="bg-blue-600 p-2 rounded-r-md hover:bg-blue-700 shadow-md transition-all duration-300"
            >
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* Danh mục và giỏ hàng */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start sm:space-x-4 md:space-x-6 lg:space-x-8">
            {/* Danh mục */}
            <div className="relative category-group">
              <button
                className="flex items-center space-x-1 hover:text-yellow-200 text-sm sm:text-base lg:text-lg font-medium transition-colors duration-200"
                onClick={toggleCategory}
                aria-label="Toggle categories menu"
              >
                <span>Danh mục</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <motion.div
                className={`absolute bg-white text-gray-800 rounded-lg shadow-lg mt-2 w-40 sm:w-48 lg:w-56 border border-gray-100 ${
                  isCategoryOpen ? "block" : "hidden"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: isCategoryOpen ? 1 : 0,
                  y: isCategoryOpen ? 0 : -10,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/?category=${encodeURIComponent(cat.slug)}`}
                      className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-600 text-sm lg:text-base transition-colors duration-200 capitalize"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    Không có danh mục
                  </div>
                )}
              </motion.div>
            </div>

            {/* Giỏ hàng */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center"
            >
              <motion.svg
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </motion.svg>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs lg:text-sm font-medium shadow-md">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
