// src/services/productService.js
const API_URL = 'http://localhost:8000/api';

// گرفتن لیست محصولات
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) throw new Error('Error fetching products');
  return await response.json();
};

// اضافه کردن محصول جدید
export const addProduct = async (product) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const status = response.status;
  const text = await response.text();
  console.log('Response Status:', status, 'Text:', text);
  if (!response.ok) throw new Error('Error adding product');
  return JSON.parse(text);
};

// به‌روزرسانی محصول
export const updateProduct = async (id, product) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Error updating product');
  return await response.json();
};

// حذف محصول
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error deleting product');
  return await response.json();
};

// به‌روزرسانی موجودی محصول
export const updateStock = async (id, stock) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock }),
  });
  if (!response.ok) throw new Error('Error updating stock');
  return await response.json();
};

// گرفتن لیست انبارها
export const getWarehouses = async () => {
  const response = await fetch(`${API_URL}/warehouses`);
  if (!response.ok) throw new Error('Error fetching warehouses');
  return await response.json();
};

// گرفتن لیست درخواست‌های اقلام
export const getItemRequests = async () => {
  const response = await fetch(`${API_URL}/item-requests`);
  if (!response.ok) throw new Error('Error fetching item requests');
  return await response.json();
};

// اضافه کردن درخواست جدید
export const addItemRequest = async (request) => {
  const response = await fetch(`${API_URL}/item-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error('Error adding item request');
  return await response.json();
};

// به‌روزرسانی وضعیت درخواست
export const updateItemRequest = async (id, data) => {
  const response = await fetch(`${API_URL}/item-requests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error updating item request');
  return await response.json();
};