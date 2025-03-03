import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ProductModal = ({ show, handleClose, product, updateProduct }) => {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (product) setQuantity(0);
  }, [product]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => prev - 1);

  const handleSave = () => {
    if (product && updateProduct) {
      const newStock = product.stock + quantity; // منفی شدن اوکیه چون آشپز مصرف می‌کنه
      updateProduct(product.id, newStock);
      handleClose();
    }
  };

  if (!product) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>جزئیات محصول</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-between align-items-center">
          <h5>{product.name}</h5>
          <span className="badge text-bg-primary rounded-pill">{product.stock}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center my-3">
          <Button variant="danger" onClick={handleDecrease}>-</Button>
          <span className="mx-3">{quantity}</span>
          <Button variant="success" onClick={handleIncrease}>+</Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>بستن</Button>
        <Button variant="primary" onClick={handleSave}>ذخیره</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;