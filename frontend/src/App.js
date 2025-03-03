// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Products from './pages/Products/Products';
import ProductManagement from './pages/Products/ProductManagement';
import Home from './pages/Home/Home';
import Warehouses from './pages/Warehouses/Warehouses'; // اضافه کردن Warehouses
import { getProducts } from './services/productService';

// کامپوننت اصلی برنامه
const App = () => {
  const [loading, setLoading] = useState(true);

  // لود اولیه محصولات برای اطمینان از کارکرد API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await getProducts();
      } catch (error) {
        console.error('خطا در دریافت محصولات:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // نمایش وضعیت بارگذاری
  if (loading) return <div>在庫読み込み中...</div>;

  return (
    <Router>
      <Navbar />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/manage-products" element={<ProductManagement />} />
          <Route path="/warehouses" element={<Warehouses />} /> {/* روت جدید */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;