// src/components/Navbar/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Form } from 'react-bootstrap';
import { getItemRequests } from '../../services/productService';
import { useLanguage } from '../../lang/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const { currentLang, setCurrentLang, translations } = useLanguage();
  const [pendingTasks, setPendingTasks] = useState(0);

  // تابع بروزرسانی تعداد تسک‌ها
  const fetchPendingTasks = async () => {
    try {
      const data = await getItemRequests();
      const pending = data.filter((req) => req.status === 'pending').length;
      setPendingTasks(pending);
    } catch (error) {
      console.error('خطا در دریافت تسک‌ها:', error);
    }
  };

  useEffect(() => {
    fetchPendingTasks(); // بارگذاری اولیه
    // می‌تونیم بعداً از polling یا WebSocket برای آپدیت لحظه‌ای استفاده کنیم
  }, []);

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start bg-dark navbar-custom">
      <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
        <li><Link to="/" className="nav-link px-2 text-secondary">{translations[currentLang].home}</Link></li>
        <li><Link to="/products" className="nav-link px-2 text-white">{translations[currentLang].products}</Link></li>
        <li><Link to="/manage-products" className="nav-link px-2 text-white">{translations[currentLang].manageProducts}</Link></li>
        <li><Link to="/warehouses" className="nav-link px-2 text-white">{translations[currentLang].warehouses}</Link></li>
        <li>
          <Link to="/tasks" className="nav-link px-2 text-white">
            {translations[currentLang].tasks} {pendingTasks > 0 && <Badge bg="danger">{pendingTasks}</Badge>}
          </Link>
        </li>
        <li>
          <Link to="/requests" className="nav-link px-2 text-white">
            {translations[currentLang].manageProducts.replace('محصولات', 'درخواست‌ها')}
          </Link>
        </li>
      </ul>
      <Form.Select
        size="sm"
        value={currentLang}
        onChange={(e) => setCurrentLang(e.target.value)}
        className="ms-2"
        style={{ width: 'auto' }}
      >
        <option value="fa">فارسی</option>
        <option value="ja">日本語</option>
        <option value="en">English</option>
      </Form.Select>
    </div>
  );
};

export default Navbar;