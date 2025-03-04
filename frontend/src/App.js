// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Products from './pages/Products/Products';
import ProductManagement from './pages/Products/ProductManagement';
import Home from './pages/Home/Home';
import Warehouses from './pages/Warehouses/Warehouses';
import Tasks from './pages/Tasks/Tasks';
import { getProducts } from './services/productService';
import { LanguageProvider } from './lang/LanguageContext';
import translations from './lang/translations';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('lang') || 'fa');

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

  useEffect(() => {
    localStorage.setItem('lang', currentLang);
  }, [currentLang]);

  if (loading) return <div>{translations[currentLang].loading}</div>;

  return (
    <LanguageProvider value={{ currentLang, setCurrentLang, translations }}>
      <Router>
        <Navbar />
        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/manage-products" element={<ProductManagement />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;