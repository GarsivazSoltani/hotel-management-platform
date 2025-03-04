import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import useProducts from '../../hooks/useProducts';
import { addProduct, updateStock, deleteProduct, getWarehouses, addItemRequest } from '../../services/productService';
import { useLanguage } from '../../lang/LanguageContext';
import './ProductManagement.css';

const ProductManagement = () => {
  const { products, loading, error, fetchProducts } = useProducts();
  const { currentLang, translations } = useLanguage();
  const [warehouses, setWarehouses] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '', stock: 0, price: 0, description: '', warehouse_id: '',
  });
  const [newRequest, setNewRequest] = useState({
    product_id: '', quantity: 0, warehouse_id: '', direction: 'out', note: '', priority: 2,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDescModal, setShowDescModal] = useState(false);
  const [descProduct, setDescProduct] = useState(null);
  const [isAdmin] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getWarehouses();
        setWarehouses(data);
        if (data.length > 0) {
          setNewProduct((prev) => ({ ...prev, warehouse_id: data[0].id }));
          setNewRequest((prev) => ({ ...prev, warehouse_id: data[0].id }));
        }
      } catch (error) {
        console.error('خطا در دریافت انبارها:', error);
      }
    };
    fetchWarehouses();
  }, []);

  const handleAddProduct = async () => {
    if (newProduct.stock < 0 || newProduct.price < 0) {
      alert(translations[currentLang].invalidInput);
      return;
    }
    try {
      await addProduct(newProduct);
      await fetchProducts();
      setNewProduct({ name: '', stock: 0, price: 0, description: '', warehouse_id: warehouses[0]?.id || '' });
      setShowAddModal(false);
      setMessage(translations[currentLang].addSuccess);
    } catch (error) {
      setMessage(translations[currentLang].addError);
      console.error('خطا در اضافه کردن محصول:', error);
    }
  };

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

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      await fetchProducts();
      setMessage(translations[currentLang].addSuccess.replace('اضافه', 'حذف')); // TODO: بهتره یه پیام جدا برای حذف تعریف کنیم
    } catch (error) {
      setMessage(translations[currentLang].addError.replace('اضافه', 'حذف'));
      console.error('خطا در حذف محصول:', error);
    }
  };

  const handleAddRequest = async () => {
    const selectedProduct = products.find(p => p.id === newRequest.product_id);
    if (!selectedProduct || newRequest.quantity <= 0) {
      alert(translations[currentLang].invalidInput);
      return;
    }
    if (newRequest.direction === 'out' && newRequest.quantity > selectedProduct.stock) {
      alert(translations[currentLang].stockError.replace('{max}', selectedProduct.stock));
      return;
    }
    try {
      await addItemRequest({ ...newRequest, created_by: 1 });
      setNewRequest({ product_id: '', quantity: 0, warehouse_id: '', direction: 'out', note: '', priority: 2 });
      setShowRequestModal(false);
      setMessage(translations[currentLang].addSuccess);
    } catch (error) {
      setMessage(translations[currentLang].addError);
      console.error('خطا در اضافه کردن درخواست:', error);
    }
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowRequestModal = () => setShowRequestModal(true);
  const handleCloseRequestModal = () => setShowRequestModal(false);
  const handleShowDescModal = (product) => {
    setDescProduct(product);
    setShowDescModal(true);
  };
  const handleCloseDescModal = () => setShowDescModal(false);

  const handleProductChange = (selected) => {
    const selectedProduct = selected[0];
    setNewRequest({
      ...newRequest,
      product_id: selectedProduct ? selectedProduct.id : '',
      warehouse_id: selectedProduct ? selectedProduct.warehouse_id : '',
    });
  };

  if (loading) return <div>{translations[currentLang].loading}</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{translations[currentLang].manageProducts}</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {isAdmin && (
        <>
          <Button onClick={handleShowAddModal} className="mb-3 me-2">
            {translations[currentLang].addProduct}
          </Button>
          <Button onClick={handleShowRequestModal} className="mb-3">
            {translations[currentLang].addRequest}
          </Button>
        </>
      )}

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
                  {isAdmin && (
                    <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                      {translations[currentLang].delete}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

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

      <Modal show={showRequestModal} onHide={handleCloseRequestModal}>
        <Modal.Header closeButton>
          <Modal.Title>{translations[currentLang].addRequest}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].product}</Form.Label>
              <Typeahead
                id="product-search"
                labelKey="name"
                options={products}
                placeholder={translations[currentLang].placeholderSearch}
                onChange={handleProductChange}
                selected={newRequest.product_id ? [products.find(p => p.id === newRequest.product_id)] : []}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].quantity}</Form.Label>
              <Form.Control
                type="number"
                value={newRequest.quantity}
                onChange={(e) => setNewRequest({ ...newRequest, quantity: parseInt(e.target.value) || 0 })}
                min="1"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].direction}</Form.Label>
              <Form.Select
                value={newRequest.direction}
                onChange={(e) => setNewRequest({ ...newRequest, direction: e.target.value })}
              >
                <option value="out">{translations[currentLang].receive}</option>
                <option value="in">{translations[currentLang].return}</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].warehouse}</Form.Label>
              <Form.Control
                type="text"
                value={warehouses.find((w) => w.id === newRequest.warehouse_id)?.name || ''}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].note}</Form.Label>
              <Form.Control
                type="text"
                value={newRequest.note}
                onChange={(e) => setNewRequest({ ...newRequest, note: e.target.value })}
                placeholder={translations[currentLang].enterNote}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].priority}</Form.Label>
              <Form.Select
                value={newRequest.priority}
                onChange={(e) => setNewRequest({ ...newRequest, priority: parseInt(e.target.value) })}
              >
                <option value={1}>{translations[currentLang].urgent}</option>
                <option value={2}>{translations[currentLang].normal}</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRequestModal}>
            {translations[currentLang].close}
          </Button>
          <Button variant="primary" onClick={handleAddRequest}>
            {translations[currentLang].save}
          </Button>
        </Modal.Footer>
      </Modal>

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