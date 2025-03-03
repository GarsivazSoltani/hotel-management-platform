// src/components/Navbar/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // فرض می‌کنم CSS داری

// کامپوننت نوار导航 برای جابجایی بین صفحات
const Navbar = () => {
  return (
    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start bg-dark navbar-custom">
      <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
        <li><Link to="/" className="nav-link px-2 text-secondary">ホーム</Link></li>
        <li><Link to="/products" className="nav-link px-2 text-white">商品リスト</Link></li>
        <li><Link to="/manage-products" className="nav-link px-2 text-white">商品管理</Link></li>
        <li><Link to="/warehouses" className="nav-link px-2 text-white">倉庫リスト</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;