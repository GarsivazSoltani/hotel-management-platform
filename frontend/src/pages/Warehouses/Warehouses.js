// src/pages/Warehouses/Warehouses.js
import React, { useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import useWarehouses from '../../hooks/useWarehouses';
import { useLanguage } from '../../lang/LanguageContext';
import './Warehouses.css';

const Warehouses = () => {
  const { warehouses, setWarehouses, loading, error } = useWarehouses();
  const { currentLang, translations } = useLanguage();
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setName(warehouse.name);
    setLocation(warehouse.location);
    setMessage('');
    setIsAdding(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/warehouses/${editingWarehouse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, location }),
      });
      if (!response.ok) throw new Error('خطا در شبکه');
      const updatedWarehouse = await response.json();
      setWarehouses((prev) =>
        prev.map((wh) => (wh.id === updatedWarehouse.id ? updatedWarehouse : wh))
      );
      setEditingWarehouse(null);
      setName('');
      setLocation('');
      setMessage(translations[currentLang].addSuccess.replace('اضافه', 'به‌روزرسانی'));
    } catch (error) {
      setMessage(translations[currentLang].addError.replace('اضافه', 'به‌روزرسانی'));
      console.error('خطا در به‌روزرسانی انبار:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/warehouses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('خطا در شبکه');
      setWarehouses((prev) => prev.filter((wh) => wh.id !== id));
      setMessage(translations[currentLang].addSuccess.replace('اضافه', 'حذف'));
    } catch (error) {
      setMessage(translations[currentLang].addError.replace('اضافه', 'حذف'));
      console.error('خطا در حذف انبار:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, location }),
      });
      if (!response.ok) throw new Error('خطا در شبکه');
      const newWarehouse = await response.json();
      setWarehouses((prev) => [...prev, newWarehouse]);
      setIsAdding(false);
      setName('');
      setLocation('');
      setMessage(translations[currentLang].addSuccess);
    } catch (error) {
      setMessage(translations[currentLang].addError);
      console.error('خطا در اضافه کردن انبار:', error);
    }
  };

  if (loading) return <div>{translations[currentLang].loading}</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{translations[currentLang].warehouses}</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {isAdding || editingWarehouse ? (
        <div className="card p-4 mb-4">
          <h2>{isAdding ? translations[currentLang].addWarehouse : translations[currentLang].editWarehouse}</h2>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].name}</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={translations[currentLang].enterWarehouseName || 'نام انبار را وارد کنید'}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>{translations[currentLang].location || 'مکان'}</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={translations[currentLang].enterLocation || 'مکان را وارد کنید'}
              />
            </Form.Group>
            <Button
              variant="primary"
              className="mt-3 me-2"
              onClick={isAdding ? handleAdd : handleSave}
            >
              {translations[currentLang].save}
            </Button>
            <Button
              variant="secondary"
              className="mt-3"
              onClick={() => {
                setIsAdding(false);
                setEditingWarehouse(null);
                setName('');
                setLocation('');
              }}
            >
              {translations[currentLang].cancel || 'لغو'}
            </Button>
          </Form>
        </div>
      ) : (
        <>
          <Button className="btn btn-success mb-3" onClick={() => setIsAdding(true)}>
            {translations[currentLang].addNewWarehouse || 'اضافه کردن انبار جدید'}
          </Button>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>{translations[currentLang].name}</th>
                  <th>{translations[currentLang].location}</th>
                  <th>{translations[currentLang].actions}</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((warehouse) => (
                  <tr key={warehouse.id}>
                    <td>{warehouse.name}</td>
                    <td>{warehouse.location}</td>
                    <td>
                      <Button className="me-2" variant="primary" onClick={() => handleEdit(warehouse)}>
                        {translations[currentLang].edit || 'ویرایش'}
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(warehouse.id)}>
                        {translations[currentLang].delete}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default Warehouses;