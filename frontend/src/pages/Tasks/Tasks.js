// src/pages/Tasks/Tasks.js
import React, { useState } from 'react';
import { Button, Table, Modal } from 'react-bootstrap';
import useItemRequests from '../../hooks/useItemRequests';
import { updateStock, updateItemRequest } from '../../services/productService';
import { useLanguage } from '../../lang/LanguageContext';
import './Tasks.css';

const Tasks = () => {
  const { itemRequests, loading, error, fetchItemRequests } = useItemRequests();
  const { currentLang, translations } = useLanguage();
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // وضعیت مودال
  const [selectedRequest, setSelectedRequest] = useState(null); // درخواست انتخاب‌شده برای مودال

  // تابع انجام تسک
  const handleCompleteTask = async (request) => {
    try {
      const currentProduct = request.product;
      const newStock = request.direction === 'out' 
        ? currentProduct.stock - request.quantity 
        : currentProduct.stock + request.quantity;
      if (newStock < 0) {
        setMessage(translations[currentLang].stockError.replace('{max}', currentProduct.stock));
        return;
      }
      await updateStock(request.product_id, newStock); // آپدیت موجودی محصول
      await updateItemRequest(request.id, { ...request, status: 'done', completed_by: 1 }); // ارسال کل اطلاعات درخواست با وضعیت جدید
      await fetchItemRequests(); // بروزرسانی لیست درخواست‌ها
      setMessage(request.direction === 'out' ? translations[currentLang].stockDecreased : translations[currentLang].stockIncreased);
    } catch (error) {
      setMessage(translations[currentLang].taskFailed);
      console.error('خطا در انجام تسک:', error); // لاگ خطا برای دیباگ
    }
  };

  // تابع باز کردن مودال برای جزئیات
  const handleShowModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  // تابع بستن مودال
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  if (loading) return <div>{translations[currentLang].loading}</div>;
  if (error) return <div>{error}</div>;

  // فقط تسک‌های در انتظار رو فیلتر کن
  const pendingRequests = itemRequests.filter(request => request.status === 'pending');

  return (
    <div>
      <h1>{translations[currentLang].tasks}</h1>
      {message && <div className="alert alert-success">{message}</div>}
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
            {pendingRequests.map((request) => (
              <tr key={request.id}>
                <td>
                  <Button variant="link" onClick={() => handleShowModal(request)}>
                    {request.product.name}
                  </Button>
                </td>
                <td>{request.quantity}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleCompleteTask(request)}
                  >
                    {translations[currentLang].execute}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* مودال برای نمایش جزئیات تسک */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{translations[currentLang].taskDetails}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <>
              <p><strong>{translations[currentLang].productName}:</strong> {selectedRequest.product.name}</p>
              <p><strong>{translations[currentLang].quantity}:</strong> {selectedRequest.quantity}</p>
              <p><strong>{translations[currentLang].warehouse}:</strong> {selectedRequest.warehouse.name}</p>
              <p><strong>{translations[currentLang].direction}:</strong> 
                {selectedRequest.direction === 'out' ? translations[currentLang].receive : translations[currentLang].return}
              </p>
              <p><strong>{translations[currentLang].note}:</strong> {selectedRequest.note || translations[currentLang].none}</p>
              <p><strong>{translations[currentLang].priority}:</strong> 
                {selectedRequest.priority === 1 ? translations[currentLang].urgent : translations[currentLang].normal}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {translations[currentLang].close}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tasks;