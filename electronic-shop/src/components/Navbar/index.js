import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '../../style.css';

function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <>
      <div className="container-fluid p-2">
        <div className="d-flex justify-content-end">
          <Link to="/SigIn" className="btn btn-primary">
            <FontAwesomeIcon icon={faSignInAlt} /> Login
          </Link>
          {/* <Link to="/SignUp" className="btn btn-primary">
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </Link> */}
          <Link to="/cart" className="btn btn-primary position-relative">
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
      <nav className="navbar navbar-expand-lg" id="navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" id="logo">
            <span id="span1">E</span>Lectronic <span>Shop</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>
              </li>
             
            </ul>
            <form className="d-flex" id="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
