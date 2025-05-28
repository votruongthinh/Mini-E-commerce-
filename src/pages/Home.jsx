import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import Skeleton from "../components/common/Skeleton";
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getCategories,
} from "../utils/api.js";
import banner from "../assets/banner-shopee-5.webp";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 10000000]);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const productsPerPage = 6;

  // Sync search, category, and page from query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search") || "";
    const categoryQuery = params.get("category") || "";
    const pageQuery = parseInt(params.get("page")) || 1;

    setSearch(searchQuery.toLowerCase());
    setTempSearch(searchQuery);
    setCategory(categoryQuery);
    setCurrentPage(pageQuery);
  }, [location.search]);

  // Fetch categories
  useEffect(() => {
    getCategories()
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(
            data.map((cat) => ({
              slug: cat.slug || cat.name,
              name: cat.name || cat.slug,
            }))
          );
        } else {
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  }, []);

  // Fetch max price for price range filter
  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        const data = await getProducts(1, 100);
        if (data.products && Array.isArray(data.products)) {
          const max = Math.max(...data.products.map((p) => p.price * 25000));
          setMaxPrice(max);
          setPriceRange([0, max]);
          setTempPriceRange([0, max]);
        } else {
          setMaxPrice(10000000);
          setPriceRange([0, 10000000]);
          setTempPriceRange([0, 10000000]);
        }
      } catch (error) {
        console.error("Error calculating max price:", error);
        setMaxPrice(10000000);
        setPriceRange([0, 10000000]);
        setTempPriceRange([0, 10000000]);
      }
    };
    fetchMaxPrice();
  }, []);

  // Fetch and filter products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        let data;
        if (search) {
          data = await searchProducts(search.toLowerCase());
          if (data.products && Array.isArray(data.products)) {
            data.products = data.products.filter((product) =>
              product.title.toLowerCase().includes(search.toLowerCase())
            );
          }
        } else if (category) {
          data = await getProductsByCategory(category);
        } else {
          data = await getProducts(1, 100); // Fetch all products for client-side filtering
        }

        if (!data || !data.products || !Array.isArray(data.products)) {
          throw new Error("Invalid API response: products is not an array");
        }

        // Apply filters
        let filteredProducts = data.products.filter(
          (p) =>
            p.price * 25000 >= priceRange[0] &&
            p.price * 25000 <= (priceRange[1] || maxPrice)
        );

        // Apply sorting
        if (sortBy === "price-asc") {
          filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
          filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "name") {
          filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        }

        setProducts(filteredProducts);
        setTotal(filteredProducts.length); // Set total based on filtered count
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotal(0);
        setError(
          category
            ? `No products found in the category "${category}"`
            : search
            ? `No products found with keyword "${search}". Try another keyword!`
            : "Error loading product. Please try again. Check connection or server."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, priceRange, sortBy, maxPrice]);

  // Handle search input change
  const handleSearchChange = (value) => {
    setTempSearch(value);
    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filteredSuggestions = products.filter((product) =>
        product.title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
    }
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (tempSearch.trim() === "") {
      setSearch("");
      setSuggestions([]);
      navigate("/");
    } else {
      setSearch(tempSearch.toLowerCase());
      setSuggestions([]);
      setCurrentPage(1);
      navigate(`/?search=${encodeURIComponent(tempSearch.toLowerCase())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setTempSearch(suggestion.title);
    setSearch(suggestion.title.toLowerCase());
    setSuggestions([]);
    setCurrentPage(1);
    navigate(`/?search=${encodeURIComponent(suggestion.title.toLowerCase())}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(total / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const params = new URLSearchParams(location.search);
      params.set("page", page);
      navigate(`/?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRetry = () => {
    setCurrentPage(1);
    setError("");
    setLoading(true);
  };

  const applyPriceFilter = () => {
    const minPrice = Math.max(0, tempPriceRange[0] || 0);
    const maxPriceValue = Math.min(tempPriceRange[1] || maxPrice, maxPrice);
    if (minPrice > maxPriceValue) {
      toast.error(
        "The minimum price cannot be greater than the maximum price!",
        {
          position: "top-right",
        }
      );
      return;
    }
    setPriceRange([minPrice, maxPriceValue]);
    setCurrentPage(1);
  };

  const getPaginationRange = () => {
    const maxPagesToShow = 3;
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

  const memoizedProducts = useMemo(() => {
    return currentProducts.map((product) => (
      <ProductCard key={product.id} product={product} />
    ));
  }, [currentProducts]);

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

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="bg-[#FB5533] text-white px-4 py-2 rounded hover:bg-[#E6532D]"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (currentProducts.length === 0 && !loading) {
    return (
      <div className="container mx-auto p-4 text-center">No products found</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <motion.div
        className="relative bg-gradient-to-r from-[#FB5533] to-red-500 rounded-lg overflow-hidden mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={banner}
          alt="Banner"
          className="w-full h-auto min-h-48 sm:h-80 lg:h-96 object-contain rounded-lg shadow-lg"
        />
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4">Featured Categories</h2>
        <div className="flex flex-wrap gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.slug}
              to={`/?category=${encodeURIComponent(cat.slug)}`}
              className="bg-white p-3 rounded-lg shadow hover:bg-gray-100 capitalize"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="bg-white p-4 rounded-lg shadow mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="relative mb-4 flex flex-col sm:flex-row sm:items-center gap-2"
        >
          <input
            type="text"
            placeholder="Search for products..."
            value={tempSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full sm:flex-1 px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
          />
          <button
            type="submit"
            className="bg-[#FB5533] text-white px-4 py-2 rounded hover:bg-[#e14c2a] transition"
          >
            Search
          </button>
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {suggestion.title}
                </li>
              ))}
            </ul>
          )}
        </form>

        {/* Filters: category, price, sort */}
        <div className="flex flex-col gap-3">
          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => {
              navigate(`/?category=${encodeURIComponent(e.target.value)}`);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Price filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              placeholder="Price from"
              value={tempPriceRange[0] || ""}
              onChange={(e) =>
                setTempPriceRange([+e.target.value || 0, tempPriceRange[1]])
              }
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB5533] transition-colors"
            />
            <input
              type="number"
              placeholder="To price"
              value={tempPriceRange[1] === maxPrice ? "" : tempPriceRange[1]}
              onChange={(e) =>
                setTempPriceRange([
                  tempPriceRange[0],
                  +e.target.value || maxPrice,
                ])
              }
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB5533] transition-colors"
            />
            <button
              onClick={applyPriceFilter}
              className="bg-[#20C997] text-white px-4 py-2 rounded hover:bg-[#17a589] transition"
            >
              Apply
            </button>
          </div>

          {/* Sort filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Maximum price: {maxPrice.toLocaleString()} VNĐ
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        data-testid="product-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {memoizedProducts}
      </motion.div>

      {totalPages > 1 && (
        <motion.div
          className="cursor-pointer flex justify-center gap-1 sm:gap-2 mt-4 overflow-x-auto scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex justify-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-1 py-0.5 sm:px-3 sm:py-2 bg-gray-200 rounded disabled:opacity-50 min-w-[32px] sm:min-w-[auto] text-sm sm:text-base"
            >
              Previous
            </button>
            {getPaginationRange().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1 py-0.5 sm:px-4 sm:py-2 text-gray-500 min-w-[32px] sm:min-w-[auto] text-sm sm:text-base flex items-center justify-center"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-1 py-0.5 sm:px-4 sm:py-2 rounded min-w-[32px] sm:min-w-[auto] text-sm sm:text-base ${
                    currentPage === page
                      ? "bg-[#FB5533] text-white"
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
              className="px-1 py-0.5 sm:px-4 sm:py-2 bg-gray-200 rounded disabled:opacity-50 min-w-[32px] sm:min-w-[auto] text-sm sm:text-base"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
