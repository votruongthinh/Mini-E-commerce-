import NavBar from "./components/common/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import CheckOut from "./pages/CheckOut";
import { ToastContainer } from "react-toastify";
import NotFound from "./pages/NotFound";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckOut />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            style={{ top: "80px" }}
          />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
