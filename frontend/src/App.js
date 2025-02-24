import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Warehouses from './pages/Warehouses/Warehouses';
// import Products from './pages/Products/Products';
// import Inventories from './pages/Inventories/Inventories';
// import InventoryChanges from './pages/InventoryChanges/InventoryChanges';
import Navbar from './components/Navbar/Navbar';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/warehouses" element={<Warehouses />} />
            {/* <Route path="/products" element={<Products />} /> */}
            {/* <Route path="/inventories" element={<Inventories />} /> */}
            {/* <Route path="/inventory-changes" element={<InventoryChanges />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
