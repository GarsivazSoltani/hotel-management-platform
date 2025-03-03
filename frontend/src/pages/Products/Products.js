// src/pages/Products/Products.js
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal } from 'react-bootstrap';
import useProducts from '../../hooks/useProducts'; // هوک برای محصولات
import { updateStock, getWarehouses } from '../../services/productService';
import './Products.css';

// کامپوننت صفحه محصولات برای کاربران عادی
const Products = () => {
  const { products, loading, error, fetchProducts } = useProducts(); // استفاده از هوک
  const [warehouses, setWarehouses] = useState([]); // لیست انبارها
  const [showDescModal, setShowDescModal] = useState(false); // وضعیت مودال توضیحات
  const [descProduct, setDescProduct] = useState(null); // محصول انتخاب‌شده برای مودال
  const [message, setMessage] = useState(''); // پیام موفقیت یا خطا

  // گرفتن لیست انبارها از API هنگام لود
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

  // افزایش یا کاهش موجودی محصول
  const handleIncreaseStock = async (productId, newStock) => {
    if (newStock < 0) {
      alert('在庫はマイナスにできません！'); // پیام ژاپنی
      return;
    }
    try {
      await updateStock(productId, newStock);
      await fetchProducts(); // به‌روزرسانی لیست
      setMessage(newStock > products.find(p => p.id === productId).stock ? '在庫が増加しました！' : '在庫が減少しました！'); // پیام ژاپنی
    } catch (error) {
      setMessage('在庫の更新に失敗しました'); // پیام ژاپنی
      console.error('خطا در به‌روزرسانی موجودی:', error);
    }
  };

  // باز کردن مودال توضیحات
  const handleShowDescModal = (product) => {
    setDescProduct(product);
    setShowDescModal(true);
  };

  // بستن مودال توضیحات
  const handleCloseDescModal = () => {
    setShowDescModal(false);
  };

  // نمایش وضعیت در حال بارگذاری یا خطا
  if (loading) return <div>商品を読み込み中...</div>; // پیام ژاپنی
  if (error) return <div>{error}</div>;

  return (
    <div className="table-responsive">
      <h1>商品リスト</h1>
      {message && <div className="alert alert-success">{message}</div>} {/* پیام موفقیت */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>名前</th>
            <th>在庫</th>
            {/* <th>価格</th> */}
            <th>倉庫</th>
            <th>操作</th>
            {/* <th>画像</th> */}
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
              {/* <td>¥{product.price}</td> */}
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
              {/* <td>-</td> */}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* مودال نمایش جزئیات محصول */}
      {descProduct && (
        <Modal show={showDescModal} onHide={handleCloseDescModal}>
          <Modal.Header closeButton>
            <Modal.Title>商品詳細</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>名前:</strong> {descProduct.name}</p>
            <p><strong>価格:</strong> ¥{descProduct.price}</p>
            <p><strong>説明:</strong> {descProduct.description || 'なし'}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDescModal}>
              閉じる
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Products;