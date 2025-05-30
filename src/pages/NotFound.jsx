import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import notFoundImage from "../assets/notfound.jpg"; // Import hình ảnh

const NotFound = () => {
  return (
    <motion.div
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center">
        <motion.img
          src={notFoundImage}
          alt="404 Not Found"
          className="mx-auto mb-6 w-48 sm:w-64"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          onError={(e) => {
            console.error("Image failed to load:", e);
            e.target.src = "https://via.placeholder.com/300x200?text=404"; // Fallback
          }}
        />
        <h1 className="text-3xl sm:text-4xl font-sans text-gray-800 mb-4">
          Oops! Page not found
        </h1>
        <p className="text-gray-600 mb-6">
          Looks like you got lost. Don't worry, just go back to the home page to
          continue shopping!
        </p>
        <Link
          to="/"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-sans hover:bg-orange-600"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            Back to Home
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;
