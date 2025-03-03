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
  const status = response.status;
  const text = await response.text();
  console.log('Response Status:', status, 'Text:', text);
  if (!response.ok) throw new Error('Error adding product');
  return JSON.parse(text);
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