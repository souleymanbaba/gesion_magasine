// src/components/Sidebar.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './sytle.css';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column vh-100 bg-dark text-white p-3" style={{ width: '250px' }}>
      <h2>Admin</h2>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/admin/Categorie" className="text-white">Category</Nav.Link>
        <Nav.Link as={Link} to="ProductsA" className="text-white">Products</Nav.Link>
        <Nav.Link as={Link} to="/admin/orders" className="text-white">Orders</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
