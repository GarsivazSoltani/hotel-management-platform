import React, { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import ProductModal from './ProductModal'; // اضافه کردن مودال

// const ProductList = ({ products }) => {
const ProductList = ({ products, setProducts, onProductClick }) => {  // 🔥 حالا setProducts رو دریافت می‌کنیم

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // تابع برای به روز رسانی موجودی محصول
  const updateProduct = async (productId, newStock) => {
    console.log(`Sending PUT request to update product ${productId} with new stock: ${newStock}`);

    try {
        // const response = await fetch(`/api/products/${productId}`, {
        const response = await fetch(`http://localhost:8000/api/products/${productId}`, {  // 👈 تغییر مسیر
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stock: newStock }),
        });

        if (!response.ok) {
            throw new Error('Failed to update product stock');
        }

        const data = await response.json();
        console.log('Product updated successfully:', data);

        // لیست محصولات را آپدیت می‌کنیم
        // setProducts(prevProducts =>
        //     prevProducts.map(product =>
        //         product.id === productId ? { ...product, stock: newStock } : product
        //     )
        // );
        setProducts(prevProducts => {
          console.log("Previous products list:", prevProducts); // 🛠 چک کردن مقدار قبلی
          return prevProducts.map(product =>
              product.id === productId ? { ...product, stock: newStock } : product
          );
      });

    } catch (error) {
        console.error('Error updating product:', error);
    }
  };


  const handleShowModal = (product) => {
    setSelectedProduct(product); // انتخاب محصول
    setShowModal(true); // باز کردن مودال
  };

  const handleCloseModal = () => {
    setShowModal(false); // بستن مودال
  };

  return (
    <div>
      <ListGroup>
        {products.map((product) => (
          <ListGroup.Item
            key={product.id}
            action
            onClick={() => handleShowModal(product)}
            className="d-flex justify-content-between align-items-center"
          >
            {product.name}
            <span className="badge text-bg-primary rounded-pill">{product.stock}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {selectedProduct && (
        <ProductModal
          show={showModal}
          handleClose={handleCloseModal}
          product={selectedProduct}
          updateProduct={updateProduct}  // ارسال تابع updateProduct به مودال
        />
      )}
    </div>
  );
};

export default ProductList;
