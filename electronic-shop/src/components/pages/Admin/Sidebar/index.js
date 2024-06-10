import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Header.css';  // Assurez-vous de créer un fichier CSS pour le style du footer

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <Container>
        <Row>
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} E-Commerce Admin. All rights reserved.</p>
            <p>Contact: admin@example.com</p>
            <p>Follow us on 
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white ml-2">Twitter</a>, 
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white ml-2">Facebook</a>, 
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white ml-2">Instagram</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
