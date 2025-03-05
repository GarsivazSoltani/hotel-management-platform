// src/pages/Products/ProductManagement.js
import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import useProducts from '../../hooks/useProducts'; // هوک برای مدیریت محصولات
import { addProduct, updateStock, deleteProduct, getWarehouses } from '../../services/productService'; // سرویس‌های API
import { useLanguage } from '../../lang/LanguageContext'; // برای چندزبانگی
import './ProductManagement.css';

const ProductManagement = () => {
  const { products, loading, error, fetchProducts } = useProducts(); // گرفتن محصولات از هوک
  const { currentLang, translations } = useLanguage(); // گرفتن زبان فعلی و ترجمه‌ها
  const [warehouses, setWarehouses] = useState([]); // لیست انبارها
  const [newProduct, setNewProduct] = useState({
    name: '', stock: 0, price: 0, description: '', warehouse_id: '',
  }); // اطلاعات محصول جدید
  const [showAddModal, setShowAddModal] = useState(false); // وضعیت مودال اضافه کردن محصول
  const [showDescModal, setShowDescModal] = useState(false); // وضعیت مودال جزئیات محصول
  const [descProduct, setDescProduct] = useState(null); // محصول انتخاب‌شده برای جزئیات
  const [isAdmin] = useState(true); // وضعیت ادمین (فعلاً هاردکد شده)
  const [message, setMessage] = useState(''); // پیام وضعیت عملیات

  // گرفتن لیست انبارها هنگام لود صفحه
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getWarehouses();
        setWarehouses(data);
        if (data.length > 0) {
          setNewProduct((prev) => ({ ...prev, warehouse_id: data[0].id })); // تنظیم انبار پیش‌فرض
        }
      } catch (error) {
        console.error('خطا در دریافت انبارها:', error);
      }
    };
    fetchWarehouses();
  }, []);

  // تابع اضافه کردن محصول جدید
  const handleAddProduct = async () => {
    if (newProduct.stock < 0 || newProduct.price < 0) {
      alert(translations[currentLang].invalidInput); // خطا برای ورودی نامعتبر
      return;
    }
    try {
      await addProduct(newProduct);
      await fetchProducts(); // بروزرسانی لیست محصولات
      setNewProduct({ name: '', stock: 0, price: 0, description: '', warehouse_id: warehouses[0]?.id || '' }); // ریست فرم
      setShowAddModal(false); // بستن مودال
      setMessage(translations[currentLang].addSuccess); // پیام موفقیت
    } catch (error) {
      setMessage(translations[currentLang].addError); // پیام خطا
      console.error('خطا در اضافه کردن محصول:', error);
    }
  };

  // تابع افزایش یا کاهش موجودی محصول
  const handleIncreaseStock = async (productId, newStock) => {
    if (newStock < 0) {
      alert(translations[currentLang].invalidInput); // خطا برای موجودی منفی
      return;
    }
    try {
      await updateStock(productId, newStock);
      await fetchProducts(); // بروزرسانی لیست
      setMessage(newStock > products.find(p => p.id === productId).stock ? translations[currentLang].stockIncreased : translations[currentLang].stockDecreased); // پیام تغییر موجودی
    } catch (error) {
      setMessage(translations[currentLang].stockError.replace('{max}', products.find(p => p.id === productId)?.stock || 0)); // پیام خطای موجودی
      console.error('خطا در به‌روزرسانی موجودی:', error);
    }
  };

  // تابع حذف محصول
  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      await fetchProducts(); // بروزرسانی لیست
      setMessage(translations[currentLang].addSuccess.replace('اضافه', 'حذف')); // پیام موفقیت حذف
    } catch (error) {
      setMessage(translations[currentLang].addError.replace('اضافه', 'حذف')); // پیام خطا
      console.error('خطا در حذف محصول:', error);
    }
  };

  // توابع باز و بسته کردن مودال‌ها
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowDescModal = (product) => {
    setDescProduct(product);
    setShowDescModal(true);
  };
  const handleCloseDescModal = () => setShowDescModal(false);

  // وضعیت لودینگ یا خطا
  if (loading) return <div>{translations[currentLang].loading}</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{translations[currentLang].manageProducts}</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {isAdmin && (
        <Button onClick={handleShowAddModal} className="mb-3">
          {translations[currentLang].addProduct} {/* دکمه اضافه کردن محصول */}
        </Button>
      )}

      {/* جدول محصولات */}
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
                    {product.name} {/* نام محصول به صورت لینک برای جزئیات */}
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
                    + {/* افزایش موجودی */}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="me-2"
                    onClick={() => handleIncreaseStock(product.id, product.stock - 1)}
                  >
                    - {/* کاهش موجودی */}
                  </Button>
                  {isAdmin && (
                    <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                      {translations[currentLang].delete} {/* دکمه حذف */}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* مودال اضافه کردن محصول */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>{translations[currentLang].addProduct}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].productName}</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder={translations[currentLang].enterProductName}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].initialStock}</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].price}</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                placeholder={translations[currentLang].enterPrice}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].description}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder={translations[currentLang].enterDescription}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].warehouse}</Form.Label>
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
            {translations[currentLang].close}
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            {translations[currentLang].save}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* مودال نمایش جزئیات محصول */}
      <Modal show={showDescModal} onHide={handleCloseDescModal}>
        <Modal.Header closeButton>
          <Modal.Title>{translations[currentLang].productDetails}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>{translations[currentLang].name}:</strong> {descProduct?.name}</p>
          <p><strong>{translations[currentLang].price}:</strong> ¥{descProduct?.price}</p>
          <p><strong>{translations[currentLang].description}:</strong> {descProduct?.description || translations[currentLang].none}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDescModal}>
            {translations[currentLang].close}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductManagement;