// src/pages/Products/ProductManagement.js
import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import useProducts from '../../hooks/useProducts'; // هوک برای محصولات
import { addProduct, updateStock, deleteProduct, getWarehouses } from '../../services/productService';
import './ProductManagement.css';

// کامپوننت مدیریت محصولات برای ادمین
const ProductManagement = () => {
  const { products, loading, error, fetchProducts } = useProducts(); // استفاده از هوک
  const [warehouses, setWarehouses] = useState([]); // لیست انبارها
  const [newProduct, setNewProduct] = useState({
    name: '',
    stock: 0,
    price: 0,
    description: '',
    warehouse_id: '',
  }); // داده‌های محصول جدید
  const [showAddModal, setShowAddModal] = useState(false); // وضعیت مودال اضافه کردن
  const [showDescModal, setShowDescModal] = useState(false); // وضعیت مودال توضیحات
  const [descProduct, setDescProduct] = useState(null); // محصول انتخاب‌شده برای مودال
  const [isAdmin] = useState(true); // وضعیت ادمین (فعلاً ثابت)
  const [message, setMessage] = useState(''); // پیام موفقیت یا خطا

  // گرفتن لیست انبارها از API هنگام لود
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getWarehouses();
        setWarehouses(data);
        if (data.length > 0) {
          setNewProduct((prev) => ({ ...prev, warehouse_id: data[0].id }));
        }
      } catch (error) {
        console.error('خطا در دریافت انبارها:', error);
      }
    };
    fetchWarehouses();
  }, []);

  // اضافه کردن محصول جدید
  const handleAddProduct = async () => {
    if (newProduct.stock < 0 || newProduct.price < 0) {
      alert('在庫または価格はマイナスにできません！'); // پیام ژاپنی
      return;
    }
    try {
      await addProduct(newProduct);
      await fetchProducts(); // به‌روزرسانی لیست
      setNewProduct({ name: '', stock: 0, price: 0, description: '', warehouse_id: warehouses[0]?.id || '' });
      setShowAddModal(false);
      setMessage('商品が正常に追加されました！'); // پیام ژاپنی
    } catch (error) {
      setMessage('商品の追加に失敗しました'); // پیام ژاپنی
      console.error('خطا در اضافه کردن محصول:', error);
    }
  };

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

  // حذف محصول
  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      await fetchProducts(); // به‌روزرسانی لیست
      setMessage('商品が正常に削除されました！'); // پیام ژاپنی
    } catch (error) {
      setMessage('商品の削除に失敗しました'); // پیام ژاپنی
      console.error('خطا در حذف محصول:', error);
    }
  };

  // باز کردن مودال اضافه کردن
  const handleShowAddModal = () => setShowAddModal(true);

  // بستن مودال اضافه کردن
  const handleCloseAddModal = () => setShowAddModal(false);

  // باز کردن مودال توضیحات
  const handleShowDescModal = (product) => {
    setDescProduct(product);
    setShowDescModal(true);
  };

  // بستن مودال توضیحات
  const handleCloseDescModal = () => setShowDescModal(false);

  // نمایش وضعیت در حال بارگذاری یا خطا
  if (loading) return <div>商品を読み込み中...</div>; // پیام ژاپنی
  if (error) return <div>{error}</div>;

  return (
    <div className="table-responsive">
      <h2>商品管理</h2>
      {message && <div className="alert alert-success">{message}</div>} {/* پیام موفقیت */}
      {isAdmin && (
        <Button onClick={handleShowAddModal} className="mb-3">
          商品を追加
        </Button>
      )}

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
                {isAdmin && (
                  <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                    削除
                  </Button>
                )}
              </td>
              {/* <td>-</td> */}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* مودال اضافه کردن محصول */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>商品を追加</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>商品名</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="商品名を入力してください"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>初期在庫</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>価格 (¥)</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                placeholder="価格を入力してください"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>説明</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="商品の説明を入力してください"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>倉庫</Form.Label>
              <Form.Select
                value={newProduct.warehouse_id}
                onChange={(e) => setNewProduct({ ...newProduct, warehouse_id: parseInt(e.target.value) })}
              >
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            閉じる
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            保存
          </Button>
        </Modal.Footer>
      </Modal>

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

export default ProductManagement;