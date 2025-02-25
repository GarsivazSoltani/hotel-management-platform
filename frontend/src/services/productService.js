// src/services/productService.js

const API_URL = 'http://localhost:8000/api/products';

export const getProducts = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error fetching products');
  }
  return await response.json();
};

export const addProduct = async (product) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  });
  if (!response.ok) {
    throw new Error('Error adding product');
  }
  return await response.json();
};

export const updateProduct = async (id, product) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  });
  if (!response.ok) {
    throw new Error('Error updating product');
  }
  return await response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Error deleting product');
  }
  return response;
};
