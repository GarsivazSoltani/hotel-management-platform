// src/services/productService.js
const API_URL = 'http://localhost:8000/api';

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) throw new Error('Error fetching products');
  return await response.json();
};

export const addProduct = async (product) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Error adding product');
  return await response.json();
};

export const updateProduct = async (id, product) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Error updating product');
  return await response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error deleting product');
  return await response.json();
};

export const updateStock = async (id, stock) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock }),
  });
  if (!response.ok) throw new Error('Error updating stock');
  return await response.json();
};

export const getWarehouses = async () => {
  const response = await fetch(`${API_URL}/warehouses`);
  if (!response.ok) throw new Error('Error fetching warehouses');
  return await response.json();
};

export const getItemRequests = async () => {
  const response = await fetch(`${API_URL}/item-requests`);
  if (!response.ok) throw new Error('Error fetching item requests');
  return await response.json();
};

export const addItemRequest = async (request) => {
  const response = await fetch(`${API_URL}/item-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error adding item request: ${errorText}`);
  }
  return await response.json();
};

export const updateItemRequest = async (id, data) => {
  const response = await fetch(`${API_URL}/item-requests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error updating item request: ${errorText}`);
  }
  return await response.json();
};

export const deleteItemRequest = async (id) => {
  const response = await fetch(`${API_URL}/item-requests/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error deleting item request');
  return await response.json();
};