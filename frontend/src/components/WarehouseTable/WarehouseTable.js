import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const WarehouseTable = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/warehouses');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWarehouses(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setName(warehouse.name);
    setLocation(warehouse.location);
    setMessage('');
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/warehouses/${editingWarehouse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, location }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedWarehouse = await response.json();
      setWarehouses((prevWarehouses) =>
        prevWarehouses.map((wh) => (wh.id === updatedWarehouse.id ? updatedWarehouse : wh))
      );
      setEditingWarehouse(null);
      setName('');
      setLocation('');
      setMessage('Warehouse updated successfully!');
    } catch (error) {
      setError('Error updating warehouse');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/warehouses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setWarehouses((prevWarehouses) => prevWarehouses.filter((wh) => wh.id !== id));
      setMessage('Warehouse deleted successfully!');
    } catch (error) {
      setError('Error deleting warehouse');
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/warehouses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, location }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const newWarehouse = await response.json();
      setWarehouses((prevWarehouses) => [...prevWarehouses, newWarehouse]);
      setIsAdding(false);
      setName('');
      setLocation('');
      setMessage('Warehouse added successfully!');
    } catch (error) {
      setError('Error adding warehouse');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Warehouse List</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {isAdding ? (
        <div className="card p-4 mb-4">
          <h2 className="card-title">Add New Warehouse</h2>
          <form>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-primary mt-3" onClick={handleAdd}>
              Add
            </button>
            <button type="button" className="btn btn-secondary mt-3 ml-2" onClick={() => setIsAdding(false)}>
              Cancel
            </button>
          </form>
        </div>
      ) : editingWarehouse ? (
        <div className="card p-4 mb-4">
          <h2 className="card-title">Edit Warehouse</h2>
          <form>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-primary mt-3" onClick={handleSave}>
              Save
            </button>
            <button type="button" className="btn btn-secondary mt-3 ml-2" onClick={() => setEditingWarehouse(null)}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <>
          <button className="btn btn-success mb-3" onClick={() => setIsAdding(true)}>
            Add New Warehouse
          </button>
          <table className="table table-striped table-responsive">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td>{warehouse.name}</td>
                  <td>{warehouse.location}</td>
                  <td>
                    <button className="btn btn-primary mr-2" onClick={() => handleEdit(warehouse)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(warehouse.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default WarehouseTable;
