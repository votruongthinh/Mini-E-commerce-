import React, { useState, useEffect } from "react";
import { getCategories } from "../../utils/api.js";
import { useCart } from "../../contexts/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/shopee-logo-png.webp";

const NavBar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest(".nav-container") &&
        !event.target.closest(".cart-modal")
      ) {
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

  const handleLogoClick = (e) => {
    e.preventDefault();
    console.log("Logo clicked, navigating to home");
    setSearch("");
    if (isMenuOpen) setIsMenuOpen(false); // Chỉ đóng menu nếu đang mở
    setIsCategoryOpen(false);
    navigate("/");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);

  return (
    <motion.nav
      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-2 sm:p-3 lg:p-4 sticky top-0 z-50 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between nav-container gap-2 sm:gap-3 lg:gap-4">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center justify-center sm:justify-start space-x-2 z-50"
        >
          <motion.img
            src={logo}
            alt="Shopee Clone"
            className="h-10 sm:h-9 lg:h-10 p-1 bg-white border border-gray-300 rounded-md shadow-lg"
            whileTap={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          />
        </Link>
        <button
          className="sm:hidden focus:outline-none absolute right-4 top-2 p-1 bg-white rounded-md shadow-md hover:bg-gray-100 transition-all duration-300 z-60"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-orange-500"
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

        <div
          className={`w-full sm:w-auto ${
            isMenuOpen ? "block" : "hidden sm:flex"
          } sm:items-center sm:space-x-4 md:space-x-6 lg:space-x-8 flex-col sm:flex-row`}
        >
          <form
            onSubmit={handleSearch}
            className="w-full sm:w-64 md:w-72 lg:w-80 mb-2 sm:mb-0 flex items-center"
          >
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-2 h-8 sm:h-10 lg:h-10 text-xs sm:text-base lg:text-base text-gray-800 rounded-l-md border-none focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white shadow-md transition-all duration-300"
            />
            <button
              type="submit"
              className="mb-2 h-7 sm:h-10 lg:h-10 bg-blue-600 px-2 sm:px-2 rounded-r-md hover:bg-blue-700 shadow-md transition-all duration-300 flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5"
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

          <div className="w-full sm:w-auto flex justify-between sm:justify-start space-x-2 sm:space-x-4 md:space-x-6">
            <div className="relative category-group z-40">
              <motion.button
                className="flex items-center space-x-2 text-base sm:text-lg font-medium text-gray-900 hover:text-orange-500 hover:bg-orange-100 hover:rounded-md px-2 py-1 transition-all duration-200"
                onClick={toggleCategory}
                aria-label="Toggle categories menu"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span>Danh mục</span>
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
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
              </motion.button>
              <motion.div
                className={`absolute bg-gray-50 text-gray-800 rounded-lg shadow-lg mt-2 w-44 sm:w-52 border border-gray-200 ${
                  isCategoryOpen ? "block" : "hidden"
                } z-50`}
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
                      className="block px-3 py-1.5 hover:bg-orange-100 hover:text-orange-700 text-sm sm:text-base transition-colors duration-200 capitalize"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-1.5 text-gray-500 text-sm sm:text-base">
                    Không có danh mục
                  </div>
                )}
              </motion.div>
            </div>

            <Link
              to="/favorites"
              className="relative flex items-center justify-center"
            >
              <motion.svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-gray-800"
                fill="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </motion.svg>
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center justify-center"
            >
              <motion.svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-gray-800"
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
                <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-medium shadow-md">
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
