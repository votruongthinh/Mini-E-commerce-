# Mini E-Commerce

Framework chính: ReactJS (vite)
Sytling sử dụng: TailwindCss
Quản lý state sử dụng :useState /ContextAPI / Zustand
Sử dụng Routing
Gọi APi bằng Axios
Sử dụng fakeAPi bằng dummyjson.com
Lưu trạng thái tạm thời bằng localStorage / sessionStorage
Sử dụng hiệu ứng Frammer Motion
deloy lên vercel

1.Clone src về máy:
git clone https://github.com/votruongthinh/Mini-E-commerce-.git
cd Mini-E-commerce

2.cài đặt thư viện
npm install (node_modules)
npm install @tailwindcss/vite axios framer-motion react react-dom react-lazy-load-image-component react-router-dom react-toastify zustand

3. cài đặt và test với Vitest

   - Cài các package cần thiết:
     npm install --save-dev vitest @testing-library/user-event @testing-library/react @testing-library/jest-dom jsdom

   - Tạo file vitest.config.js:
     import { defineConfig } from 'vitest/config'; import react from '@vitejs/plugin-react';

     export default defineConfig({ plugins: [react()], test: { environment: 'jsdom', globals: true, setupFiles: './setupTests.js' }, });

   -Tạo file setupTests.js ở thư mục gốc
   import '@testing-library/jest-dom';

   -sử dụng câu lệnh để chạy test
   npm run test

4. chạy dự án với lệnh
   npm run dev
