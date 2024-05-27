import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThList, faBox, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  return (
    <div className="position-fixed top-0 bottom-0 bg-info text-white p-3" style={{ width: '250px' }}>
      <h2 className="text-center mb-4">Admin</h2>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/admin/Categorie" className="text-white d-flex align-items-center mb-3">
          <FontAwesomeIcon icon={faThList} className="me-2" />
          Category
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/ProductsA" className="text-white d-flex align-items-center mb-3">
          <FontAwesomeIcon icon={faBox} className="me-2" />
          Products
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/orders" className="text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
          Orders
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
