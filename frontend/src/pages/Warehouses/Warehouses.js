// src/pages/Warehouses/Warehouses.js
import React, { useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import useWarehouses from '../../hooks/useWarehouses'; // هوک جدید برای انبارها
import './Warehouses.css';

// کامپوننت صفحه انبارها برای مدیریت انبارها
const Warehouses = () => {
  const { warehouses, setWarehouses, loading, error } = useWarehouses(); // حذف fetchWarehouses
  const [editingWarehouse, setEditingWarehouse] = useState(null); // انبار در حال ویرایش
  const [name, setName] = useState(''); // نام انبار
  const [location, setLocation] = useState(''); // مکان انبار
  const [isAdding, setIsAdding] = useState(false); // وضعیت اضافه کردن
  const [message, setMessage] = useState(''); // پیام موفقیت یا خطا

  // ویرایش انبار
  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setName(warehouse.name);
    setLocation(warehouse.location);
    setMessage('');
    setIsAdding(false);
  };

  // ذخیره تغییرات انبار
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
      setMessage('倉庫が正常に更新されました！'); // پیام ژاپنی
    } catch (error) {
      setMessage('倉庫の更新に失敗しました'); // پیام ژاپنی
      console.error('خطا در به‌روزرسانی انبار:', error);
    }
  };

  // حذف انبار
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/warehouses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('خطا در شبکه');
      setWarehouses((prev) => prev.filter((wh) => wh.id !== id));
      setMessage('倉庫が正常に削除されました！'); // پیام ژاپنی
    } catch (error) {
      setMessage('倉庫の削除に失敗しました'); // پیام ژاپنی
      console.error('خطا در حذف انبار:', error);
    }
  };

  // اضافه کردن انبار جدید
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
      setMessage('倉庫が正常に追加されました！'); // پیام ژاپنی
    } catch (error) {
      setMessage('倉庫の追加に失敗しました'); // پیام ژاپنی
      console.error('خطا در اضافه کردن انبار:', error);
    }
  };

  // نمایش وضعیت در حال بارگذاری یا خطا
  if (loading) return <div>倉庫を読み込み中...</div>; // پیام ژاپنی
  if (error) return <div>{error}</div>;

  return (
    <div className="table-responsive">
      <h1>倉庫リスト</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {isAdding || editingWarehouse ? (
        <div className="card p-4 mb-4">
          <h2>{isAdding ? '倉庫を追加' : '倉庫を編集'}</h2>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>名前</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="倉庫名を入力してください"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>場所</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="場所を入力してください"
              />
            </Form.Group>
            <Button
              variant="primary"
              className="mt-3 me-2"
              onClick={isAdding ? handleAdd : handleSave}
            >
              保存
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
              キャンセル
            </Button>
          </Form>
        </div>
      ) : (
        <>
          <Button className="btn btn-success mb-3" onClick={() => setIsAdding(true)}>
            新しい倉庫を追加
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>名前</th>
                <th>場所</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td>{warehouse.name}</td>
                  <td>{warehouse.location}</td>
                  <td>
                    <Button className="me-2" variant="primary" onClick={() => handleEdit(warehouse)}>
                      編集
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(warehouse.id)}>
                      削除
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default Warehouses;