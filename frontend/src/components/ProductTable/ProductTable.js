import React, { useState, useEffect } from 'react';
import './ProductTable.css';  // اینجا استایل رو وارد می‌کنیم

const ProductTable = ({ products, onDecrease, onIncrease }) => {
  const handleDecrease = (id) => {
    onDecrease(id);
  };

  const handleIncrease = (id) => {
    onIncrease(id);
  };

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>نام محصول</th>
          <th>موجودی</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>
              <span>{product.stock}</span>
            </td>
            <td>
              <button onClick={() => handleDecrease(product.id)}>-</button>
              <button onClick={() => handleIncrease(product.id)}>+</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
