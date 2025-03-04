import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import useItemRequests from '../../hooks/useItemRequests';
import { updateStock, updateItemRequest } from '../../services/productService';
import { useLanguage } from '../../lang/LanguageContext';
import './Tasks.css';

const Tasks = () => {
  const { itemRequests, loading, error, fetchItemRequests } = useItemRequests();
  const { currentLang, translations } = useLanguage();
  const [message, setMessage] = useState('');

  const handleCompleteTask = async (request) => {
    try {
      const currentProduct = request.product;
      const newStock = request.direction === 'out' 
        ? currentProduct.stock - request.quantity 
        : currentProduct.stock + request.quantity;
      if (newStock < 0) {
        alert(translations[currentLang].stockError.replace('{max}', currentProduct.stock));
        return;
      }
      await updateStock(request.product_id, newStock);
      await updateItemRequest(request.id, { status: 'done', completed_by: 1 });
      await fetchItemRequests();
      setMessage(request.direction === 'out' ? translations[currentLang].stockDecreased : translations[currentLang].stockIncreased);
    } catch (error) {
      setMessage(translations[currentLang].taskFailed);
      console.error('خطا در انجام تسک:', error);
    }
  };

  if (loading) return <div>{translations[currentLang].loading}</div>;
  if (error) return <div>{error}</div>;

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
              <th>{translations[currentLang].warehouse}</th>
              <th>{translations[currentLang].direction}</th>
              <th>{translations[currentLang].note}</th>
              <th>{translations[currentLang].priority}</th>
              <th>{translations[currentLang].status}</th>
              <th>{translations[currentLang].actions}</th>
            </tr>
          </thead>
          <tbody>
            {itemRequests.map((request) => (
              <tr key={request.id} className={request.status === 'done' ? 'text-muted' : ''}>
                <td>{request.product.name}</td>
                <td>{request.quantity}</td>
                <td>{request.warehouse.name}</td>
                <td>{request.direction === 'out' ? translations[currentLang].receive : translations[currentLang].return}</td>
                <td>{request.note || translations[currentLang].none}</td>
                <td>{request.priority === 1 ? translations[currentLang].urgent : translations[currentLang].normal}</td>
                <td>{request.status === 'pending' ? translations[currentLang].pending : translations[currentLang].done}</td>
                <td>
                  {request.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleCompleteTask(request)}
                    >
                      {translations[currentLang].execute}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Tasks;