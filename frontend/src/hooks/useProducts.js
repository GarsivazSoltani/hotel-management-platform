// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';

// هوک برای مدیریت محصولات با قابلیت استفاده مجدد
const useProducts = () => {
  const [products, setProducts] = useState([]); // لیست محصولات
  const [loading, setLoading] = useState(true); // وضعیت بارگذاری
  const [error, setError] = useState(null); // خطاها

  // تابع گرفتن محصولات از API
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (error) {
      setError('خطا در دریافت محصولات');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // اجرای اولیه تابع هنگام لود
  useEffect(() => {
    fetchProducts();
  }, []);

  // برگرداندن مقادیر و تابع برای استفاده در کامپوننت‌ها
  return { products, setProducts, loading, error, fetchProducts };
};

export default useProducts;