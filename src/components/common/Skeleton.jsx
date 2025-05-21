import { motion } from "framer-motion";

const Skeleton = () => {
  return (
    <motion.div
      className="bg-white p-4 rounded-lg shadow animate-pulse"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      data-testid="skeleton"
    >
      <div className="w-full h-40 bg-gray-200 rounded"></div>
      <div className="mt-2 h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="flex gap-2 mt-2">
        <div className="h-10 bg-gray-200 rounded w-20"></div>
        <div className="h-10 bg-gray-200 rounded w-20"></div>
      </div>
    </motion.div>
  );
};

export default Skeleton;
