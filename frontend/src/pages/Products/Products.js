// src/pages/Products/Products.js
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal } from 'react-bootstrap';
import useProducts from '../../hooks/useProducts';
import { updateStock, getWarehouses } from '../../services/productService';
import { useLanguage } from '../../lang/LanguageContext';
import './Products.css';

const Products = () => {
  const { products, setProducts, loading, error, fetchProducts } = useProducts();
  const { currentLang, translations } = useLanguage();
  const [warehouses, setWarehouses] = useState([]);
  const [showDescModal, setShowDescModal] = useState(false);
  const [descProduct, setDescProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getWarehouses();
        setWarehouses(data);
      } catch (error) {
        console.error('خطا در دریافت انبارها:', error);
      }
    };
    fetchWarehouses();
  }, []);

  const handleIncreaseStock = async (productId, newStock) => {
    if (newStock < 0) {
      alert(translations[currentLang].invalidInput);
      return;
    }
    try {
      await updateStock(productId, newStock);
      await fetchProducts();
      setMessage(newStock > products.find(p => p.id === productId).stock ? translations[currentLang].stockIncreased : translations[currentLang].stockDecreased);
    } catch (error) {
      setMessage(translations[currentLang].stockError.replace('{max}', products.find(p => p.id === productId)?.stock || 0));
      console.error('خطا در به‌روزرسانی موجودی:', error);
    }
  };

  const handleShowDescModal = (product) => {
    setDescProduct(product);
    setShowDescModal(true);
  };

  const handleCloseDescModal = () => {
    setShowDescModal(false);
  };

  if (loading) return <div>{translations[currentLang].loading}</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{translations[currentLang].products}</h1>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>{translations[currentLang].name}</th>
              <th>{translations[currentLang].stock}</th>
              <th>{translations[currentLang].warehouse}</th>
              <th>{translations[currentLang].actions}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Button variant="link" onClick={() => handleShowDescModal(product)}>
                    {product.name}
                  </Button>
                </td>
                <td>{product.stock}</td>
                <td>{warehouses.find((w) => w.id === product.warehouse_id)?.name || product.warehouse_id}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleIncreaseStock(product.id, product.stock + 1)}
                  >
                    +
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="me-2"
                    onClick={() => handleIncreaseStock(product.id, product.stock - 1)}
                  >
                    -
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {descProduct && (
        <Modal show={showDescModal} onHide={handleCloseDescModal}>
          <Modal.Header closeButton>
            <Modal.Title>{translations[currentLang].productDetails}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>{translations[currentLang].name}:</strong> {descProduct.name}</p>
            <p><strong>{translations[currentLang].price}:</strong> ¥{descProduct.price}</p>
            <p><strong>{translations[currentLang].description}:</strong> {descProduct.description || translations[currentLang].none}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDescModal}>
              {translations[currentLang].close}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Products;