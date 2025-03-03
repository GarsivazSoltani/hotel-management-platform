// src/hooks/useWarehouses.js
import { useState, useEffect } from 'react';
import { getWarehouses } from '../services/productService'; // از سرویس موجود استفاده می‌کنیم

// هوک برای مدیریت انبارها با قابلیت استفاده مجدد
const useWarehouses = () => {
  const [warehouses, setWarehouses] = useState([]); // لیست انبارها
  const [loading, setLoading] = useState(true); // وضعیت بارگذاری
  const [error, setError] = useState(null); // خطاها

  // تابع گرفتن انبارها از API
  const fetchWarehouses = async () => {
    try {
      const data = await getWarehouses();
      setWarehouses(data);
      setError(null);
    } catch (error) {
      setError('倉庫の取得に失敗しました'); // پیام ژاپنی
      console.error('خطا در دریافت انبارها:', error);
    } finally {
      setLoading(false);
    }
  };

  // اجرای اولیه تابع هنگام لود
  useEffect(() => {
    fetchWarehouses();
  }, []);

  // برگرداندن مقادیر و تابع برای استفاده در کامپوننت‌ها
  return { warehouses, setWarehouses, loading, error, fetchWarehouses };
};

export default useWarehouses;