// src/hooks/useItemRequests.js
import { useState, useEffect } from 'react';
import { getItemRequests } from '../services/productService';

// هوک برای مدیریت درخواست‌های اقلام
const useItemRequests = () => {
  const [itemRequests, setItemRequests] = useState([]); // لیست درخواست‌ها
  const [loading, setLoading] = useState(true); // وضعیت بارگذاری
  const [error, setError] = useState(null); // خطاها

  // تابع گرفتن درخواست‌ها از API
  const fetchItemRequests = async () => {
    try {
      const data = await getItemRequests();
      setItemRequests(data);
      setError(null);
    } catch (error) {
      setError('要求の取得に失敗しました'); // پیام ژاپنی
      console.error('خطا در دریافت درخواست‌ها:', error);
    } finally {
      setLoading(false);
    }
  };

  // اجرای اولیه تابع هنگام لود
  useEffect(() => {
    fetchItemRequests();
  }, []);

  // برگرداندن مقادیر و تابع
  return { itemRequests, setItemRequests, loading, error, fetchItemRequests };
};

export default useItemRequests;