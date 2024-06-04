import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import '../../style.css';
import { isLoggedIn } from '../pages/Account/userStorageService';


function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedInState(isLoggedIn());
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg" id="navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" id="logo">
            <span id="span1">E</span>Lectronic <span>Shop</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen ? 'true' : 'false'}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/" onClick={closeMenu}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products" onClick={closeMenu}>
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about" onClick={closeMenu}>
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact" onClick={closeMenu}>
                  Contact
                </Link>
              </li>
            </ul>
           
            <div className="container-fluid p-2">
              <div className="d-flex justify-content-end">
                {isLoggedInState ? (
                  <Link to="/logout" className="btn btn-primary d-flex align-items-center" onClick={closeMenu}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                    <FontAwesomeIcon icon={faUser} />
                  </Link>
                ) : (
                  <Link to="/SigIn" className="btn btn-primary" onClick={closeMenu}>
                    <FontAwesomeIcon icon={faSignInAlt} /> Login
                  </Link>
                )}
                <Link to="/cart" className="btn btn-primary position-relative" onClick={closeMenu}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                      <span className="visually-hidden">items in cart</span>
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default Navbar;
