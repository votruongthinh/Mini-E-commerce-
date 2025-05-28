import React, { useState, useEffect } from "react";
import { getCategories, getProducts } from "../../utils/api.js";
import { useCart } from "../../contexts/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/shopee-logo-png.webp";

// Utility for debouncing
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const NavBar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setCategoryError(null);
      try {
        // Assuming clearCategoriesCache is available in api.js
        // Uncomment if implemented: await clearCategoriesCache();
        const data = await getCategories();
        console.log("Categories data received in NavBar:", data);
        setCategories(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching categories in NavBar:", error);
        setCategoryError(error.message || "Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();

    const fetchProductsForSuggestions = async () => {
      try {
        const data = await getProducts(1, 50);
        console.log("Products data for suggestions:", data.products);
        setAllProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products for suggestions:", error);
      }
    };
    fetchProductsForSuggestions();
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
      if (isSuggestionOpen && !event.target.closest(".suggestion-group")) {
        setIsSuggestionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isCategoryOpen, isSuggestionOpen]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.toLowerCase())}`);
      setSearch("");
      setIsSuggestionOpen(false);
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    console.log("Logo clicked, navigating to home");
    setSearch("");
    if (isMenuOpen) setIsMenuOpen(false);
    setIsCategoryOpen(false);
    setIsSuggestionOpen(false);
    navigate("/");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);

  // Debounced input change handler for suggestions
  const debouncedSetSuggestions = debounce((value) => {
    if (value) {
      const filteredSuggestions = allProducts
        .filter((product) =>
          product.title.toLowerCase().includes(value.toLowerCase())
        )
        .map((product) => product.title)
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setIsSuggestionOpen(true);
    } else {
      setSuggestions([]);
      setIsSuggestionOpen(false);
    }
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSetSuggestions(value);
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearch(suggestion);
    setIsSuggestionOpen(false);
    navigate(`/?search=${encodeURIComponent(suggestion.toLowerCase())}`);
  };

  return (
    <motion.nav
      className="bg-gradient-to-r from-[#FB5533] to-[#E6532D] text-white p-3 sm:p-4 lg:p-5 sticky top-0 z-50 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto nav-container flex flex-wrap items-center justify-between gap-4">
        {/* Logo + Toggle Menu */}
        <div className="flex items-center sm:w-[180px] w-full justify-between sm:justify-start">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center space-x-2 z-50"
          >
            <motion.img
              src={logo}
              alt="Shopee Clone"
              className="h-10 sm:h-11 lg:h-12 p-1 bg-white border border-gray-300 rounded-md shadow-lg"
              whileTap={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            />
          </Link>
          <button
            className="sm:hidden focus:outline-none p-2 bg-white rounded-md shadow-md hover:bg-gray-100 transition-all duration-300 z-60"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-[#FB5533]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"
                }
              />
            </svg>
          </button>
        </div>

        {/* Search Bar with Suggestions */}
        <div
          className={`flex-grow ${isMenuOpen ? "block" : "hidden sm:block"}`}
        >
          <div className="relative suggestion-group">
            <form
              onSubmit={handleSearch}
              className="w-full max-w-2xl mx-auto flex items-center"
            >
              <input
                type="text"
                placeholder="Search for products..."
                value={search}
                onChange={handleInputChange}
                onFocus={() => search && setIsSuggestionOpen(true)}
                className="w-full h-10 sm:h-11 lg:h-12 text-sm sm:text-base lg:text-lg text-gray-800 rounded-l-md border-none focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white shadow-md transition-all duration-300"
              />
              <button
                type="submit"
                className="h-10 sm:h-11 lg:h-12 bg-[#FB5533] px-3 lg:px-4 rounded-r-md hover:bg-[#E6532D] shadow-lg transition-all duration-300 flex items-center justify-center"
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
            {isSuggestionOpen && suggestions.length > 0 && (
              <motion.div
                className="absolute left-0 w-full bg-white text-gray-800 rounded-lg shadow-lg mt-1 z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-orange-100 cursor-pointer text-sm sm:text-base"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Category & Icons */}
        <div
          className={`flex items-center gap-4 sm:w-[220px] justify-between sm:justify-end w-full ${
            isMenuOpen ? "block" : "hidden sm:flex"
          }`}
        >
          {/* Category Dropdown */}
          <div className="relative category-group z-40">
            <motion.button
              className="flex items-center space-x-2 text-base sm:text-lg lg:text-xl text-gray-900 hover:text-[#FB5533] hover:bg-orange-100 hover:rounded-md px-3 py-2 transition-all duration-200"
              onClick={toggleCategory}
              aria-label="Toggle categories menu"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span>Category</span>
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.button>
            <motion.div
              className={`absolute left-0 bg-gray-50 text-gray-800 rounded-lg shadow-lg mt-2 w-48 lg:w-56 border border-gray-200 ${
                isCategoryOpen ? "block" : "hidden"
              } z-50`}
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: isCategoryOpen ? 1 : 0,
                y: isCategoryOpen ? 0 : -10,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {loadingCategories ? (
                <div className="px-4 py-2 text-gray-500 text-sm lg:text-base">
                  Loading categories...
                </div>
              ) : categoryError ? (
                <div className="px-4 py-2 text-red-500 text-sm lg:text-base">
                  {categoryError}{" "}
                  <button
                    onClick={() => fetchCategories()}
                    className="underline text-blue-500"
                  >
                    Retry
                  </button>
                </div>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/?category=${encodeURIComponent(cat.slug)}`}
                    className="block px-4 py-2 hover:bg-orange-100 hover:text-orange-700 text-sm sm:text-base lg:text-lg transition-colors duration-200 capitalize"
                    onClick={() => setIsCategoryOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-sm lg:text-base">
                  No categories available.
                </div>
              )}
            </motion.div>
          </div>

          {/* Favorites + Cart */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link
              to="/favorites"
              className="relative flex items-center justify-center"
            >
              <motion.svg
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-800 rounded hover:text-[#FB5533] hover:bg-orange-100"
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
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-800 rounded hover:text-[#FB5533] hover:bg-orange-100"
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
                <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs lg:text-sm font-sans shadow-md">
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
