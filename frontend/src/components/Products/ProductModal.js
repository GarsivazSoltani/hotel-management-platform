import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap'; // استفاده از کامپوننت‌های بوت استرپ

const ProductModal = ({ show, handleClose, product, updateProduct }) => {
  const [quantity, setQuantity] = useState(0); // مقدار اولیه صفر

  // بررسی وضعیت محصول در هنگام بارگذاری مودال
  useEffect(() => {
    if (product) {
      setQuantity(0);  // مقدار اولیه quantity صفر باشد
    }
  }, [product]);

  const handleIncrease = () => {
    setQuantity(prev => prev + 1); // افزایش تعداد
  };

  const handleDecrease = () => {
    setQuantity(prev => prev - 1); // کاهش تعداد (می‌تواند منفی هم بشه)
  };

  const handleSave = () => {
    if (product && updateProduct) {
      // تغییر موجودی انبار در حالت واقعی باید از API یا منبع داده دیگه گرفته بشه
      const newStock = product.stock + quantity; // اضافه یا کم کردن از موجودی
      updateProduct(product.id, newStock); // به روز رسانی موجودی
      handleClose(); // بستن مودال بعد از ذخیره
    } else {
      console.error('updateProduct is not a function');
    }
  };

  if (!product) {
    return null;  // اگر محصول موجود نیست هیچ چیزی نمایش داده نشود
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Product Details</Modal.Title> {/* عنوان به انگلیسی */}
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-between align-items-center">
          <h5>{product.name}</h5>
          <span className="badge text-bg-primary rounded-pill">{product.stock}</span> {/* تعداد به صورت Badge */}
        </div>
        <div className="d-flex justify-content-between align-items-center my-3">
          <button className="btn btn-danger" onClick={handleDecrease}>-</button>
          <span className="mx-3">{quantity}</span>
          <button className="btn btn-success" onClick={handleIncrease}>+</button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button> {/* دکمه‌ها به انگلیسی */}
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
