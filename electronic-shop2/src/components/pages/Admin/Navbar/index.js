import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaBars, FaShoppingCart, FaTags } from 'react-icons/fa';
import { IoMdApps, IoIosListBox } from 'react-icons/io';
import { BiLogOut } from 'react-icons/bi';
import './Header.css';
import { savelang } from '../../Account/userStorageService';

function NavigationBar() {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  // Set language from localStorage on initial load
  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
      setSelectedLanguage(storedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    localStorage.setItem('selectedLanguage', lng); // Store selected language in localStorage
  };

  const directionClass = selectedLanguage === 'ar' ? 'rtl' : 'ltr';

  return (
    <Navbar bg="primary" variant="dark" expand="lg" dir={directionClass} className={`navbar-${directionClass}`}>
      <Container>
        <Navbar.Brand as={Link} to="#">{t('appName')}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <FaBars />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin/Categorie">
              <IoMdApps /> {t('category')}
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/ProductsA">
              <FaShoppingCart /> {t('produ')}
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/orders">
              <IoIosListBox /> {t('ord')}
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/Marque">
              <FaTags /> {t('orders.marque')}
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={() => changeLanguage('fr')} active={selectedLanguage === 'fr'}>
              FR
            </Nav.Link>
            <Nav.Link onClick={() => changeLanguage('ar')} active={selectedLanguage === 'ar'}>
              SA
            </Nav.Link>
            <Nav.Link as={Link} to="/logout">
              <BiLogOut /> {t('logout')}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
