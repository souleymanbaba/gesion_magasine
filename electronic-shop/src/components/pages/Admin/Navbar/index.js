import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Style.css';

const AdminNavbar = () => {
  return (
    <Navbar bg="info" variant="dark" expand="lg" className="position-fixed top-0 w-100 z-index-1">
      <Container>
        <Navbar.Brand>Admin Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link> */}
          </Nav>
          <Nav>
            {/* Add Button with link for Logout */}
            <Button className="custom-logout-btn" as={Link} to="/logout">
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
