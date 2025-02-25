import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Warehouses from './pages/Warehouses/Warehouses';
import Products from './pages/Products/Products';
import Navbar from './components/Navbar/Navbar';
import { getProducts } from './services/productService'; // وارد کردن سرویس
import ProductList from './components/Products/ProductList'; // وارد کردن کامپوننت لیست محصولات
import ProductModal from './components/Products/ProductModal'; // وارد کردن مودال

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);  // برای کنترل نمایش مودال
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);  // داده‌های محصولات را به state اضافه می‌کنیم
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);  // پس از دریافت داده‌ها، حالت loading به false تغییر می‌کند
      }
    };

    fetchProducts();  // دریافت داده‌ها
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);  // باز کردن مودال هنگام کلیک روی محصول
  };

  const handleCloseModal = () => {
    setShowModal(false);  // بستن مودال
  };

  const handleSaveProduct = (id, quantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, quantity } : product
      )
    );
    setShowModal(false);  // بستن مودال پس از ذخیره
  };

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <Router>
      <div>
        <Navbar />
        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route
              path="/products"
              element={<ProductList products={products} setProducts={setProducts} onProductClick={handleProductClick} />}
            />
          </Routes>
        </div>

        {/* مودال */}
        <ProductModal
          show={showModal}
          product={selectedProduct}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
        />
      </div>
    </Router>
  );
};

export default App;
