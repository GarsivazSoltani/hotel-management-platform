import React, { useState, useEffect } from 'react';
import ProductTable from '../../components/ProductTable/ProductTable';
import { getProducts, updateProduct } from '../../services/productService';

const Products = () => {
  const [products, setProducts] = useState([]);

  // گرفتن داده‌های محصولات از سرویس
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // کاهش تعداد موجودی
  const handleDecrease = async (id) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id && product.stock > 0) {
        product.stock -= 1;
      }
      return product;
    });
    setProducts(updatedProducts);
    
    // بروزرسانی محصول در سرور
    await updateProduct(id, { stock: updatedProducts.find((p) => p.id === id).stock });
  };

  // افزایش تعداد موجودی
  const handleIncrease = async (id) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        product.stock += 1;
      }
      return product;
    });
    setProducts(updatedProducts);
    
    // بروزرسانی محصول در سرور
    await updateProduct(id, { stock: updatedProducts.find((p) => p.id === id).stock });
  };

  return (
    <div>
      <h1>مدیریت محصولات</h1>
      <ProductTable
        products={products}
        onDecrease={handleDecrease}
        onIncrease={handleIncrease}
      />
    </div>
  );
};

export default Products;
