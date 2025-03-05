// src/pages/Requests/Requests.js
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import useItemRequests from '../../hooks/useItemRequests';
import useProducts from '../../hooks/useProducts';
import { addItemRequest, updateItemRequest, deleteItemRequest } from '../../services/productService';
import { useLanguage } from '../../lang/LanguageContext';
import './Requests.css';

const Requests = () => {
  const { itemRequests, loading: requestsLoading, fetchItemRequests } = useItemRequests();
  const { products, loading: productsLoading } = useProducts();
  const { currentLang, translations } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newRequest, setNewRequest] = useState({
    product_id: null,
    quantity: 0,
    warehouse_id: '',
    direction: 'out',
    note: '',
    priority: 2,
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (showModal) {
      if (editingRequest) {
        setNewRequest({ ...editingRequest });
      } else if (products.length > 0) {
        setNewRequest({
          product_id: null,
          quantity: 0,
          warehouse_id: products[0]?.warehouse_id || '',
          direction: 'out',
          note: '',
          priority: 2,
        });
      }
    }
  }, [showModal, editingRequest, products]);

  const handleAddOrEditRequest = async () => {
    const selectedProduct = products.find(p => p.id === newRequest.product_id);
    if (!selectedProduct || newRequest.quantity <= 0) {
      setMessage(translations[currentLang].invalidInput);
      setIsError(true);
      return;
    }
    if (newRequest.direction === 'out' && newRequest.quantity > selectedProduct.stock) {
      setMessage(translations[currentLang].stockError.replace('{max}', selectedProduct.stock));
      setIsError(true);
      return;
    }
    try {
      if (editingRequest) {
        await updateItemRequest(editingRequest.id, { ...newRequest, status: editingRequest.status });
        setMessage(translations[currentLang].addSuccess.replace('اضافه', 'ویرایش'));
        setIsError(false);
      } else {
        await addItemRequest({ ...newRequest, created_by: 1 });
        setMessage(translations[currentLang].addSuccess);
        setIsError(false);
      }
      await fetchItemRequests();
      setShowModal(false);
    } catch (error) {
      setMessage(error.response?.data?.message || translations[currentLang].addError);
      setIsError(true);
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      await deleteItemRequest(id);
      await fetchItemRequests();
      setMessage(translations[currentLang].addSuccess.replace('اضافه', 'حذف'));
      setIsError(false);
    } catch (error) {
      setMessage(translations[currentLang].addError.replace('اضافه', 'حذف'));
      setIsError(true);
    }
  };

  const handleShowModal = (request = null) => {
    if (request) {
      setEditingRequest(request);
      setNewRequest({ ...request });
    } else {
      setEditingRequest(null);
      setNewRequest({ product_id: null, quantity: 0, warehouse_id: '', direction: 'out', note: '', priority: 2 });
    }
    setMessage('');
    setIsError(false);
    setShowModal(true);
  };

  const handleShowDetailsModal = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  const handleProductChange = (selected) => {
    const product = selected[0];
    setNewRequest({
      ...newRequest,
      product_id: product ? product.id : null,
      warehouse_id: product ? product.warehouse_id || '' : '',
    });
  };

  if (requestsLoading || productsLoading) return <div>{translations[currentLang].loading}</div>;

  const sortedRequests = [...itemRequests].sort((a, b) => {
    if (a.status === 'pending' && b.status === 'done') return -1;
    if (a.status === 'done' && b.status === 'pending') return 1;
    return 0;
  });

  return (
    <div>
      <h1>{translations[currentLang].manageProducts.replace('محصولات', 'درخواست‌ها')}</h1>
      {!showModal && message && (
        <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}
      <Button onClick={() => handleShowModal()} className="mb-3">
        {translations[currentLang].addRequest}
      </Button>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>{translations[currentLang].productName}</th>
              <th>{translations[currentLang].quantity}</th>
              <th>{translations[currentLang].actions}</th>
            </tr>
          </thead>
          <tbody>
            {sortedRequests.map((request) => (
              <tr key={request.id}>
                <td>
                  <Button variant="link" onClick={() => handleShowDetailsModal(request)}>
                    {request.product?.name || 'Unknown'}
                  </Button>
                </td>
                <td>{request.quantity}</td>
                <td>
                  {request.status === 'pending' && (
                    <>
                      <Button variant="primary" size="sm" className="me-2" onClick={() => handleShowModal(request)}>
                        {translations[currentLang].edit}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteRequest(request.id)}>
                        {translations[currentLang].delete}
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRequest ? translations[currentLang].edit : translations[currentLang].addRequest}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showModal && message && (
            <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} mb-3`}>
              {message}
            </div>
          )}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].product}</Form.Label>
              <Typeahead
                id="product-search"
                labelKey="name"
                options={products || []}
                placeholder={translations[currentLang].placeholderSearch}
                onChange={handleProductChange}
                defaultSelected={
                  newRequest.product_id && products.length > 0
                    ? [products.find(p => p.id === newRequest.product_id) || { name: 'Unknown', id: newRequest.product_id }]
                    : []
                }
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
              <Form.Label>{translations[currentLang].note}</Form.Label>
              <Form.Control
                type="text"
                value={newRequest.note || ''}
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {translations[currentLang].close}
          </Button>
          <Button variant="primary" onClick={handleAddOrEditRequest}>
            {translations[currentLang].save}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>{translations[currentLang].requestDetails}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <>
              <p><strong>{translations[currentLang].productName}:</strong> {selectedRequest.product?.name || 'Unknown'}</p>
              <p><strong>{translations[currentLang].quantity}:</strong> {selectedRequest.quantity}</p>
              <p><strong>{translations[currentLang].warehouse}:</strong> {selectedRequest.warehouse?.name || 'Unknown'}</p>
              <p><strong>{translations[currentLang].direction}:</strong> 
                {selectedRequest.direction === 'out' ? translations[currentLang].receive : translations[currentLang].return}
              </p>
              <p><strong>{translations[currentLang].note}:</strong> {selectedRequest.note || translations[currentLang].none}</p>
              <p><strong>{translations[currentLang].priority}:</strong> 
                {selectedRequest.priority === 1 ? translations[currentLang].urgent : translations[currentLang].normal}
              </p>
              <p><strong>{translations[currentLang].status}:</strong> 
                {selectedRequest.status === 'pending' ? translations[currentLang].pending : translations[currentLang].done}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            {translations[currentLang].close}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Requests;