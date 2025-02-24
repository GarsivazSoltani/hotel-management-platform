import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start bg-dark navbar-custom">
      <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
        <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap">
          <use xlinkHref="#bootstrap"></use>
        </svg>
      </a>

      <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
        <li><Link to="/" className="nav-link px-2 text-secondary">Home</Link></li>
        <li><Link to="/warehouses" className="nav-link px-2 text-white">Warehouses</Link></li>
        <li><Link to="/products" className="nav-link px-2 text-white">Products</Link></li>
        <li><Link to="/inventories" className="nav-link px-2 text-white">Inventories</Link></li>
        <li><Link to="/inventory-changes" className="nav-link px-2 text-white">Inventory Changes</Link></li>
      </ul>

      <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
        <input type="search" className="form-control form-control-dark text-bg-dark" placeholder="Search..." aria-label="Search" />
      </form>

      <div className="text-end">
        <button type="button" className="btn btn-outline-light">Login</button>
        <button type="button" className="btn btn-warning">Sign-up</button>
      </div>
    </div>
  );
};

export default Navbar;
