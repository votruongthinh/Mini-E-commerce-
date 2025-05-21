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
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    //console.log("Query params:", params.toString());
    const searchQuery = params.get("search") || "";
    const categoryQuery = params.get("category") || "";
    setSearch(searchQuery.toLowerCase());
    setTempSearch(searchQuery);
    setCategory(categoryQuery);
    setCurrentPage(1);
  }, [location.search]);

  useEffect(() => {
    getCategories()
      .then((data) => {
        //console.log("Categories data:", data);
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

  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        const data = await getProducts(1, 100);
        //console.log("Products data for max price:", data);
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

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await getProducts(1, 100);
        if (data.products && Array.isArray(data.products)) {
          setAllProducts(data.products);
        } else {
          setAllProducts([]);
        }
      } catch (error) {
        console.error("Error fetching all products for suggestions:", error);
        setAllProducts([]);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        let data;
        if (search) {
          data = await searchProducts(search.toLowerCase());
          //console.log("Search API response:", data);
          if (data.products && Array.isArray(data.products)) {
            data.products = data.products.filter((product) =>
              product.title.toLowerCase().includes(search.toLowerCase())
            );
            data.total = data.products.length;
          }
        } else if (category) {
          data = await getProductsByCategory(category);
        } else {
          data = await getProducts(currentPage, productsPerPage);
        }
        //console.log("Processed API response:", data);
        if (!data || !data.products || !Array.isArray(data.products)) {
          throw new Error("Invalid API response: products is not an array");
        }

        let filteredProducts = data.products.filter(
          (p) =>
            p.price * 25000 >= priceRange[0] &&
            p.price * 25000 <= (priceRange[1] || maxPrice)
        );

        if (sortBy === "price-asc") {
          filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
          filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "name") {
          filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        }

        setProducts(filteredProducts);
        setTotal(data.total || filteredProducts.length);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotal(0);
        setError(
          category
            ? `Không tìm thấy sản phẩm trong danh mục "${category}"`
            : search
            ? `Không tìm thấy sản phẩm với từ khóa "${search}". Hãy thử từ khóa khác!`
            : "Lỗi khi tải sản phẩm. Vui lòng thử lại. Kiểm tra kết nối hoặc server."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, priceRange, sortBy, currentPage, maxPrice]);

  const handleSearchChange = (value) => {
    setTempSearch(value);
    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filteredSuggestions = allProducts.filter((product) =>
        product.title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
    }
  };

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

  const totalPages = Math.ceil(total / productsPerPage);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
      toast.error("Giá tối thiểu không thể lớn hơn giá tối đa!", {
        position: "top-right",
      });
      return;
    }
    setPriceRange([minPrice, maxPriceValue]);
    setCurrentPage(1);
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

  const memoizedProducts = useMemo(() => {
    return products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ));
  }, [products]);

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
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Không tìm thấy sản phẩm
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
          src="/src/assets/banner-shopee-5.webp"
          alt="Banner"
          className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
        />
        {/* <div className="absolute inset-0 flex items-center justify-center text-white">
          <motion.h2
            className="text-2xl sm:text-4xl font-bold"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Siêu khuyến mãi tháng 5!
          </motion.h2>
        </div> */}
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4">Danh mục nổi bật</h2>
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
        {/* Form tìm kiếm */}
        <form
          onSubmit={handleSearch}
          className="relative mb-4 flex flex-col sm:flex-row sm:items-center gap-2"
        >
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={tempSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full sm:flex-1 px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Tìm
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

        {/* Bộ lọc giá, danh mục, sắp xếp */}
        <div className="flex flex-col gap-3">
          {/* Danh mục */}
          <select
            value={category}
            onChange={(e) => {
              navigate(`/?category=${encodeURIComponent(e.target.value)}`);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Lọc giá */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              placeholder="Giá từ"
              value={tempPriceRange[0] || ""}
              onChange={(e) =>
                setTempPriceRange([+e.target.value || 0, tempPriceRange[1]])
              }
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <button
              onClick={applyPriceFilter}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Áp dụng
            </button>
          </div>

          {/* Sắp xếp */}
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
        data-testid="product-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {memoizedProducts}
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

export default Home;
